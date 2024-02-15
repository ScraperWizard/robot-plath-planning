import { ServerMethods, ClientMethods } from "../Components/Server/types";
import { Arena } from "../Components/Arena/Arena";
import Robot from "../Components/Robot/Robot";
import { RobotLookingAngles } from "../Components/Robot/types";
import ArenaCoordinate from "../Components/Arena/ArenaCoordinate";
import { ItemSize, ItemsTypes } from "../Components/Item/types";
import { Item } from "../Components/Item/Item";
import Client from "../Components/Client/Client";
import { constants } from "./constants";
import * as net from "net";
import RobotViewItem from "../Components/Robot/RobotView";
import { convertPathIntoRobotMovements, findBestPathForRobot } from "../Utils/Algorithms/Algorithms";
import ArenaPlotter from "../Components/Arena/ArenaPlotter";
import * as fs from "fs";
import Cell from "../Components/Arena/Cell";
const methodListeners = {};
const distanceFactor = 0.7;
clearLogFile();
logToFile("Starting server");

function createNewRobotAndArena() {
  const VirtualArena: Arena = new Arena(constants.LENGTH_OF_MAP, constants.WIDTH_OF_MAP);
  const robot: Robot = new Robot({
    size: constants.ROBOT_RADIUS, // Size factor of the robot
    lookingAngle: RobotLookingAngles.DOWN, // Angle at which the robot is looking
    viewOfAngle: constants.VIEW_ANGLE_OF_ROBOT, // View of angle of the robot
    viewOfDistance: constants.VIEW_DISTANCE_OF_ROBOT, // View of distance of the robot
    arena: VirtualArena,
  });

  // VirtualArena.displayLiveGrid(100);

  const RobotCoordinate: ArenaCoordinate = new ArenaCoordinate(0, 0);
  const ArenaPlotterI: ArenaPlotter = new ArenaPlotter(VirtualArena);

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
  ArenaPlotterI.plotItem(new ArenaCoordinate(0, VirtualArena.getHeight() - 1), new Item(ItemsTypes.Bin, ItemSize.SMALL));
  ArenaPlotterI.plotItem(new ArenaCoordinate(VirtualArena.getWidth() - 1, 0), new Item(ItemsTypes.Bin, ItemSize.SMALL));
  ArenaPlotterI.plotItem(new ArenaCoordinate(0, 1), new Item(ItemsTypes.Trash, ItemSize.SMALL));

  const client = new Client(VirtualArena, robot, socket);

  socket.on("data", async (data) => {
    const { method, payload } = parseIncomingData(data);

    logToFile(`Received data from client: ${method} ${payload?.data?.length} ${JSON.stringify(payload)}`);

    if (method == ClientMethods.READY) {
      while (VirtualArena.containsItem(ItemsTypes.Bin)) {
        // Ask robot to scan and get objects around it
        sendMessage(socket, ServerMethods.REPORT_SURROUNDING_OBJECTS, {});
        client.setClientReady();

        // Objects automatically get added into the arena
        await waitForEvent(socket, ClientMethods.REGISTER_VIEW_OBJECTS);

        const nearestBin = VirtualArena.getClosestItem(ItemsTypes.Bin);
        logToFile("Nearest bin: ", nearestBin);
        const bestPath = findBestPathForRobot({ arena: VirtualArena, goal: nearestBin });
        logToFile("Best path to bin: ", bestPath);

        // If the path to a bin is defined go there
        if (bestPath.length > 0) {
          const robotMovements = convertPathIntoRobotMovements(bestPath, robot);
          logToFile("Robot movements: ", robotMovements);

          await executeMovementArray(socket, robotMovements, VirtualArena, robot);
          logToFile("Robot reached the bin, exiting loop");
          break;
        }

        // If the path to a bin is not defined explore more
        const furthestObstacle = VirtualArena.getFarthestItem(ItemsTypes.Obstacle);
        const nearestVisitedItemFromBin: Cell = VirtualArena.getClosestVisitedCell(furthestObstacle);
        const pathToNearestVisitedItemFromBin = findBestPathForRobot({ arena: VirtualArena, goal: nearestVisitedItemFromBin });
        logToFile("Path to closest visited cell to bin: ", pathToNearestVisitedItemFromBin);
        const robotMovements = convertPathIntoRobotMovements(pathToNearestVisitedItemFromBin, robot);
        logToFile("Robot movements to closest visited cell to bin: ", robotMovements);

        await executeMovementArray(socket, robotMovements, VirtualArena, robot);
      }
    }

    if (method == ClientMethods.REGISTER_VIEW_OBJECTS) {
      logToFile(payload);
      for (let i = 0; i < payload.length; i++) {
        const ViewObject: RobotViewItem = new RobotViewItem({
          angle: payload[i].angle,
          distance: payload[i].distance / constants.DISTANCE_FACTOR,
          type: payload[i].type,
          size: ItemSize.SMALL,
        });

        VirtualArena.addItemByView(ViewObject);
      }
    }
  });

  socket.on("end", () => {
    logToFile("Client disconnected");
  });
});

function sendMessage(server: any, methodname: string, data: any) {
  data.method_name = methodname;
  server.write(JSON.stringify(data));
  logToFile("Sent data to client: ", methodname);
}

function waitForEvent(server: any, event: string) {
  return new Promise((resolve) => {
    methodListeners[event] = resolve;
  });
}

function processEvent(event: string, data: any) {
  if (methodListeners[event]) {
    methodListeners[event](data);
  }
}

function parseIncomingData(data: any) {
  let method: any | null = null;

  try {
    method = JSON.parse(data.toString());
    data = method["data"];
    processEvent(method["method_name"], data);
  } catch {
    logToFile("Error parsing data");
  }

  if (method == null) {
    return { method: null, payload: null };
  } else {
    return {
      method: method["method_name"],
      payload: method["data"],
    };
  }
}

function logToFile(...args: any[]) {
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

async function executeMovementArray(socket: any, movements: any, VirtualArena: Arena, robot: Robot) {
  for (let i = 0; i < movements.length; i++) {
    const movement: any = movements[i];
    logToFile("Sending movement: ", movement);

    if (movement[0] == "move") {
      sendMessage(socket, ServerMethods.MOVE_ROBOT, {
        distance: movement[1] * distanceFactor,
        angle: 0,
      });

      VirtualArena.moveRobotForward(movement[1]);
    } else if (movement[0] == "rotate") {
      sendMessage(socket, ServerMethods.ROTATE_ROBOT, {
        distance: 0,
        angle: movement[1],
      });

      robot.rotateDegrees(movement[1]);
    }

    await waitForEvent(socket, movement[0] == "move" ? ClientMethods.ROBOT_MOVED : ClientMethods.ROBOT_ROTATED);
  }
}

const PORT = 4000;
const HOST = "0.0.0.0";

server.listen(PORT, HOST, () => {
  console.log(`Server listening on ${HOST}:${PORT}`);
});
