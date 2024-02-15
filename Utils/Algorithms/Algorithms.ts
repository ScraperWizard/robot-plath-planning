import { Arena } from "Components/Arena/Arena";
import Cell from "../../Components/Arena/Cell";
import { Item } from "../../Components/Item/Item";
import { AStarFinder } from "astar-typescript";
import Robot from "../../Components/Robot/Robot";
import { RobotLookingAngles } from "../../Components/Robot/types";
import * as fs from "fs";
import { IPoint } from "astar-typescript/dist/interfaces/astar.interfaces";

const findBestPathForRobot = ({ arena, goal }: { arena: Arena; goal: Item | Cell }) => {
  let matrix: number[][] = arena.getUnvisitedGrid();

  let aStarInstance: AStarFinder = new AStarFinder({
    grid: {
      matrix,
    },
    // optional arguments
    // heuristic: 'Manhattan',
    diagonalAllowed: false,
    // weight: 0 // use dikstra or not
  });

  let targetCell: IPoint = { x: null, y: null };

  if (goal instanceof Item) {
    targetCell = {
      x: goal.getPointCoordinate().y,
      y: goal.getPointCoordinate().x,
    };
  }

  if(goal instanceof Cell) {
    targetCell = {
      x: goal.getY(),
      y: goal.getX(),
    };
  }

  let myPathway = aStarInstance.findPath({ x: arena.getRobot().getPointCoordinate().y, y: arena.getRobot().getPointCoordinate().x }, targetCell);

  return myPathway;
};

const convertPathIntoRobotMovements = (path: number[][], robot: Robot): (string | number)[][] => {
  let movements: [string, number][] = [];
  const initialAngle = robot.getLookingAngle();
  let previousSlope = null;
  let totalMove = 0;

  console.log("Angle of robot", initialAngle);
  if (initialAngle == RobotLookingAngles.UP) {
    previousSlope = -Infinity;
  }

  if (initialAngle == RobotLookingAngles.DOWN) {
    previousSlope = Infinity;
  }

  if (initialAngle == RobotLookingAngles.LEFT) {
    previousSlope = 0;
  }

  if (initialAngle == RobotLookingAngles.RIGHT) {
    previousSlope = -0;
  }

  let previousAngle = 0;

  for (let i = 0; i < path.length - 1; i++) {
    const [x1, y1] = path[i];
    const [x2, y2] = path[i + 1];

    const slope = (x2 - x1) / (y2 - y1);
    logToFile(`slope: ${slope}, previousSlope: ${previousSlope}, totalMove: ${totalMove}`);

    let currentAngle;
    if (Object.is(slope, 0)) {
      currentAngle = 270;
    } else if (Object.is(slope, -0)) {
      currentAngle = 90;
    } else if (slope == -Infinity) {
      currentAngle = 180;
    } else if (slope == Infinity) {
      currentAngle = 0;
    }

    if (previousSlope == slope) {
      totalMove++;
    } else {
      if (totalMove > 0) {
        movements.push(["move", totalMove]);
        totalMove = 0;
      }

      if (currentAngle !== previousAngle) {
        const rotation = (currentAngle - previousAngle + 360) % 360;
        movements.push(["rotate", rotation]);
        previousAngle = currentAngle;
      }

      totalMove++;
    }

    previousSlope = slope;
  }

  if (totalMove > 0) {
    movements.push(["move", totalMove]);
  }

  return movements;
};

function logToFile(...args: any[]) {
  const text = args.join(" ");
  fs.appendFile("log.txt", text + "\n", (err) => {
    if (err) {
      console.error("Failed to write to file:", err);
    }
  });
}

export { findBestPathForRobot, convertPathIntoRobotMovements };
