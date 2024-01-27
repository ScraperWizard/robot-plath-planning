import { Arena } from "Components/Arena/Arena";
import Cell from "Components/Arena/Cell";
import { Item } from "Components/Item/Item";
import { AStarFinder } from "astar-typescript";

const findBestPathForRobot = ({ arena, goal }: { arena: Arena; goal: Item }) => {
  let matrix: number[][] = arena.getUnvisitedGrid();

  let aStarInstance: AStarFinder = new AStarFinder({
    grid: {
      matrix,
    },
    //optional arguments
    // heuristic: 'Manhattan',
    // diagonalAllowed: false,
    // weight: 0.7 // use dikstra or not
  });

  let myPathway = aStarInstance.findPath(arena.getRobot().getPointCoordinate(), goal.getPointCoordinate());

  return myPathway;
};

export { findBestPathForRobot };
