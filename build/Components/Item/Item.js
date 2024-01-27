"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = void 0;
class Item {
    constructor(type) {
        this.type = type;
    }
    getPosition() {
        return this.position;
    }
    getPointCoordinate() {
        const coord = this.position[Math.floor(this.position.length / 2)];
        console.log(coord, this.position.length);
        return {
            x: coord.getX(),
            y: coord.getY(),
        };
    }
    getSize() {
        return this.size;
    }
    setSize(size) {
        this.size = size;
    }
    getType() {
        return this.type;
    }
    setPosition(position) {
        this.position = position;
    }
    setType(type) {
        this.type = type;
    }
}
exports.Item = Item;
//# sourceMappingURL=Item.js.map