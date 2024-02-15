"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ArenaCoordinate {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    setX(x) {
        this.x = x;
    }
    setY(y) {
        this.y = y;
    }
    getX() {
        return Math.floor(this.x);
    }
    getY() {
        return Math.floor(this.y);
    }
    getXByFactor(factor) {
        return Math.floor(this.x / factor);
    }
    getYByFactor(factor) {
        return Math.floor(this.y / factor);
    }
    getXFloat() {
        return this.x;
    }
    getYFloat() {
        return this.y;
    }
    rotateAndShiftItemByView(View) {
        const distanceToBeShifted = View.getDistance();
        const angleToBeShifted = View.getAngle();
        const angleInRadians = (angleToBeShifted * Math.PI) / 180; // Convert angle to radians
        // Shift coordinates clockwise
        let yShifted = distanceToBeShifted * Math.cos(angleInRadians);
        let xShifted = distanceToBeShifted * Math.sin(angleInRadians) * -1;
        xShifted = Math.round(xShifted);
        yShifted = Math.round(yShifted);
        if (xShifted > 0) {
            xShifted = Math.ceil(xShifted);
        }
        else {
            xShifted = Math.floor(xShifted);
        }
        if (yShifted > 0) {
            yShifted = Math.ceil(yShifted);
        }
        else {
            yShifted = Math.floor(yShifted);
        }
        // Update coordinates
        this.x += xShifted;
        this.y += yShifted;
    }
}
exports.default = ArenaCoordinate;
//# sourceMappingURL=ArenaCoordinate.js.map