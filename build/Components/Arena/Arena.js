"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arena = void 0;
const Item_1 = require("../Item/Item");
const EventsStack_1 = __importDefault(require("../Events/EventsStack"));
const Cell_1 = __importDefault(require("./Cell"));
const ArenaCoordinate_1 = __importDefault(require("./ArenaCoordinate"));
const types_1 = require("../Events/types");
const types_2 = require("../Item/types");
const types_3 = require("../Robot/types");
class Arena {
    constructor(length, width) {
        this.plotted = false;
        this.items = [];
        this.robot = null;
        this.allEvents = [];
        this.isTrackingEvents = false;
        this.grid = [];
        this.isDisplayingLiveGrid = false;
        this.liveGridText = "";
        this.length = length;
        this.width = width;
        this.createGrid();
    }
    plotRobot(coordinate, Robot) {
        const robotSize = Robot.getSize();
        const startX = coordinate.getX();
        const startY = coordinate.getY();
        const adjustmentX = robotSize % 2 === 0 ? -0.5 : 0;
        const adjustmentY = robotSize % 2 === 0 ? -0.5 : 0;
        const newRobotCoordinate = [];
        for (let i = startX; i < startX + robotSize && i < this.grid.length; i++) {
            for (let j = startY; j < startY + robotSize && j < this.grid[i].length; j++) {
                const x = i - Math.floor(robotSize / 2 + adjustmentX);
                const y = j - Math.floor(robotSize / 2 + adjustmentY);
                this.grid[y][x].addItem(Robot);
                newRobotCoordinate.push(new ArenaCoordinate_1.default(y, x));
            }
        }
        Robot.setPosition(newRobotCoordinate);
        this.robot = Robot;
    }
    plotItemByXY(coordinate, item) {
        try {
            const itemSize = item.getSize();
            const startX = coordinate.getX();
            const startY = coordinate.getY();
            const adjustmentX = itemSize % 2 === 0 ? -0.5 : 0;
            const adjustmentY = itemSize % 2 === 0 ? -0.5 : 0;
            const newItemCoordinate = [];
            for (let i = startX; i < startX + itemSize && i < this.grid.length; i++) {
                for (let j = startY; j < startY + itemSize && j < this.grid[i].length; j++) {
                    const x = i - Math.floor(itemSize / 2 + adjustmentX);
                    const y = j - Math.floor(itemSize / 2 + adjustmentY);
                    this.grid[y][x].addItem(item);
                    newItemCoordinate.push(new ArenaCoordinate_1.default(y, x));
                }
            }
            item.setPosition(newItemCoordinate);
            this.items.push(item);
        }
        catch {
            console.log("Failed to add item");
        }
    }
    getGridItem(x, y) {
        return this.grid[y][x];
    }
    markCellsAsVisitedInViewOfRobot(Robot) {
        const distanceOfView = Robot.getViewOfDistance();
        const robotPositionReference = this.getArenaCoordinateAtAngle(this.robot.getPosition(), this.robot.getLookingAngle());
        const x = robotPositionReference.getY();
        const y = robotPositionReference.getX();
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[i].length; j++) {
                const cell = this.grid[i][j];
                const cellX = j;
                const cellY = i;
                let v = cellX - x;
                let b = y - cellY;
                let c = Math.atan2(b, v) * (180 / Math.PI);
                if (c <= 0) {
                    c = Math.abs(c) + 90;
                }
                else {
                    if (c <= 90) {
                        c = 90 - c;
                    }
                    else {
                        c = 360 - (c - 90);
                    }
                }
                //adjust the value of c relative to the robot angle
                let fullCircle = 360;
                let c1 = Math.abs(c - Robot.getLookingAngle());
                let c2 = Math.abs(fullCircle - c + Robot.getLookingAngle());
                c = Math.min(c1, c2);
                //adjust the value of
                if (c > 180) {
                    c -= 360;
                }
                const angle = Robot.getViewOfAngle();
                let midAngle = angle / 2;
                const distance = Math.sqrt(Math.pow(cellX - x, 2) + Math.pow(cellY - y, 2));
                if (distance <= distanceOfView && Math.abs(c) <= midAngle) {
                    cell.setIsVisited(true);
                }
            }
        }
    }
    getArenaCoordinateAtAngle(arenaCoordinates, angle) {
        let minX = 100000;
        let minY = 100000;
        let maxX = -1;
        let maxY = -1;
        for (let i = 0; i < arenaCoordinates.length; i++) {
            minX = Math.min(minX, arenaCoordinates[i].getX());
            minY = Math.min(minY, arenaCoordinates[i].getY());
            maxX = Math.max(maxX, arenaCoordinates[i].getX());
            maxY = Math.max(maxY, arenaCoordinates[i].getY());
        }
        if (angle == types_3.RobotLookingAngles.UP) {
            return new ArenaCoordinate_1.default(Math.floor((minX + maxX) / 2), minY);
        }
        if (angle == types_3.RobotLookingAngles.RIGHT) {
            return new ArenaCoordinate_1.default(maxX, Math.floor((minY + maxY) / 2));
        }
        if (angle == types_3.RobotLookingAngles.DOWN) {
            return new ArenaCoordinate_1.default(Math.floor((minX + maxX) / 2), maxY);
        }
        if (angle == types_3.RobotLookingAngles.LEFT) {
            return new ArenaCoordinate_1.default(minX, Math.floor((minY + maxY) / 2));
        }
        return new ArenaCoordinate_1.default(minX, Math.floor((minY + maxY) / 2));
    }
    createGrid() {
        const rows = this.width;
        const cols = this.length;
        for (let i = 0; i < rows; i++) {
            this.grid.push([]);
            for (let j = 0; j < cols; j++) {
                this.grid[i].push(new Cell_1.default(i, j));
            }
        }
    }
    isPlotted() {
        return this.plotted;
    }
    getItems() {
        return this.items;
    }
    getCurrentStackEvents() {
        return this.allEvents[this.allEvents.length - 1];
    }
    getAllEvents() {
        return this.allEvents;
    }
    getRobot() {
        return this.robot;
    }
    startTrackingEvents() {
        if (this.isTrackingEvents) {
            return;
        }
        this.isTrackingEvents = true;
        this.allEvents.push(new EventsStack_1.default());
    }
    stopTrackingEvents() {
        if (!this.isTrackingEvents) {
            return;
        }
        this.isTrackingEvents = false;
        this.allEvents.push(new EventsStack_1.default());
    }
    addEvent(event) {
        if (this.isTrackingEvents) {
            const currentStackEvents = this.getCurrentStackEvents();
            currentStackEvents.push(event);
        }
    }
    setLiveGridText(text) {
        this.liveGridText = text;
    }
    displayGrid() {
        let header = "xy";
        for (let i = 0; i < this.grid[0].length; i++) {
            header += i.toString().padStart(2) + " ";
        }
        console.log("\x1b[34m%s\x1b[0m", header);
        for (let i = 0; i < this.grid.length; i++) {
            let row = "";
            row += "\x1b[34m" + i.toString().padEnd(2) + "\x1b[0m" + " ";
            for (let j = 0; j < this.grid[i].length; j++) {
                const cell = this.grid[i][j];
                const isVisited = cell.getIsVisited();
                const hasItem = cell.getHasItem();
                let cellStr;
                if (hasItem) {
                    cellStr = cell.getItem().getType() + "";
                }
                else {
                    cellStr = isVisited ? "X" : "O";
                }
                let outputString = "";
                if (cellStr == "X") {
                    outputString += "\x1b[31m" + cellStr.padEnd(2) + "\x1b[0m";
                }
                else if (cellStr == "1") {
                    outputString += "\x1b[33m" + cellStr.padEnd(2) + "\x1b[0m";
                }
                else if (cellStr == "R") {
                    outputString += "\x1b[32m" + cellStr.padEnd(2) + "\x1b[0m";
                }
                else {
                    outputString += cellStr.padEnd(2);
                }
                outputString += " ";
                row += outputString;
            }
            console.log(row);
        }
    }
    updateLiveGrid() {
        if (!this.isDisplayingLiveGrid) {
            return;
        }
        console.clear();
        this.displayGrid();
    }
    async displayLiveGrid(refershRate) {
        if (this.isDisplayingLiveGrid) {
            return;
        }
        this.isDisplayingLiveGrid = true;
        while (this.isDisplayingLiveGrid) {
            console.clear();
            console.log(this.liveGridText);
            this.displayGrid();
            await sleep(refershRate);
        }
        async function sleep(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        }
    }
    stopDisplayingLiveGrid() {
        this.isDisplayingLiveGrid = false;
    }
    addItemByView(View) {
        const item = new Item_1.Item(View.getType(), types_2.ItemSize.SMALL);
        const shiftedPosition = [];
        if (this.robot.getLookingAngle() + View.getAngle() < 90) {
            View.setAngle(90 - View.getAngle() + this.robot.getLookingAngle());
        }
        else {
            View.setAngle(360 - (View.getAngle() + this.robot.getLookingAngle() - 90));
        }
        console.log("View angle", View.getAngle());
        const robotPositionReference = this.getArenaCoordinateAtAngle(this.robot.getPosition(), this.robot.getLookingAngle());
        console.log("reference point", robotPositionReference);
        try {
            const newPosition = new ArenaCoordinate_1.default(robotPositionReference.getX(), robotPositionReference.getY());
            newPosition.rotateAndShiftItemByView(View);
            this.grid[newPosition.getX()][newPosition.getY()].addItem(item);
            shiftedPosition.push(new ArenaCoordinate_1.default(newPosition.getY(), newPosition.getX()));
        }
        catch (err) {
            console.log("Couldn't add item", err);
            return;
        }
        this.addEvent(new types_1.Event(types_1.EventTypes.OBJECT_DETECTED, item));
        item.setPosition(shiftedPosition);
        this.items.push(item);
    }
    containsItem(ItemType) {
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].getType() == ItemType) {
                return true;
            }
        }
        return false;
    }
    getClosestItem(ItemType) {
        let closestItem = null;
        let closestDistance = 100000;
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            if (item.getType() == ItemType) {
                const distance = this.getDistanceBetweenRobotAndItem(item);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestItem = item;
                }
            }
        }
        return closestItem;
    }
    getFarthestItem(ItemType) {
        let farthestItem = null;
        let farthestDistance = 0;
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            if (item.getType() == ItemType) {
                const distance = this.getDistanceBetweenRobotAndItem(item);
                if (distance > farthestDistance) {
                    farthestDistance = distance;
                    farthestItem = item;
                }
            }
        }
        return farthestItem;
    }
    getDistanceBetweenRobotAndItem(item) {
        const robotPosition = this.robot.getPointCoordinate();
        const itemPosition = item.getPointCoordinate();
        return Math.sqrt(Math.pow(robotPosition.x - itemPosition.x, 2) + Math.pow(robotPosition.y - itemPosition.y, 2));
    }
    getUnvisitedGrid() {
        const grid = [];
        for (let i = 0; i < this.getWidth(); i++) {
            grid.push([]);
            for (let j = 0; j < this.getHeight(); j++) {
                grid[i].push(this.grid[j][i].getIsWalkable() ? 0 : 1);
            }
        }
        return grid;
    }
    plotPoint(x, y) {
        this.grid[y][x].setIsVisited(true);
    }
    containsProp(prop) {
        return true;
    }
    moveRobotForward(distance) {
        for (let i = 0; i < distance; i++) {
            for (let i = 0; i < this.robot.getPosition().length; i++) {
                this.grid[this.robot.getPosition()[i].getY()][this.robot.getPosition()[i].getX()].removeItem();
            }
            try {
                this.robot.moveForward(1);
            }
            catch (err) {
                if (err.message == "Out of bounds") {
                    throw new Error("Out of bounds");
                }
                else {
                    throw err;
                }
            }
            this.markCellsAsVisitedInViewOfRobot(this.robot);
            this.updateLiveGrid();
            for (let i = 0; i < this.robot.getPosition().length; i++) {
                this.grid[this.robot.getPosition()[i].getY()][this.robot.getPosition()[i].getX()].addItem(this.robot);
            }
        }
    }
    getWidth() {
        return this.grid[0].length;
    }
    getHeight() {
        return this.grid.length;
    }
    getGrid() {
        return this.grid;
    }
    setRobot(robot) {
        this.robot = robot;
    }
    getDistanceBetweenCells(cell1, cell2) {
        return Math.sqrt(Math.pow(cell1.getX() - cell2.getX(), 2) + Math.pow(cell1.getY() - cell2.getY(), 2));
    }
    getClosestVisitedCell(item) {
        let closestCell = null;
        let closestDistance = 100000;
        const itemCell = this.grid[item.getPointCoordinate().y][item.getPointCoordinate().x];
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[i].length; j++) {
                const cell = this.grid[j][i];
                if (cell.getIsVisited() && !cell.getHasItem() && this.getDistanceBetweenCells(cell, itemCell) < closestDistance) {
                    closestCell = cell;
                }
            }
        }
        return closestCell;
    }
}
exports.Arena = Arena;
//# sourceMappingURL=Arena.js.map