"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Robot {
    constructor({ size, lookingAngle, viewOfAngle, viewOfDistance }) {
        this.coordinate = [];
        this.size = size;
        this.lookingAngle = lookingAngle;
        this.viewOfAngle = viewOfAngle;
        this.viewOfDistance = viewOfDistance;
    }
    getSize() {
        return this.size;
    }
    getViewOfAngle() {
        return this.viewOfAngle;
    }
    getViewOfDistance() {
        return this.viewOfDistance;
    }
    setLookingAngle(lookingAngle) {
        this.lookingAngle = lookingAngle;
    }
    getLookingAngle() {
        return this.lookingAngle;
    }
    getPointCoordinate() {
        const coord = this.coordinate[Math.floor(this.coordinate.length / 2)];
        return {
            x: coord.getX(),
            y: coord.getY(),
        };
    }
    getPosition() {
        return this.coordinate;
    }
    setPosition(coordinate) {
        this.coordinate = coordinate;
    }
    getType() {
        return "R";
    }
}
exports.default = Robot;
//# sourceMappingURL=Robot.js.map