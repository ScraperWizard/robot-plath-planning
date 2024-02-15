"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Arena_js_1 = require("../../Components/Arena/Arena.js");
const types_js_1 = require("../../Components/Robot/types.js");
const Item_js_1 = require("../../Components/Item/Item.js");
const types_js_2 = require("../../Components/Item/types.js");
const types_js_3 = require("../../Components/Item/types.js");
const Robot_js_1 = __importDefault(require("../../Components/Robot/Robot.js"));
const ArenaCoordinate_js_1 = __importDefault(require("../../Components/Arena/ArenaCoordinate.js"));
const ArenaPlotter_js_1 = __importDefault(require("../../Components/Arena/ArenaPlotter.js"));
const width = 40;
const height = 32;
test("Create arena", () => {
    const VirtualArena = new Arena_js_1.Arena(width, height);
    expect(VirtualArena.getWidth()).toBe(width);
    expect(VirtualArena.getHeight()).toBe(height);
    expect(VirtualArena.getGrid()[0].length).toBe(width);
    expect(VirtualArena.getGrid().length).toBe(height);
});
test("Create robot", () => {
    const VirtualArena = new Arena_js_1.Arena(width, height);
    const VirtualRobot = new Robot_js_1.default({
        size: 1,
        lookingAngle: types_js_1.RobotLookingAngles.UP,
        viewOfAngle: 90,
        viewOfDistance: 3,
        arena: VirtualArena,
    });
    expect(VirtualRobot.getSize()).toBe(1);
    expect(VirtualRobot.getViewOfAngle()).toBe(90);
    expect(VirtualRobot.getViewOfDistance()).toBe(3);
    expect(VirtualRobot.getLookingAngle()).toBe(types_js_1.RobotLookingAngles.UP);
    expect(VirtualRobot.getArena()).toBe(VirtualArena);
});
describe("VirtualArenaPlotter", () => {
    let VirtualArena;
    let VirtualArenaPlotter;
    let VirtualRobot;
    beforeEach(() => {
        VirtualArena = new Arena_js_1.Arena(width, height);
        VirtualArenaPlotter = new ArenaPlotter_js_1.default(VirtualArena);
        VirtualRobot = new Robot_js_1.default({
            size: 1,
            lookingAngle: types_js_1.RobotLookingAngles.UP,
            viewOfAngle: 90,
            viewOfDistance: 3,
            arena: VirtualArena,
        });
    });
    it("Item at 0,0 should be robot", () => {
        const VirtualRobotCoordinate = new ArenaCoordinate_js_1.default(0, 0);
        VirtualArenaPlotter.plotRobot(VirtualRobotCoordinate, VirtualRobot);
        expect(VirtualArena.getGrid()[0][0].getItem()).toBe(VirtualRobot);
    });
    it("Arena should contain the correct robot instance", () => {
        const VirtualRobotCoordinate = new ArenaCoordinate_js_1.default(0, 0);
        VirtualArenaPlotter.plotRobot(VirtualRobotCoordinate, VirtualRobot);
        expect(VirtualArena.getRobot()).toBe(VirtualRobot);
    });
    it("Can't plot 2 robots", () => {
        const VirtualRobotCoordinate = new ArenaCoordinate_js_1.default(0, 0);
        VirtualArenaPlotter.plotRobot(VirtualRobotCoordinate, VirtualRobot);
        expect(() => VirtualArenaPlotter.plotRobot(VirtualRobotCoordinate, VirtualRobot)).toThrow("Robot already exists");
        expect(VirtualArena.getRobot()).toBe(VirtualRobot);
    });
    it("Plot a big robot x1", () => {
        const VirtualRobotCoordinate = new ArenaCoordinate_js_1.default(10, 10);
        VirtualRobot.setSize(2);
        expect(() => VirtualArenaPlotter.plotRobot(VirtualRobotCoordinate, VirtualRobot)).not.toThrow();
        expect(VirtualArena.getRobot()).toBe(VirtualRobot);
        expect(VirtualArena.getGrid()[10][10].getItem()).toBe(VirtualRobot);
        expect(VirtualArena.getGrid()[10][11].getItem()).toBe(VirtualRobot);
        expect(VirtualArena.getGrid()[11][10].getItem()).toBe(VirtualRobot);
        expect(VirtualArena.getGrid()[11][11].getItem()).toBe(VirtualRobot);
        expect(VirtualRobot.getPosition()).toEqual([
            new ArenaCoordinate_js_1.default(9, 9),
            new ArenaCoordinate_js_1.default(10, 9),
            new ArenaCoordinate_js_1.default(11, 9),
            new ArenaCoordinate_js_1.default(9, 10),
            new ArenaCoordinate_js_1.default(10, 10),
            new ArenaCoordinate_js_1.default(11, 10),
            new ArenaCoordinate_js_1.default(9, 11),
            new ArenaCoordinate_js_1.default(10, 11),
            new ArenaCoordinate_js_1.default(11, 11),
        ]);
    });
    it("Plot a big robot x2", () => {
        const VirtualRobotCoordinate = new ArenaCoordinate_js_1.default(10, 10);
        VirtualRobot.setSize(5);
        expect(() => VirtualArenaPlotter.plotRobot(VirtualRobotCoordinate, VirtualRobot)).not.toThrow();
        expect(VirtualArena.getRobot()).toBe(VirtualRobot);
        expect(VirtualArena.getGrid()[10][14].getItem()).toBe(VirtualRobot);
        expect(VirtualArena.getGrid()[6][10].getItem()).toBe(VirtualRobot);
        expect(VirtualArena.getGrid()[14][10].getItem()).toBe(VirtualRobot);
    });
    it("Plot a big robot x3", () => {
        const VirtualRobotCoordinate = new ArenaCoordinate_js_1.default(20, 20);
        VirtualRobot.setSize(10);
        expect(() => VirtualArenaPlotter.plotRobot(VirtualRobotCoordinate, VirtualRobot)).not.toThrow();
        expect(VirtualArena.getRobot()).toBe(VirtualRobot);
        expect(VirtualArena.getGrid()[20][29].getItem()).toBe(VirtualRobot);
        expect(VirtualArena.getGrid()[29][20].getItem()).toBe(VirtualRobot);
    });
    it("Plot a robot bigger than arena", () => {
        const VirtualRobotCoordinate = new ArenaCoordinate_js_1.default(0, 0);
        VirtualRobot.setSize(100);
        expect(() => VirtualArenaPlotter.plotRobot(VirtualRobotCoordinate, VirtualRobot)).toThrow("Item could not be plotted, Coordinates out of bound");
        expect(VirtualArena.getRobot()).not.toBe(VirtualRobot);
    });
    it("Should throw error because robot is out of bounds", () => {
        const VirtualRobotCoordinate = new ArenaCoordinate_js_1.default(0, 0);
        VirtualRobot.setSize(5);
        expect(() => VirtualArenaPlotter.plotRobot(VirtualRobotCoordinate, VirtualRobot)).toThrow("Item could not be plotted, Coordinates out of bound");
        expect(VirtualArena.getRobot()).not.toBe(VirtualRobot);
    });
    it("Should work because robot fits", () => {
        const VirtualRobotCoordinate = new ArenaCoordinate_js_1.default(0, 0);
        VirtualRobot.setSize(1);
        expect(() => VirtualArenaPlotter.plotRobot(VirtualRobotCoordinate, VirtualRobot)).not.toThrow("Item could not be plotted, out of bounds");
        expect(VirtualArena.getGrid()[0][0].getItem()).toBe(VirtualRobot);
        expect(VirtualArena.getRobot()).toBe(VirtualRobot);
    });
    it("Should override an item at the same coordinate with robot", () => {
        const VirtualRobotCoordinate = new ArenaCoordinate_js_1.default(0, 0);
        const randomItem = new Item_js_1.Item(types_js_2.ItemsTypes.Trash, types_js_3.ItemSize.SMALL);
        VirtualRobot.setSize(1);
        VirtualArenaPlotter.plotItem(VirtualRobotCoordinate, randomItem);
        expect(() => VirtualArenaPlotter.plotRobot(VirtualRobotCoordinate, VirtualRobot)).not.toThrow();
    });
    it("Should throw error when height is out of bounds", () => {
        const heightOutOfBounds = new ArenaCoordinate_js_1.default(0, height + 1);
        expect(() => VirtualArenaPlotter.plotRobot(heightOutOfBounds, VirtualRobot)).toThrow("Item could not be plotted, Coordinates out of bound");
    });
    it("Should throw error when width is out of bounds", () => {
        const widthOutOfBounds = new ArenaCoordinate_js_1.default(width + 1, 0);
        expect(() => VirtualArenaPlotter.plotRobot(widthOutOfBounds, VirtualRobot)).toThrow("Item could not be plotted, Coordinates out of bound");
    });
    it("Should throw error when height is negative", () => {
        const negativeHeight = new ArenaCoordinate_js_1.default(0, -1);
        expect(() => VirtualArenaPlotter.plotRobot(negativeHeight, VirtualRobot)).toThrow("Item could not be plotted, Coordinates out of bound");
    });
    it("Should throw error when width is negative", () => {
        const negativeWidth = new ArenaCoordinate_js_1.default(-1, 0);
        expect(() => VirtualArenaPlotter.plotRobot(negativeWidth, VirtualRobot)).toThrow("Item could not be plotted, Coordinates out of bound");
    });
    it("Should throw error when height and width are negative", () => {
        const negativeHeightAndWidth = new ArenaCoordinate_js_1.default(-1, -1);
        expect(() => VirtualArenaPlotter.plotRobot(negativeHeightAndWidth, VirtualRobot)).toThrow("Item could not be plotted, Coordinates out of bound");
    });
    it("Should throw error when at edge height", () => {
        const EdgeHeight = new ArenaCoordinate_js_1.default(0, height);
        expect(() => VirtualArenaPlotter.plotRobot(EdgeHeight, VirtualRobot)).toThrow("Item could not be plotted, Coordinates out of bound");
    });
    it("Should throw error when at edge width", () => {
        const EdgeWidth = new ArenaCoordinate_js_1.default(width, 0);
        expect(() => VirtualArenaPlotter.plotRobot(EdgeWidth, VirtualRobot)).toThrow("Item could not be plotted, Coordinates out of bound");
    });
    it("Should throw error when at edge height and width", () => {
        const EdgeAndWidth = new ArenaCoordinate_js_1.default(width, height);
        expect(() => VirtualArenaPlotter.plotRobot(EdgeAndWidth, VirtualRobot)).toThrow("Item could not be plotted, Coordinates out of bound");
    });
    it("Should not throw error when robot is at height bounds", () => {
        const heightBounds = new ArenaCoordinate_js_1.default(0, height - VirtualRobot.getSize());
        expect(() => VirtualArenaPlotter.plotRobot(heightBounds, VirtualRobot)).not.toThrow();
        expect(VirtualArena.getGrid()[height - VirtualRobot.getSize()][0].getItem()).toBe(VirtualRobot);
        expect(VirtualArena.getRobot()).toBe(VirtualRobot);
    });
    it("Should not throw error when robot is at width bounds", () => {
        const widthBounds = new ArenaCoordinate_js_1.default(width - VirtualRobot.getSize(), 0);
        expect(() => VirtualArenaPlotter.plotRobot(widthBounds, VirtualRobot)).not.toThrow();
        expect(VirtualArena.getGrid()[0][width - VirtualRobot.getSize()].getItem()).toBe(VirtualRobot);
        expect(VirtualArena.getRobot()).toBe(VirtualRobot);
    });
    it("Should not throw error when robot is at height and width bounds", () => {
        const heightAndWidthBounds = new ArenaCoordinate_js_1.default(width - VirtualRobot.getSize(), height - VirtualRobot.getSize());
        expect(() => VirtualArenaPlotter.plotRobot(heightAndWidthBounds, VirtualRobot)).not.toThrow("Item could not be plotted, Coordinates out of bound");
        expect(VirtualArena.getGrid()[height - VirtualRobot.getSize()][width - VirtualRobot.getSize()].getItem()).toBe(VirtualRobot);
        expect(VirtualArena.getRobot()).toBe(VirtualRobot);
    });
    it("Should not throw error when robot is at edge", () => {
        const edge1 = new ArenaCoordinate_js_1.default(0, 0);
        expect(() => VirtualArenaPlotter.plotRobot(edge1, VirtualRobot)).not.toThrow("Item could not be plotted, Coordinates out of bound");
        expect(VirtualArena.getGrid()[0][0].getItem()).toBe(VirtualRobot);
        expect(VirtualArena.getRobot()).toBe(VirtualRobot);
    });
    it("Should mark view as visited, all angles", () => {
        const VirtualRobotCoordinate = new ArenaCoordinate_js_1.default(5, 5);
        VirtualRobot.setSize(1);
        VirtualRobot.setLookingAngle(types_js_1.RobotLookingAngles.UP);
        VirtualRobot.setViewOfDistance(1);
        VirtualRobot.setViewOfAngle(180);
        VirtualArenaPlotter.plotRobot(VirtualRobotCoordinate, VirtualRobot);
        expect(VirtualArena.getGrid()[4][5].getIsVisited()).toBe(true);
        expect(VirtualArena.getGrid()[5][6].getIsVisited()).toBe(true);
        expect(VirtualArena.getGrid()[5][4].getIsVisited()).toBe(true);
        VirtualRobot.setLookingAngle(types_js_1.RobotLookingAngles.RIGHT);
        VirtualArenaPlotter.updateRobotView();
        expect(VirtualArena.getGrid()[5][6].getIsVisited()).toBe(true);
        expect(VirtualArena.getGrid()[4][5].getIsVisited()).toBe(true);
        expect(VirtualArena.getGrid()[6][5].getIsVisited()).toBe(true);
        VirtualRobot.setLookingAngle(types_js_1.RobotLookingAngles.DOWN);
        VirtualRobot.setViewOfDistance(2);
        VirtualRobot.setViewOfAngle(100);
        VirtualArenaPlotter.updateRobotView();
        expect(VirtualArena.getGrid()[6][5].getIsVisited()).toBe(true);
        expect(VirtualArena.getGrid()[6][4].getIsVisited()).toBe(true);
        expect(VirtualArena.getGrid()[6][6].getIsVisited()).toBe(true);
        expect(VirtualArena.getGrid()[6][5].getIsVisited()).toBe(true);
        expect(VirtualArena.getGrid()[7][5].getIsVisited()).toBe(true);
    });
    it("Should mark view as visited, all angles, test size robot scaling", () => {
        const VirtualRobotCoordinate = new ArenaCoordinate_js_1.default(10, 10);
        VirtualRobot.setSize(2);
        VirtualRobot.setLookingAngle(types_js_1.RobotLookingAngles.UP);
        VirtualRobot.setViewOfDistance(5);
        VirtualRobot.setViewOfAngle(180);
        VirtualArenaPlotter.plotRobot(VirtualRobotCoordinate, VirtualRobot);
        expect(VirtualArena.getGrid()[10][12].getIsVisited()).toBe(false);
        expect(VirtualArena.getGrid()[10][8].getIsVisited()).toBe(false);
    });
    it("Should mark view as visited", () => {
        const VirtualRobotCoordinate = new ArenaCoordinate_js_1.default(5, 5);
        VirtualRobot.setSize(1);
        VirtualRobot.setLookingAngle(types_js_1.RobotLookingAngles.LEFT);
        VirtualRobot.setViewOfDistance(2);
        VirtualRobot.setViewOfAngle(180);
        VirtualArenaPlotter.plotRobot(VirtualRobotCoordinate, VirtualRobot);
        expect(VirtualArena.getGrid()[5][4].getIsVisited()).toBe(true);
        expect(VirtualArena.getGrid()[6][5].getIsVisited()).toBe(true);
    });
    // it("Should plot itemView at 0 angle looking up", () => {
    //   const VirtualRobotCoordinate: ArenaCoordinate = new ArenaCoordinate(5, 5);
    //   VirtualRobot.setSize(1);
    //   VirtualRobot.setLookingAngle(RobotLookingAngles.UP);
    //   const ViewObject: RobotViewItem = new RobotViewItem({
    //     angle: 0,
    //     distance: 2,
    //     type: ItemsTypes.Trash,
    //     size: ItemSize.SMALL,
    //   });
    //   VirtualArenaPlotter.plotRobot(VirtualRobotCoordinate, VirtualRobot);
    //   expect(() => VirtualArenaPlotter.plotItemByView(ViewObject)).not.toThrow();
    //   expect(VirtualArena.getGrid()[3][5].getItem().getType()).toBe(ItemsTypes.Trash);
    //   expect(VirtualArena.getGrid()[3][5].getItem().getPosition()).toHaveLength(1);
    // })
    // it("Should plot itemView at 90 angle looking up", () => {
    //   const VirtualRobotCoordinate: ArenaCoordinate = new ArenaCoordinate(5, 5);
    //   VirtualRobot.setSize(1);
    //   VirtualRobot.setLookingAngle(RobotLookingAngles.UP);
    //   const ViewObject: RobotViewItem = new RobotViewItem({
    //     angle: 90,
    //     distance: 2,
    //     type: ItemsTypes.Trash,
    //     size: ItemSize.SMALL,
    //   });
    //   VirtualArenaPlotter.plotRobot(VirtualRobotCoordinate, VirtualRobot);
    //   expect(() => VirtualArenaPlotter.plotItemByView(ViewObject)).not.toThrow();
    //   expect(VirtualArena.getGrid()[7][5].getItem().getType()).toBe(ItemsTypes.Trash);
    //   expect(VirtualArena.getGrid()[7][5].getItem().getPosition()).toHaveLength(1);
    // })
    // it("Should plot itemView at 180 angle looking up", () => {
    //   const VirtualRobotCoordinate: ArenaCoordinate = new ArenaCoordinate(5, 5);
    //   VirtualRobot.setSize(1);
    //   VirtualRobot.setLookingAngle(RobotLookingAngles.UP);
    //   const ViewObject: RobotViewItem = new RobotViewItem({
    //     angle: 180,
    //     distance: 2,
    //     type: ItemsTypes.Trash,
    //     size: ItemSize.SMALL,
    //   });
    //   VirtualArenaPlotter.plotRobot(VirtualRobotCoordinate, VirtualRobot);
    //   expect(() => VirtualArenaPlotter.plotItemByView(ViewObject)).not.toThrow();
    //   expect(VirtualArena.getGrid()[5][7].getItem().getType()).toBe(ItemsTypes.Trash);
    //   expect(VirtualArena.getGrid()[5][7].getItem().getPosition()).toHaveLength(1);
    // })
    // it("Should plot itemView at 270 angle looking up", () => {
    //   const VirtualRobotCoordinate: ArenaCoordinate = new ArenaCoordinate(5, 5);
    //   VirtualRobot.setSize(1);
    //   VirtualRobot.setLookingAngle(RobotLookingAngles.UP);
    //   const ViewObject: RobotViewItem = new RobotViewItem({
    //     angle: 270,
    //     distance: 2,
    //     type: ItemsTypes.Trash,
    //     size: ItemSize.SMALL,
    //   });
    //   VirtualArenaPlotter.plotRobot(VirtualRobotCoordinate, VirtualRobot);
    //   VirtualArenaPlotter.plotItemByView(ViewObject)
    //   // VirtualArena.displayGrid()
    //   // expect(() => VirtualArenaPlotter.plotItemByView(ViewObject)).not.toThrow();
    //   // expect(VirtualArena.getGrid()[5][3].getItem().getType()).toBe(ItemsTypes.Trash);
    //   // expect(VirtualArena.getGrid()[5][3].getItem().getPosition()).toHaveLength(1);
    // })
});
// describe("Path finding smoke test", () => {
//   const NumberOfTests = 100;
//   function executeCommands() {
//   }
//   const randomGeneratedArenas: Array<Arena> = getRandomArenas(NumberOfTests);
//   for (let i = 0; i < randomGeneratedArenas.length; i++) {
//     const arena: Arena = randomGeneratedArenas[i];
//     arena.displayGrid();
//     const closestTrash: Item = arena.getClosestItem(ItemsTypes.Trash);
//     const closestObstacle: Item = arena.getClosestItem(ItemsTypes.Obstacle);
//     it(`Should be able to identify nearest trash test ${i + 1}`, () => {
//       expect(closestTrash).not.toBe(null);
//       expect(arena.getGrid()[closestTrash.getPosition()[0].getX()][closestTrash.getPosition()[0].getY()].getItem().getType()).toBe(ItemsTypes.Trash)
//     });
//     it(`Should be able to identify nearest obstacle  test ${i + 1}`, () => {
//       expect(closestObstacle).not.toBe(null);
//       expect(arena.getGrid()[closestObstacle.getPosition()[0].getX()][closestObstacle.getPosition()[0].getY()].getItem().getType()).toBe(ItemsTypes.Obstacle)
//     })
//   }
// });
function generateRandomArenaWithRandomObjects() {
    const randomWidth = generateRandomInRange(5, 40, []);
    const randomHeight = generateRandomInRange(8, 42, []);
    const randomRobotSize = 1;
    const randomRobotViewOfAngle = generateRandomInRange(100, 180, []);
    ;
    const randomRobotViewOfDistance = generateRandomInRange(2, 4, []);
    const randomRobotCoordinateX = generateRandomInRange(6, 39, []);
    const randomRobotCoordinateY = generateRandomInRange(7, 40, []);
    const randomTrashItem = 5;
    const randomObstacleItem = 60;
    const robotLookingAnglesKeys = Object.keys(types_js_1.RobotLookingAngles).filter((k) => typeof types_js_1.RobotLookingAngles[k] === "number");
    const randomRobotLookingAngle = types_js_1.RobotLookingAngles[robotLookingAnglesKeys[Math.floor(Math.random() * robotLookingAnglesKeys.length)]];
    const VirtualArena = new Arena_js_1.Arena(randomWidth, randomHeight);
    const VirtualRobot = new Robot_js_1.default({
        size: randomRobotSize,
        lookingAngle: randomRobotLookingAngle,
        viewOfAngle: randomRobotViewOfAngle,
        viewOfDistance: randomRobotViewOfDistance,
        arena: VirtualArena,
    });
    const VirtualArenaPlotter = new ArenaPlotter_js_1.default(VirtualArena);
    VirtualArenaPlotter.plotRobot(new ArenaCoordinate_js_1.default(randomRobotCoordinateX, randomRobotCoordinateY), VirtualRobot);
    // Mark whole arena as visited
    for (let i = 0; i < randomWidth; i++) {
        for (let j = 0; j < randomHeight; j++) {
            VirtualArena.getGrid()[j][i].setIsVisited(true);
        }
    }
    for (let i = 0; i < randomTrashItem; i++) {
        const randomGeneratedTrash = new Item_js_1.Item(types_js_2.ItemsTypes.Trash, 1);
        const randomItemCoordinateX = generateRandomInRange(0, randomWidth - 1, [randomRobotCoordinateX]);
        const randomItemCoordinateY = generateRandomInRange(0, randomHeight - 1, [randomRobotCoordinateY]);
        VirtualArenaPlotter.plotItem(new ArenaCoordinate_js_1.default(randomItemCoordinateX, randomItemCoordinateY), randomGeneratedTrash);
    }
    for (let i = 0; i < randomObstacleItem; i++) {
        const randomGeneratedObstacle = new Item_js_1.Item(types_js_2.ItemsTypes.Obstacle, 1);
        const randomItemCoordinateX = generateRandomInRange(0, randomWidth - 1, [randomRobotCoordinateX]);
        const randomItemCoordinateY = generateRandomInRange(0, randomHeight - 1, [randomRobotCoordinateX]);
        VirtualArenaPlotter.plotItem(new ArenaCoordinate_js_1.default(randomItemCoordinateX, randomItemCoordinateY), randomGeneratedObstacle);
    }
    return VirtualArena;
}
function getRandomArenas(number) {
    const randomGeneratedArenas = [];
    for (let i = 0; i < number; i++) {
        try {
            randomGeneratedArenas.push(generateRandomArenaWithRandomObjects());
        }
        catch (err) {
            // console.error(err);
        }
    }
    return randomGeneratedArenas;
}
function generateRandomInRange(min, max, exclude) {
    let randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    while (exclude.includes(randomNum)) {
        randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    }
    return randomNum;
}
//# sourceMappingURL=test.js.map