import { Arena } from "../../Components/Arena/Arena.js";
import { RobotLookingAngles } from "../../Components/Robot/types.js";
import { Item } from "../../Components/Item/Item.js";
import { ItemsTypes } from "../../Components/Item/types.js";
import RobotViewItem from "../../Components/Robot/RobotView.js";
import { ItemSize } from "../../Components/Item/types.js";
import Robot from "../../Components/Robot/Robot.js";
import ArenaCoordinate from "../../Components/Arena/ArenaCoordinate.js";
import { findBestPathForRobot } from "../../Utils/Algorithms/Algorithms.js";
import { ArenaProps } from "../../Components/Arena/types.js";
const numberOfRowsArena: number = 10;
const numberOfColsArena: number = 8;
const SizeOfRobot: number = 2;
const ViewAngleOfRobot: number = 180;
const ViewDistanceOfRobot: number = 4;

const VirtualArena: Arena = new Arena(numberOfColsArena, numberOfRowsArena);

const robot: Robot = new Robot({
  size: SizeOfRobot, // Size factor of the robot
  lookingAngle: RobotLookingAngles.UP, // Angle at which the robot is looking
  viewOfAngle: ViewAngleOfRobot, // View of angle of the robot
  viewOfDistance: ViewDistanceOfRobot, // View of distance of the robot
});

const RobotCoord: any = {
  // Center of the map
  x: 4,
  y: 3,
};


const RobotCoordinate: ArenaCoordinate = new ArenaCoordinate(RobotCoord.x, RobotCoord.y);

// Plot the robot
VirtualArena.plotRobot(RobotCoordinate, robot);
VirtualArena.displayGrid();

process.exit(0);

// Create a TrashView and plot it as well
const TrashView = new RobotViewItem({
  angle: 45,
  distance: 2,
  type: ItemsTypes.Trash,
  size: ItemSize.SMALL,
});

VirtualArena.addItemByView(TrashView);

const TrashView1 = new RobotViewItem({
  angle: 0,
  distance: 2,
  type: ItemsTypes.Obstacle,
  size: ItemSize.SMALL,
});

// VirtualArena.plotPoint(5, 0);
// VirtualArena.plotPoint(6, 0);
// VirtualArena.plotPoint(7, 0);
// VirtualArena.plotPoint(5, 1);
// VirtualArena.plotPoint(5, 2);
// VirtualArena.plotPoint(6, 2);
// VirtualArena.plotPoint(7, 2);

// while(VirtualArena.containsItem(ItemsTypes.Trash) || VirtualArena.containsProp(ArenaProps.UndescoveredArea)) {
//   if(!VirtualArena.containsItem(ItemsTypes.Trash)) {
//     // Go to nearest unknown area

//     // const nearestUnknownArea: ArenaCoordinate = {
//     //   arena: VirtualArena,
//     //   scoreThreashold: 0.5,
//     // }

//     // await robot.moveTowards(nearestUnknownArea);
//     // continue;
//   }

//   // const nearestTrash: Item = VirtualArena.getNearestItem(ItemsTypes.Trash);
//   // await robot.moveTowards(nearestTrash);

//   // if(robot.isAt(nearestTrash)) {
//   //   await robot.pickUpItem(nearestTrash);
//   // } else {
//   //   await robot.rotateToPickUpItem(nearestTrash);
//   // }

//   // const nearestBin: Item = VirtualArena.getNearestItem(ItemsTypes.Bin);
//   // await robot.moveTowards(nearestBin);

//   // if(robot.isAt(nearestBin)) {
//   //   await robot.dropItem(nearestTrash);
//   // } else {
//   //   await robot.rotateToDropItem(nearestBin);
//   // }

//   continue;
// }

VirtualArena.addItemByView(TrashView1);
VirtualArena.displayGrid();

if (!VirtualArena.isPlotted()) {
  console.log(`Virtual arena has not bee plotted yet, going to farthest object in order to find the edges of the arena`);
}

if (VirtualArena.containsItem(ItemsTypes.Wall)) {
  console.log("Arena has a wall");
}

if (VirtualArena.containsItem(ItemsTypes.Trash)) {
  console.log("Arena has trash");
}

if (VirtualArena.containsItem(ItemsTypes.Bin)) {
  console.log("Arena has bin");
}

if (VirtualArena.containsItem(ItemsTypes.Obstacle)) {
  console.log("Arena has obstacle");
}

const goal: Item | null = VirtualArena.getFarthestItem(ItemsTypes.Trash);

console.log("Our current goal (Fathest item): ", goal);

const bestPath = findBestPathForRobot({
  arena: VirtualArena,
  goal,
});

console.log("Best path to get there ", bestPath);

// generateRandomTrashViews(10);
VirtualArena.startTrackingEvents();

VirtualArena.addItemByView(TrashView);
VirtualArena.addItemByView(TrashView1);
// VirtualArena.addItemByView(TrashView2)
VirtualArena.stopTrackingEvents();

if (VirtualArena.containsItem(ItemsTypes.Wall)) {
  console.log("Contains wall");
}

if (VirtualArena.containsItem(ItemsTypes.Trash)) {
  console.log("Contains trash");
}

function generateRandomTrashViews(numItems: number): void {
  for (let i = 0; i < numItems; i++) {
    const randomAngle = Math.random() * 360; // Random angle between 0 and 360
    const randomDistance = Math.random() * 100; // Random distance between 0 and 100
    const randomSize = Math.random() > 0.5 ? ItemSize.SMALL : ItemSize.LARGE; // Random size

    const TrashView = new RobotViewItem({
      angle: randomAngle,
      distance: randomDistance,
      type: ItemsTypes.Trash,
      size: randomSize,
    });

    VirtualArena.addItemByView(TrashView);
  }
}

function displayAllItems() {
  const items: Array<Item> = VirtualArena.getItems();
  for (let i = 0; i < items.length; i++) {
    const item: Item = items[i];
    console.log(item.getPosition());
  }
}
