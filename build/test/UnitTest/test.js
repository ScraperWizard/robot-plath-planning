"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Arena_js_1 = require("../../Components/Arena/Arena.js");
const types_js_1 = require("../../Components/Robot/types.js");
const types_js_2 = require("../../Components/Item/types.js");
const RobotView_js_1 = __importDefault(require("../../Components/Robot/RobotView.js"));
const types_js_3 = require("../../Components/Item/types.js");
const Robot_js_1 = __importDefault(require("../../Components/Robot/Robot.js"));
const ArenaCoordinate_js_1 = __importDefault(require("../../Components/Arena/ArenaCoordinate.js"));
const Algorithms_js_1 = require("../../Utils/Algorithms/Algorithms.js");
const numberOfRowsArena = 10;
const numberOfColsArena = 8;
const SizeOfRobot = 2;
const ViewAngleOfRobot = 180;
const ViewDistanceOfRobot = 4;
const VirtualArena = new Arena_js_1.Arena(numberOfColsArena, numberOfRowsArena);
const robot = new Robot_js_1.default({
    size: SizeOfRobot, // Size factor of the robot
    lookingAngle: types_js_1.RobotLookingAngles.UP, // Angle at which the robot is looking
    viewOfAngle: ViewAngleOfRobot, // View of angle of the robot
    viewOfDistance: ViewDistanceOfRobot, // View of distance of the robot
});
const RobotCoord = {
    // Center of the map
    x: 4,
    y: 3,
};
const RobotCoordinate = new ArenaCoordinate_js_1.default(RobotCoord.x, RobotCoord.y);
// Plot the robot
VirtualArena.plotRobot(RobotCoordinate, robot);
VirtualArena.displayGrid();
process.exit(0);
// Create a TrashView and plot it as well
const TrashView = new RobotView_js_1.default({
    angle: 45,
    distance: 2,
    type: types_js_2.ItemsTypes.Trash,
    size: types_js_3.ItemSize.SMALL,
});
VirtualArena.addItemByView(TrashView);
const TrashView1 = new RobotView_js_1.default({
    angle: 0,
    distance: 2,
    type: types_js_2.ItemsTypes.Obstacle,
    size: types_js_3.ItemSize.SMALL,
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
if (VirtualArena.containsItem(types_js_2.ItemsTypes.Wall)) {
    console.log("Arena has a wall");
}
if (VirtualArena.containsItem(types_js_2.ItemsTypes.Trash)) {
    console.log("Arena has trash");
}
if (VirtualArena.containsItem(types_js_2.ItemsTypes.Bin)) {
    console.log("Arena has bin");
}
if (VirtualArena.containsItem(types_js_2.ItemsTypes.Obstacle)) {
    console.log("Arena has obstacle");
}
const goal = VirtualArena.getFarthestItem(types_js_2.ItemsTypes.Trash);
console.log("Our current goal (Fathest item): ", goal);
const bestPath = (0, Algorithms_js_1.findBestPathForRobot)({
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
if (VirtualArena.containsItem(types_js_2.ItemsTypes.Wall)) {
    console.log("Contains wall");
}
if (VirtualArena.containsItem(types_js_2.ItemsTypes.Trash)) {
    console.log("Contains trash");
}
function generateRandomTrashViews(numItems) {
    for (let i = 0; i < numItems; i++) {
        const randomAngle = Math.random() * 360; // Random angle between 0 and 360
        const randomDistance = Math.random() * 100; // Random distance between 0 and 100
        const randomSize = Math.random() > 0.5 ? types_js_3.ItemSize.SMALL : types_js_3.ItemSize.LARGE; // Random size
        const TrashView = new RobotView_js_1.default({
            angle: randomAngle,
            distance: randomDistance,
            type: types_js_2.ItemsTypes.Trash,
            size: randomSize,
        });
        VirtualArena.addItemByView(TrashView);
    }
}
function displayAllItems() {
    const items = VirtualArena.getItems();
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        console.log(item.getPosition());
    }
}
//# sourceMappingURL=test.js.map