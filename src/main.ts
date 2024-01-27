import express from "express";
import http from "http";
import { Server } from "socket.io";
import { ServerMethods, ClientMethods } from "../Components/Server/types";
import { Arena } from "../Components/Arena/Arena";
import Robot from "../Components/Robot/Robot";
import { RobotLookingAngles } from "../Components/Robot/types";
import ArenaCoordinate from "../Components/Arena/ArenaCoordinate";
import { ItemsTypes } from "../Components/Item/types";
import { Item } from "../Components/Item/Item";

const app = express();
const webServer = http.createServer(app);

const io = new Server(webServer, {
  cors: {
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected!");

  // const VirtualArena: Arena = new Arena();
  socket.on(ServerMethods.REPORT_SURROUNDING_OBJECTS, (data) => {});

  socket.on(ServerMethods.REPORT_UNEXEPCTED_OBJECTS, (data) => {
    socket.emit(ClientMethods.STOP_CLIENT_EXECUTION, {});
  });

  socket.on("test-astar-pathfinding", (data) => {
    let oldRobot = data.robot
    const robot = new Robot({
      size: oldRobot.width,
      lookingAngle: RobotLookingAngles.DOWN,
      viewOfAngle: 100,
      viewOfDistance: 50,
    });

    const RobotCoord: any = {
      x: oldRobot.y,
      y: oldRobot.x,
    };

    const VirtualArena: Arena = new Arena(1000, 800);
    const RobotCoordinate: ArenaCoordinate = new ArenaCoordinate(RobotCoord.x, RobotCoord.y);
    VirtualArena.plotRobot(RobotCoordinate, robot);

    for(const key in data) {
      const item = data[key];
    
      if(item.id == "robot") continue;
    
      const ItemCoord: any = {
        x: item.y,
        y: item.x,
      };
    
      const newItem: Item = new Item(item.id.includes("obstacle") ? ItemsTypes.Obstacle : ItemsTypes.Trash);
      newItem.setSize(item.width);
    
      const ItemCoordinate: ArenaCoordinate = new ArenaCoordinate(ItemCoord.x, ItemCoord.y);
      VirtualArena.plotItemByXY(ItemCoordinate, newItem);
    }

    console.log("Added items", Object.keys(data).length)
    
    console.log("Farthest trash", VirtualArena.getFarthestItem(ItemsTypes.Trash))
    // console.log("Closest trash", VirtualArena.getClosestItem(ItemsTypes.Trash))
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected!`);
  });
});

webServer.listen(process.env.PORT || 4000, async () => {
  console.log(`Server is running on PORT ${process.env.PORT || 4000}...`);
});
