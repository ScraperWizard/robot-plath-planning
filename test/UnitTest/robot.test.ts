import { Arena } from "../../Components/Arena/Arena";
import ArenaCoordinate from "../../Components/Arena/ArenaCoordinate";
import Robot from "../../Components/Robot/Robot";
import ArenaPlotter from "../../Components/Arena/ArenaPlotter";
const width: number = 40;
const height: number = 32;
import { RobotLookingAngles } from "../../Components/Robot/types";

describe("Robot movement", () => {
  let VirtualArena: Arena;
  let VirtualArenaPlotter: ArenaPlotter;
  let VirtualRobot: Robot;

  VirtualArena = new Arena(width, height);
  VirtualArenaPlotter = new ArenaPlotter(VirtualArena);

  VirtualRobot = new Robot({
    size: 1,
    lookingAngle: RobotLookingAngles.DOWN,
    viewOfAngle: 90,
    viewOfDistance: 3,
    arena: VirtualArena,
  });

  VirtualArenaPlotter.plotRobot(new ArenaCoordinate(0, 0), VirtualRobot);

  it("Move robot forward, all angles", () => {
    VirtualArena.moveRobotForward(3);

    expect(VirtualArena.getGrid()[0][0].getHasItem()).toEqual(false);
    expect(VirtualArena.getGrid()[3][0].getItem().getType()).toEqual(VirtualRobot.getType());

    VirtualRobot.setLookingAngle(RobotLookingAngles.RIGHT);
    VirtualArena.moveRobotForward(3);
    expect(VirtualArena.getGrid()[3][0].getHasItem()).toEqual(false);
    expect(VirtualArena.getGrid()[3][3].getItem().getType()).toEqual(VirtualRobot.getType());

    VirtualRobot.setLookingAngle(RobotLookingAngles.UP);
    VirtualArena.moveRobotForward(3);
    expect(VirtualArena.getGrid()[3][3].getHasItem()).toEqual(false);
    expect(VirtualArena.getGrid()[0][3].getItem().getType()).toEqual(VirtualRobot.getType());

    VirtualRobot.setLookingAngle(RobotLookingAngles.LEFT);
    VirtualArena.moveRobotForward(3);
    expect(VirtualArena.getGrid()[0][3].getHasItem()).toEqual(false);
    expect(VirtualArena.getGrid()[0][0].getItem().getType()).toEqual(VirtualRobot.getType());
  });

  it("Move out of bounds", () => {
    VirtualRobot.setLookingAngle(RobotLookingAngles.LEFT);

    expect(() => VirtualArena.moveRobotForward(6)).toThrow("Out of bounds");
  });
});

