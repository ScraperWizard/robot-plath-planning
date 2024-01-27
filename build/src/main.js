"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const types_1 = require("../Components/Server/types");
const Arena_1 = require("../Components/Arena/Arena");
const Robot_1 = __importDefault(require("../Components/Robot/Robot"));
const types_2 = require("../Components/Robot/types");
const ArenaCoordinate_1 = __importDefault(require("../Components/Arena/ArenaCoordinate"));
const types_3 = require("../Components/Item/types");
const Item_1 = require("../Components/Item/Item");
const app = (0, express_1.default)();
const webServer = http_1.default.createServer(app);
const io = new socket_io_1.Server(webServer, {
    cors: {
        methods: ["GET", "POST"],
    },
});
io.on("connection", (socket) => {
    console.log("A user connected!");
    // const VirtualArena: Arena = new Arena();
    socket.on(types_1.ServerMethods.REPORT_SURROUNDING_OBJECTS, (data) => { });
    socket.on(types_1.ServerMethods.REPORT_UNEXEPCTED_OBJECTS, (data) => {
        socket.emit(types_1.ClientMethods.STOP_CLIENT_EXECUTION, {});
    });
    socket.on("test-astar-pathfinding", (data) => {
        let oldRobot = data.robot;
        const robot = new Robot_1.default({
            size: oldRobot.width,
            lookingAngle: types_2.RobotLookingAngles.DOWN,
            viewOfAngle: 100,
            viewOfDistance: 50,
        });
        const RobotCoord = {
            x: oldRobot.y,
            y: oldRobot.x,
        };
        const VirtualArena = new Arena_1.Arena(1000, 800);
        const RobotCoordinate = new ArenaCoordinate_1.default(RobotCoord.x, RobotCoord.y);
        VirtualArena.plotRobot(RobotCoordinate, robot);
        for (const key in data) {
            const item = data[key];
            if (item.id == "robot")
                continue;
            const ItemCoord = {
                x: item.y,
                y: item.x,
            };
            const newItem = new Item_1.Item(item.id.includes("obstacle") ? types_3.ItemsTypes.Obstacle : types_3.ItemsTypes.Trash);
            newItem.setSize(item.width);
            const ItemCoordinate = new ArenaCoordinate_1.default(ItemCoord.x, ItemCoord.y);
            VirtualArena.plotItemByXY(ItemCoordinate, newItem);
        }
        console.log("Added items", Object.keys(data).length);
        console.log("Farthest trash", VirtualArena.getFarthestItem(types_3.ItemsTypes.Trash));
        // console.log("Closest trash", VirtualArena.getClosestItem(ItemsTypes.Trash))
    });
    socket.on("disconnect", () => {
        console.log(`${socket.id} disconnected!`);
    });
});
webServer.listen(process.env.PORT || 4000, async () => {
    console.log(`Server is running on PORT ${process.env.PORT || 4000}...`);
});
//# sourceMappingURL=main.js.map