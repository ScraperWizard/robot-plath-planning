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
const types_2 = require("../Robot/types");
class Arena {
    constructor(length, width) {
        this.plotted = false;
        this.items = [];
        this.allEvents = [];
        this.isTrackingEvents = false;
        this.grid = [];
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
                this.getGridItem(x, y).addItem(Robot);
                newRobotCoordinate.push(new ArenaCoordinate_1.default(x, y));
            }
        }
        Robot.setPosition(newRobotCoordinate);
        this.robot = Robot;
        this.markCellsAsVisitedInView(Robot);
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
                    this.getGridItem(x, y).addItem(item);
                    newItemCoordinate.push(new ArenaCoordinate_1.default(x, y));
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
    markCellsAsVisitedInView(Robot) {
        const distanceOfView = Robot.getViewOfDistance();
        const robotPositionReference = this.getArenaCoordinateAtAngle(this.robot.getPosition(), this.robot.getLookingAngle());
        const x = robotPositionReference.getY();
        const y = robotPositionReference.getX();
        console.log(robotPositionReference);
        for (let j = 0; j < this.grid.length; j++) {
            for (let k = 0; k < this.grid[j].length; k++) {
                const cell = this.grid[j][k];
                const cellX = cell.getY();
                const cellY = cell.getX();
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
                c -= Robot.getLookingAngle();
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
        if (angle == types_2.RobotLookingAngles.UP) {
            return new ArenaCoordinate_1.default(Math.floor((minX + maxX) / 2), minY);
        }
        if (angle == types_2.RobotLookingAngles.RIGHT) {
            return new ArenaCoordinate_1.default(maxX, Math.floor((minY + maxY) / 2));
        }
        if (angle == types_2.RobotLookingAngles.DOWN) {
            return new ArenaCoordinate_1.default(Math.floor((minX + maxX) / 2), maxY);
        }
        if (angle == types_2.RobotLookingAngles.LEFT) {
            return new ArenaCoordinate_1.default(minX, Math.floor((minY + maxY) / 2));
        }
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
    displayGrid() {
        let header = "  ";
        for (let i = 0; i < this.grid[0].length; i++) {
            header += i.toString().padStart(2) + " ";
        }
        console.log(header);
        for (let i = 0; i < this.grid.length; i++) {
            let row = i.toString().padStart(2) + " ";
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
                row += cellStr.padEnd(2) + " ";
            }
            console.log(row);
        }
    }
    addItemByView(View) {
        const item = new Item_1.Item(View.getType());
        const robotPosition = this.robot.getPosition();
        const shiftedPosition = [];
        if (this.robot.getLookingAngle() + View.getAngle() < 90) {
            View.setAngle(90 - View.getAngle() + this.robot.getLookingAngle());
        }
        else {
            View.setAngle(360 - (View.getAngle() + this.robot.getLookingAngle() - 90));
        }
        const robotPositionReference = this.getArenaCoordinateAtAngle(this.robot.getPosition(), this.robot.getLookingAngle());
        try {
            const newPosition = new ArenaCoordinate_1.default(robotPositionReference.getX(), robotPositionReference.getY());
            newPosition.rotateAndShiftItemByView(View);
            this.getGridItem(newPosition.getX(), newPosition.getY()).addItem(item);
            shiftedPosition.push(new ArenaCoordinate_1.default(newPosition.getX(), newPosition.getY()));
            // if(this.grid[newPosition.getY()][newPosition.getX()].getHasItem()) {
            //   throw new Error("Item already exists");
            // }
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
        for (let i = 0; i < this.grid.length; i++) {
            grid.push([]);
            for (let j = 0; j < this.grid[i].length; j++) {
                grid[i].push(this.grid[i][j].getIsVisited() ? 0 : 1);
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
}
exports.Arena = Arena;
//# sourceMappingURL=Arena.js.map