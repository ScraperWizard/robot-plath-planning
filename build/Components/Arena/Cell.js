"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../Components/Item/types");
class Cell {
    constructor(x, y) {
        this.isVisited = false;
        this.hasItem = false;
        this.x = x;
        this.y = y;
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    getIsVisited() {
        return this.isVisited;
    }
    getIsWalkable() {
        if (this.hasItem) {
            if (this.getHasItem() && this.getItem().getType() == types_1.ItemsTypes.Obstacle) {
                return false;
            }
        }
        return true;
    }
    setIsVisited(isVisited) {
        this.isVisited = isVisited;
    }
    getHasItem() {
        return this.hasItem;
    }
    addItem(Item) {
        this.hasItem = true;
        this.setIsVisited(true);
        this.Item = Item;
    }
    removeItem() {
        this.hasItem = false;
        this.Item = null;
    }
    getItem() {
        return this.Item;
    }
    visit() {
        this.isVisited = true;
    }
}
exports.default = Cell;
//# sourceMappingURL=Cell.js.map