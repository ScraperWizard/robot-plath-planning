"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
}
exports.default = Cell;
//# sourceMappingURL=Cell.js.map