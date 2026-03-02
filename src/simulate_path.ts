import { Arena } from "../Components/Arena/Arena";
import ArenaCoordinate from "../Components/Arena/ArenaCoordinate";
import ArenaPlotter from "../Components/Arena/ArenaPlotter";
import Robot from "../Components/Robot/Robot";
import { RobotLookingAngles } from "../Components/Robot/types";
import { Item } from "../Components/Item/Item";
import { ItemSize, ItemsTypes } from "../Components/Item/types";
import { constants } from "./constants";
import { findBestPathForRobot, convertPathIntoRobotMovements } from "../Utils/Algorithms/Algorithms";

// Simple offline simulation of mapping + A* path finding + printed/animated arena grid
async function runSimulation() {
  const arena: Arena = new Arena(constants.LENGTH_OF_MAP, constants.WIDTH_OF_MAP);
  const plotter: ArenaPlotter = new ArenaPlotter(arena);

  // Create robot
  const robot: Robot = new Robot({
    size: constants.ROBOT_RADIUS,
    // Look to the RIGHT so "forward" = moving to the right on the grid
    lookingAngle: RobotLookingAngles.RIGHT,
    viewOfAngle: constants.VIEW_ANGLE_OF_ROBOT,
    viewOfDistance: constants.VIEW_DISTANCE_OF_ROBOT,
    arena,
  });

  // Place robot at (0, 0)
  const robotStart = new ArenaCoordinate(0, 0);
  plotter.plotRobot(robotStart, robot);

  // Place one bin and a couple of obstacles
  const bin = new Item(ItemsTypes.Bin, ItemSize.SMALL);
  const obstacle1 = new Item(ItemsTypes.Obstacle, ItemSize.SMALL);
  const obstacle2 = new Item(ItemsTypes.Obstacle, ItemSize.SMALL);

  // Bin on the same row as the robot, near the right edge
  plotter.plotItem(new ArenaCoordinate(constants.LENGTH_OF_MAP - 2, 0), bin);

  // Obstacles roughly in the middle to force a path around them
  plotter.plotItem(new ArenaCoordinate(5, 5), obstacle1);
  plotter.plotItem(new ArenaCoordinate(8, 8), obstacle2);

  // Initial arena grid (R = robot, numbers = items, X = visited, O = unknown)
  console.log("\n=== Arena grid (initial state) ===");
  arena.displayGrid();

  // Ask the algorithm for the best path from robot to bin
  const path = findBestPathForRobot({ arena, goal: bin });

  console.log("\nComputed path (A* result):", path);

  // Convert path into robot movements
  const movements = convertPathIntoRobotMovements(path, robot);
  console.log("Robot movements along path:", movements);

  // Animate the robot following the movements, refreshing the grid each step
  console.log("\n=== Animating robot along planned path ===");
  for (const [action, amount] of movements as [string, number][]) {
    if (action === "move") {
      for (let step = 0; step < amount; step++) {
        try {
          arena.moveRobotForward(1);
        } catch (err) {
          console.error("Movement stopped (likely out of bounds):", err.message ?? err);
          return;
        }

        console.clear();
        console.log(`Action: move, step ${step + 1}/${amount}`);
        arena.displayGrid();
        await sleep(200);
      }
    } else if (action === "rotate") {
      robot.rotateDegrees(amount as number);
      console.clear();
      console.log(`Action: rotate ${amount} degrees`);
      arena.displayGrid();
      await sleep(400);
    }
  }

  console.log("\n=== Animation finished ===");
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

runSimulation();


