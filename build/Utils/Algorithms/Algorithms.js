"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertPathIntoRobotMovements = exports.findBestPathForRobot = void 0;
const Cell_1 = __importDefault(require("../../Components/Arena/Cell"));
const Item_1 = require("../../Components/Item/Item");
const astar_typescript_1 = require("astar-typescript");
const types_1 = require("../../Components/Robot/types");
const fs = __importStar(require("fs"));
const findBestPathForRobot = ({ arena, goal }) => {
    let matrix = arena.getUnvisitedGrid();
    let aStarInstance = new astar_typescript_1.AStarFinder({
        grid: {
            matrix,
        },
        // optional arguments
        // heuristic: 'Manhattan',
        diagonalAllowed: false,
        // weight: 0 // use dikstra or not
    });
    let targetCell = { x: null, y: null };
    if (goal instanceof Item_1.Item) {
        targetCell = {
            x: goal.getPointCoordinate().y,
            y: goal.getPointCoordinate().x,
        };
    }
    if (goal instanceof Cell_1.default) {
        targetCell = {
            x: goal.getY(),
            y: goal.getX(),
        };
    }
    let myPathway = aStarInstance.findPath({ x: arena.getRobot().getPointCoordinate().y, y: arena.getRobot().getPointCoordinate().x }, targetCell);
    return myPathway;
};
exports.findBestPathForRobot = findBestPathForRobot;
const convertPathIntoRobotMovements = (path, robot) => {
    let movements = [];
    const initialAngle = robot.getLookingAngle();
    let previousSlope = null;
    let totalMove = 0;
    console.log("Angle of robot", initialAngle);
    if (initialAngle == types_1.RobotLookingAngles.UP) {
        previousSlope = -Infinity;
    }
    if (initialAngle == types_1.RobotLookingAngles.DOWN) {
        previousSlope = Infinity;
    }
    if (initialAngle == types_1.RobotLookingAngles.LEFT) {
        previousSlope = 0;
    }
    if (initialAngle == types_1.RobotLookingAngles.RIGHT) {
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
        }
        else if (Object.is(slope, -0)) {
            currentAngle = 90;
        }
        else if (slope == -Infinity) {
            currentAngle = 180;
        }
        else if (slope == Infinity) {
            currentAngle = 0;
        }
        if (previousSlope == slope) {
            totalMove++;
        }
        else {
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
exports.convertPathIntoRobotMovements = convertPathIntoRobotMovements;
function logToFile(...args) {
    const text = args.join(" ");
    fs.appendFile("log.txt", text + "\n", (err) => {
        if (err) {
            console.error("Failed to write to file:", err);
        }
    });
}
//# sourceMappingURL=Algorithms.js.map