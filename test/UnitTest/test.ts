import { Arena } from "../../Components/Arena/Arena.js";
import { RobotLookingAngles } from "../../Components/Robot/types.js";
import { Item } from "../../Components/Item/Item.js";
import { ItemsTypes } from "../../Components/Item/types.js";
import RobotViewItem from "../../Components/Robot/RobotView.js";
import { ItemSize } from "../../Components/Item/types.js";
import Robot from "../../Components/Robot/Robot.js";
import ArenaCoordinate from "../../Components/Arena/ArenaCoordinate.js";
import { findBestPathForRobot, convertPathIntoRobotMovements } from "../../Utils/Algorithms/Algorithms.js";
import { ArenaProps } from "../../Components/Arena/types.js";
import ArenaPlotter from "../../Components/Arena/ArenaPlotter.js";
const width: number = 40;
const height: number = 32;

test("Create arena", () => {
  const VirtualArena: Arena = new Arena(width, height);

  expect(VirtualArena.getWidth()).toBe(width);
  expect(VirtualArena.getHeight()).toBe(height);
  expect(VirtualArena.getGrid()[0].length).toBe(width);
  expect(VirtualArena.getGrid().length).toBe(height);
});

test("Create robot", () => {
  const VirtualArena: Arena = new Arena(width, height);

  const VirtualRobot: Robot = new Robot({
    size: 1,
    lookingAngle: RobotLookingAngles.UP,
    viewOfAngle: 90,
    viewOfDistance: 3,
    arena: VirtualArena,
  });

  expect(VirtualRobot.getSize()).toBe(1);
  expect(VirtualRobot.getViewOfAngle()).toBe(90);
  expect(VirtualRobot.getViewOfDistance()).toBe(3);
  expect(VirtualRobot.getLookingAngle()).toBe(RobotLookingAngles.UP);
  expect(VirtualRobot.getArena()).toBe(VirtualArena);
});

describe("VirtualArenaPlotter", () => {
  let VirtualArena: Arena;
  let VirtualArenaPlotter: ArenaPlotter;
  let VirtualRobot: Robot;

  beforeEach(() => {
    VirtualArena = new Arena(width, height);
    VirtualArenaPlotter = new ArenaPlotter(VirtualArena);

    VirtualRobot = new Robot({
      size: 1,
      lookingAngle: RobotLookingAngles.UP,
      viewOfAngle: 90,
      viewOfDistance: 3,
      arena: VirtualArena,
    });
  });

  it("Item at 0,0 should be robot", () => {
    const VirtualRobotCoordinate: ArenaCoordinate = new ArenaCoordinate(0, 0);
    VirtualArenaPlotter.plotRobot(VirtualRobotCoordinate, VirtualRobot);
    expect(VirtualArena.getGrid()[0][0].getItem()).toBe(VirtualRobot);
  });

  it("Arena should contain the correct robot instance", () => {
    const VirtualRobotCoordinate: ArenaCoordinate = new ArenaCoordinate(0, 0);
    VirtualArenaPlotter.plotRobot(VirtualRobotCoordinate, VirtualRobot);
    expect(VirtualArena.getRobot()).toBe(VirtualRobot);
  });

  it("Can't plot 2 robots", () => {
    const VirtualRobotCoordinate: ArenaCoordinate = new ArenaCoordinate(0, 0);
    VirtualArenaPlotter.plotRobot(VirtualRobotCoordinate, VirtualRobot);
    expect(() => VirtualArenaPlotter.plotRobot(VirtualRobotCoordinate, VirtualRobot)).toThrow("Robot already exists");
    expect(VirtualArena.getRobot()).toBe(VirtualRobot);
  });

  it("Plot a big robot x1", () => {
    const VirtualRobotCoordinate: ArenaCoordinate = new ArenaCoordinate(10, 10);
    VirtualRobot.setSize(2);
    expect(() => VirtualArenaPlotter.plotRobot(VirtualRobotCoordinate, VirtualRobot)).not.toThrow();
    expect(VirtualArena.getRobot()).toBe(VirtualRobot);
    expect(VirtualArena.getGrid()[10][10].getItem()).toBe(VirtualRobot);
    expect(VirtualArena.getGrid()[10][11].getItem()).toBe(VirtualRobot);
    expect(VirtualArena.getGrid()[11][10].getItem()).toBe(VirtualRobot);
    expect(VirtualArena.getGrid()[11][11].getItem()).toBe(VirtualRobot);
    expect(VirtualRobot.getPosition()).toEqual([
      new ArenaCoordinate(9, 9),
      new ArenaCoordinate(10, 9),
      new ArenaCoordinate(11, 9),
      new ArenaCoordinate(9, 10),
      new ArenaCoordinate(10, 10),
      new ArenaCoordinate(11, 10),
      new ArenaCoordinate(9, 11),
      new ArenaCoordinate(10, 11),
      new ArenaCoordinate(11, 11),
    ]);
  });

  it("Plot a big robot x2", () => {
    const VirtualRobotCoordinate: ArenaCoordinate = new ArenaCoordinate(10, 10);
    VirtualRobot.setSize(5);
    expect(() => VirtualArenaPlotter.plotRobot(VirtualRobotCoordinate, VirtualRobot)).not.toThrow();
    expect(VirtualArena.getRobot()).toBe(VirtualRobot);
    expect(VirtualArena.getGrid()[10][14].getItem()).toBe(VirtualRobot);
    expect(VirtualArena.getGrid()[6][10].getItem()).toBe(VirtualRobot);
    expect(VirtualArena.getGrid()[14][10].getItem()).toBe(VirtualRobot);
  });

  it("Plot a big robot x3", () => {
    const VirtualRobotCoordinate: ArenaCoordinate = new ArenaCoordinate(20, 20);
    VirtualRobot.setSize(10);
    expect(() => VirtualArenaPlotter.plotRobot(VirtualRobotCoordinate, VirtualRobot)).not.toThrow();
    expect(VirtualArena.getRobot()).toBe(VirtualRobot);
    expect(VirtualArena.getGrid()[20][29].getItem()).toBe(VirtualRobot);
    expect(VirtualArena.getGrid()[29][20].getItem()).toBe(VirtualRobot);
  });

  it("Plot a robot bigger than arena", () => {
    const VirtualRobotCoordinate: ArenaCoordinate = new ArenaCoordinate(0, 0);
    VirtualRobot.setSize(100);
    expect(() => VirtualArenaPlotter.plotRobot(VirtualRobotCoordinate, VirtualRobot)).toThrow("Item could not be plotted, Coordinates out of bound");
    expect(VirtualArena.getRobot()).not.toBe(VirtualRobot);
  });

  it("Should throw error because robot is out of bounds", () => {
    const VirtualRobotCoordinate: ArenaCoordinate = new ArenaCoordinate(0, 0);
    VirtualRobot.setSize(5);
    expect(() => VirtualArenaPlotter.plotRobot(VirtualRobotCoordinate, VirtualRobot)).toThrow("Item could not be plotted, Coordinates out of bound");
    expect(VirtualArena.getRobot()).not.toBe(VirtualRobot);
  });

  it("Should work because robot fits", () => {
    const VirtualRobotCoordinate: ArenaCoordinate = new ArenaCoordinate(0, 0);
    VirtualRobot.setSize(1);
    expect(() => VirtualArenaPlotter.plotRobot(VirtualRobotCoordinate, VirtualRobot)).not.toThrow("Item could not be plotted, out of bounds");
    expect(VirtualArena.getGrid()[0][0].getItem()).toBe(VirtualRobot);
    expect(VirtualArena.getRobot()).toBe(VirtualRobot);
  });

  it("Should override an item at the same coordinate with robot", () => {
    const VirtualRobotCoordinate: ArenaCoordinate = new ArenaCoordinate(0, 0);
    const randomItem: Item = new Item(ItemsTypes.Trash, ItemSize.SMALL);
    VirtualRobot.setSize(1);
    VirtualArenaPlotter.plotItem(VirtualRobotCoordinate, randomItem);
    expect(() => VirtualArenaPlotter.plotRobot(VirtualRobotCoordinate, VirtualRobot)).not.toThrow();
  });

  it("Should throw error when height is out of bounds", () => {
    const heightOutOfBounds = new ArenaCoordinate(0, height + 1);
    expect(() => VirtualArenaPlotter.plotRobot(heightOutOfBounds, VirtualRobot)).toThrow("Item could not be plotted, Coordinates out of bound");
  });

  it("Should throw error when width is out of bounds", () => {
    const widthOutOfBounds = new ArenaCoordinate(width + 1, 0);
    expect(() => VirtualArenaPlotter.plotRobot(widthOutOfBounds, VirtualRobot)).toThrow("Item could not be plotted, Coordinates out of bound");
  });

  it("Should throw error when height is negative", () => {
    const negativeHeight = new ArenaCoordinate(0, -1);
    expect(() => VirtualArenaPlotter.plotRobot(negativeHeight, VirtualRobot)).toThrow("Item could not be plotted, Coordinates out of bound");
  });

  it("Should throw error when width is negative", () => {
    const negativeWidth = new ArenaCoordinate(-1, 0);
    expect(() => VirtualArenaPlotter.plotRobot(negativeWidth, VirtualRobot)).toThrow("Item could not be plotted, Coordinates out of bound");
  });

  it("Should throw error when height and width are negative", () => {
    const negativeHeightAndWidth = new ArenaCoordinate(-1, -1);
    expect(() => VirtualArenaPlotter.plotRobot(negativeHeightAndWidth, VirtualRobot)).toThrow("Item could not be plotted, Coordinates out of bound");
  });

  it("Should throw error when at edge height", () => {
    const EdgeHeight = new ArenaCoordinate(0, height);
    expect(() => VirtualArenaPlotter.plotRobot(EdgeHeight, VirtualRobot)).toThrow("Item could not be plotted, Coordinates out of bound");
  });

  it("Should throw error when at edge width", () => {
    const EdgeWidth = new ArenaCoordinate(width, 0);
    expect(() => VirtualArenaPlotter.plotRobot(EdgeWidth, VirtualRobot)).toThrow("Item could not be plotted, Coordinates out of bound");
  });

  it("Should throw error when at edge height and width", () => {
    const EdgeAndWidth = new ArenaCoordinate(width, height);
    expect(() => VirtualArenaPlotter.plotRobot(EdgeAndWidth, VirtualRobot)).toThrow("Item could not be plotted, Coordinates out of bound");
  });

  it("Should not throw error when robot is at height bounds", () => {
    const heightBounds = new ArenaCoordinate(0, height - VirtualRobot.getSize());
    expect(() => VirtualArenaPlotter.plotRobot(heightBounds, VirtualRobot)).not.toThrow();
    expect(VirtualArena.getGrid()[height - VirtualRobot.getSize()][0].getItem()).toBe(VirtualRobot);
    expect(VirtualArena.getRobot()).toBe(VirtualRobot);
  });

  it("Should not throw error when robot is at width bounds", () => {
    const widthBounds = new ArenaCoordinate(width - VirtualRobot.getSize(), 0);
    expect(() => VirtualArenaPlotter.plotRobot(widthBounds, VirtualRobot)).not.toThrow();
    expect(VirtualArena.getGrid()[0][width - VirtualRobot.getSize()].getItem()).toBe(VirtualRobot);
    expect(VirtualArena.getRobot()).toBe(VirtualRobot);
  });

  it("Should not throw error when robot is at height and width bounds", () => {
    const heightAndWidthBounds = new ArenaCoordinate(width - VirtualRobot.getSize(), height - VirtualRobot.getSize());
    expect(() => VirtualArenaPlotter.plotRobot(heightAndWidthBounds, VirtualRobot)).not.toThrow("Item could not be plotted, Coordinates out of bound");
    expect(VirtualArena.getGrid()[height - VirtualRobot.getSize()][width - VirtualRobot.getSize()].getItem()).toBe(VirtualRobot);
    expect(VirtualArena.getRobot()).toBe(VirtualRobot);
  });

  it("Should not throw error when robot is at edge", () => {
    const edge1 = new ArenaCoordinate(0, 0);
    expect(() => VirtualArenaPlotter.plotRobot(edge1, VirtualRobot)).not.toThrow("Item could not be plotted, Coordinates out of bound");
    expect(VirtualArena.getGrid()[0][0].getItem()).toBe(VirtualRobot);
    expect(VirtualArena.getRobot()).toBe(VirtualRobot);
  });

  it("Should mark view as visited, all angles", () => {
    const VirtualRobotCoordinate: ArenaCoordinate = new ArenaCoordinate(5, 5);
    VirtualRobot.setSize(1);
    VirtualRobot.setLookingAngle(RobotLookingAngles.UP);
    VirtualRobot.setViewOfDistance(1);
    VirtualRobot.setViewOfAngle(180);
    VirtualArenaPlotter.plotRobot(VirtualRobotCoordinate, VirtualRobot);
    expect(VirtualArena.getGrid()[4][5].getIsVisited()).toBe(true);
    expect(VirtualArena.getGrid()[5][6].getIsVisited()).toBe(true);
    expect(VirtualArena.getGrid()[5][4].getIsVisited()).toBe(true);

    VirtualRobot.setLookingAngle(RobotLookingAngles.RIGHT);
    VirtualArenaPlotter.updateRobotView();
    expect(VirtualArena.getGrid()[5][6].getIsVisited()).toBe(true);
    expect(VirtualArena.getGrid()[4][5].getIsVisited()).toBe(true);
    expect(VirtualArena.getGrid()[6][5].getIsVisited()).toBe(true);

    VirtualRobot.setLookingAngle(RobotLookingAngles.DOWN);
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
    const VirtualRobotCoordinate: ArenaCoordinate = new ArenaCoordinate(10, 10);
    VirtualRobot.setSize(2);
    VirtualRobot.setLookingAngle(RobotLookingAngles.UP);
    VirtualRobot.setViewOfDistance(5);
    VirtualRobot.setViewOfAngle(180);
    VirtualArenaPlotter.plotRobot(VirtualRobotCoordinate, VirtualRobot);
    expect(VirtualArena.getGrid()[10][12].getIsVisited()).toBe(false);
    expect(VirtualArena.getGrid()[10][8].getIsVisited()).toBe(false);
  });

  it("Should mark view as visited", () => {
    const VirtualRobotCoordinate: ArenaCoordinate = new ArenaCoordinate(5, 5);
    VirtualRobot.setSize(1);
    VirtualRobot.setLookingAngle(RobotLookingAngles.LEFT);
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

function generateRandomArenaWithRandomObjects(): Arena {
  const randomWidth = generateRandomInRange(5, 40, []);
  const randomHeight = generateRandomInRange(8, 42, []);
  const randomRobotSize = 1;
  const randomRobotViewOfAngle = generateRandomInRange(100, 180, []);;
  const randomRobotViewOfDistance = generateRandomInRange(2, 4, []);
  const randomRobotCoordinateX = generateRandomInRange(6, 39, []);
  const randomRobotCoordinateY = generateRandomInRange(7, 40, []);
  const randomTrashItem = 5;
  const randomObstacleItem = 60;
  const robotLookingAnglesKeys = Object.keys(RobotLookingAngles).filter((k) => typeof RobotLookingAngles[k as any] === "number");
  const randomRobotLookingAngle = RobotLookingAngles[robotLookingAnglesKeys[Math.floor(Math.random() * robotLookingAnglesKeys.length)]];

  const VirtualArena: Arena = new Arena(randomWidth, randomHeight);
  const VirtualRobot: Robot = new Robot({
    size: randomRobotSize,
    lookingAngle: randomRobotLookingAngle,
    viewOfAngle: randomRobotViewOfAngle,
    viewOfDistance: randomRobotViewOfDistance,
    arena: VirtualArena,
  });

  const VirtualArenaPlotter: ArenaPlotter = new ArenaPlotter(VirtualArena);
  VirtualArenaPlotter.plotRobot(new ArenaCoordinate(randomRobotCoordinateX, randomRobotCoordinateY), VirtualRobot);

  // Mark whole arena as visited
  for (let i = 0; i < randomWidth; i++) {
    for (let j = 0; j < randomHeight; j++) {
      VirtualArena.getGrid()[j][i].setIsVisited(true);
    }
  }

  for (let i = 0; i < randomTrashItem; i++) {
    const randomGeneratedTrash: Item = new Item(ItemsTypes.Trash, 1);
    const randomItemCoordinateX = generateRandomInRange(0, randomWidth - 1, [randomRobotCoordinateX]);
    const randomItemCoordinateY = generateRandomInRange(0, randomHeight - 1, [randomRobotCoordinateY]);
    VirtualArenaPlotter.plotItem(new ArenaCoordinate(randomItemCoordinateX, randomItemCoordinateY), randomGeneratedTrash);
  }

  for (let i = 0; i < randomObstacleItem; i++) {
    const randomGeneratedObstacle: Item = new Item(ItemsTypes.Obstacle, 1);
    const randomItemCoordinateX = generateRandomInRange(0, randomWidth - 1, [randomRobotCoordinateX]);
    const randomItemCoordinateY = generateRandomInRange(0, randomHeight - 1, [randomRobotCoordinateX]);
    VirtualArenaPlotter.plotItem(new ArenaCoordinate(randomItemCoordinateX, randomItemCoordinateY), randomGeneratedObstacle);
  }

  return VirtualArena;
}

function getRandomArenas(number) {
  const randomGeneratedArenas: Array<Arena> = [];
  for(let i = 0; i < number; i++) {
    try {
      randomGeneratedArenas.push(generateRandomArenaWithRandomObjects());
    } catch (err) {
      // console.error(err);
    }
  }
  return randomGeneratedArenas;
}

function generateRandomInRange(min: number, max: number, exclude: number[]): number {
  let randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
  while (exclude.includes(randomNum)) {
    randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
  }
  return randomNum;
}

