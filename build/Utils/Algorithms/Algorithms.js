"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findBestPathForRobot = void 0;
const astar_typescript_1 = require("astar-typescript");
const findBestPathForRobot = ({ arena, goal }) => {
    let matrix = arena.getUnvisitedGrid();
    let aStarInstance = new astar_typescript_1.AStarFinder({
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
exports.findBestPathForRobot = findBestPathForRobot;
//# sourceMappingURL=Algorithms.js.map