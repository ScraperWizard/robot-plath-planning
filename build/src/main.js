"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../Components/Server/types");
const Arena_1 = require("../Components/Arena/Arena");
const Robot_1 = __importDefault(require("../Components/Robot/Robot"));
const types_2 = require("../Components/Robot/types");
const ArenaCoordinate_1 = __importDefault(require("../Components/Arena/ArenaCoordinate"));
const types_3 = require("../Components/Item/types");
const Item_1 = require("../Components/Item/Item");
const Client_1 = __importDefault(require("../Components/Client/Client"));
const constants_1 = require("./constants");
const net = __importStar(require("net"));
const RobotView_1 = __importDefault(require("../Components/Robot/RobotView"));
const Algorithms_1 = require("../Utils/Algorithms/Algorithms");
const ArenaPlotter_1 = __importDefault(require("../Components/Arena/ArenaPlotter"));
const fs = __importStar(require("fs"));
const methodListeners = {};
const distanceFactor = 0.7;
clearLogFile();
logToFile("Starting server");
function createNewRobotAndArena() {
    const VirtualArena = new Arena_1.Arena(constants_1.constants.LENGTH_OF_MAP, constants_1.constants.WIDTH_OF_MAP);
    const robot = new Robot_1.default({
        size: constants_1.constants.ROBOT_RADIUS, // Size factor of the robot
        lookingAngle: types_2.RobotLookingAngles.DOWN, // Angle at which the robot is looking
        viewOfAngle: constants_1.constants.VIEW_ANGLE_OF_ROBOT, // View of angle of the robot
        viewOfDistance: constants_1.constants.VIEW_DISTANCE_OF_ROBOT, // View of distance of the robot
        arena: VirtualArena,
    });
    // VirtualArena.displayLiveGrid(100);
    const RobotCoordinate = new ArenaCoordinate_1.default(0, 0);
    const ArenaPlotterI = new ArenaPlotter_1.default(VirtualArena);
    // Plot the robot
    ArenaPlotterI.plotRobot(RobotCoordinate, robot);
    return { VirtualArena, robot, ArenaPlotterI };
}
createNewRobotAndArena();
const server = net.createServer((socket) => {
    logToFile("Client connected");
    const { VirtualArena, robot, ArenaPlotterI } = createNewRobotAndArena();
    socket.setEncoding("utf-8");
    socket.setNoDelay(true);
    socket.setKeepAlive(true, 60000);
    // Plot trash bin item on edges
    ArenaPlotterI.plotItem(new ArenaCoordinate_1.default(0, VirtualArena.getHeight() - 1), new Item_1.Item(types_3.ItemsTypes.Bin, types_3.ItemSize.SMALL));
    ArenaPlotterI.plotItem(new ArenaCoordinate_1.default(VirtualArena.getWidth() - 1, 0), new Item_1.Item(types_3.ItemsTypes.Bin, types_3.ItemSize.SMALL));
    ArenaPlotterI.plotItem(new ArenaCoordinate_1.default(0, 1), new Item_1.Item(types_3.ItemsTypes.Trash, types_3.ItemSize.SMALL));
    const client = new Client_1.default(VirtualArena, robot, socket);
    socket.on("data", async (data) => {
        const { method, payload } = parseIncomingData(data);
        logToFile(`Received data from client: ${method} ${payload?.data?.length} ${JSON.stringify(payload)}`);
        if (method == types_1.ClientMethods.READY) {
            while (VirtualArena.containsItem(types_3.ItemsTypes.Bin)) {
                // Ask robot to scan and get objects around it
                sendMessage(socket, types_1.ServerMethods.REPORT_SURROUNDING_OBJECTS, {});
                client.setClientReady();
                // Objects automatically get added into the arena
                await waitForEvent(socket, types_1.ClientMethods.REGISTER_VIEW_OBJECTS);
                const nearestBin = VirtualArena.getClosestItem(types_3.ItemsTypes.Bin);
                logToFile("Nearest bin: ", nearestBin);
                const bestPath = (0, Algorithms_1.findBestPathForRobot)({ arena: VirtualArena, goal: nearestBin });
                logToFile("Best path to bin: ", bestPath);
                // If the path to a bin is defined go there
                if (bestPath.length > 0) {
                    const robotMovements = (0, Algorithms_1.convertPathIntoRobotMovements)(bestPath, robot);
                    logToFile("Robot movements: ", robotMovements);
                    await executeMovementArray(socket, robotMovements, VirtualArena, robot);
                    logToFile("Robot reached the bin, exiting loop");
                    break;
                }
                // If the path to a bin is not defined explore more
                const furthestObstacle = VirtualArena.getFarthestItem(types_3.ItemsTypes.Obstacle);
                const nearestVisitedItemFromBin = VirtualArena.getClosestVisitedCell(furthestObstacle);
                const pathToNearestVisitedItemFromBin = (0, Algorithms_1.findBestPathForRobot)({ arena: VirtualArena, goal: nearestVisitedItemFromBin });
                logToFile("Path to closest visited cell to bin: ", pathToNearestVisitedItemFromBin);
                const robotMovements = (0, Algorithms_1.convertPathIntoRobotMovements)(pathToNearestVisitedItemFromBin, robot);
                logToFile("Robot movements to closest visited cell to bin: ", robotMovements);
                await executeMovementArray(socket, robotMovements, VirtualArena, robot);
            }
        }
        if (method == types_1.ClientMethods.REGISTER_VIEW_OBJECTS) {
            logToFile(payload);
            for (let i = 0; i < payload.length; i++) {
                const ViewObject = new RobotView_1.default({
                    angle: payload[i].angle,
                    distance: payload[i].distance / constants_1.constants.DISTANCE_FACTOR,
                    type: payload[i].type,
                    size: types_3.ItemSize.SMALL,
                });
                VirtualArena.addItemByView(ViewObject);
            }
        }
    });
    socket.on("end", () => {
        logToFile("Client disconnected");
    });
});
function sendMessage(server, methodname, data) {
    data.method_name = methodname;
    server.write(JSON.stringify(data));
    logToFile("Sent data to client: ", methodname);
}
function waitForEvent(server, event) {
    return new Promise((resolve) => {
        methodListeners[event] = resolve;
    });
}
function processEvent(event, data) {
    if (methodListeners[event]) {
        methodListeners[event](data);
    }
}
function parseIncomingData(data) {
    let method = null;
    try {
        method = JSON.parse(data.toString());
        data = method["data"];
        processEvent(method["method_name"], data);
    }
    catch {
        logToFile("Error parsing data");
    }
    if (method == null) {
        return { method: null, payload: null };
    }
    else {
        return {
            method: method["method_name"],
            payload: method["data"],
        };
    }
}
function logToFile(...args) {
    const text = args.join(" ");
    fs.appendFile("log.txt", text + "\n", (err) => {
        if (err) {
            console.error("Failed to write to file:", err);
        }
        console.log(text);
    });
}
function clearLogFile() {
    fs.writeFile("log.txt", "", (err) => {
        if (err) {
            console.error("Failed to clear the file:", err);
        }
    });
}
async function executeMovementArray(socket, movements, VirtualArena, robot) {
    for (let i = 0; i < movements.length; i++) {
        const movement = movements[i];
        logToFile("Sending movement: ", movement);
        if (movement[0] == "move") {
            sendMessage(socket, types_1.ServerMethods.MOVE_ROBOT, {
                distance: movement[1] * distanceFactor,
                angle: 0,
            });
            VirtualArena.moveRobotForward(movement[1]);
        }
        else if (movement[0] == "rotate") {
            sendMessage(socket, types_1.ServerMethods.ROTATE_ROBOT, {
                distance: 0,
                angle: movement[1],
            });
            robot.rotateDegrees(movement[1]);
        }
        await waitForEvent(socket, movement[0] == "move" ? types_1.ClientMethods.ROBOT_MOVED : types_1.ClientMethods.ROBOT_ROTATED);
    }
}
const PORT = 4000;
const HOST = "0.0.0.0";
server.listen(PORT, HOST, () => {
    console.log(`Server listening on ${HOST}:${PORT}`);
});
//# sourceMappingURL=main.js.map