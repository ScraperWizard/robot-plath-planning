"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../Item/types");
class RobotViewItem {
    constructor({ angle, distance, type, size }) {
        this.ItemSize = types_1.ItemSize.SMALL;
        this.angle = angle;
        this.distance = distance;
        this.type = type;
        this.ItemSize = this.ItemSize;
    }
    getAngle() {
        return this.angle;
    }
    getSize() {
        return this.ItemSize;
    }
    getDistance() {
        return this.distance;
    }
    getType() {
        return this.type;
    }
    setAngle(angle) {
        this.angle = angle;
    }
    setDistance(distance) {
        this.distance = distance;
    }
    setType(type) {
        this.type = type;
    }
}
exports.default = RobotViewItem;
//# sourceMappingURL=RobotView.js.map