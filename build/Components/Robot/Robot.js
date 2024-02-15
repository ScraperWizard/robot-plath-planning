"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../Components/Arena/types");
const types_2 = require("./types");
class Robot {
    constructor({ size, lookingAngle, viewOfAngle, viewOfDistance, arena }) {
        this.coordinate = [];
        this.size = size;
        this.lookingAngle = lookingAngle;
        this.viewOfAngle = viewOfAngle;
        this.viewOfDistance = viewOfDistance;
        this.arena = arena;
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
    moveForward(distance) {
        this.coordinate = this.coordinate.map((coord) => {
            const newCoordinate = new types_1.ArenaCoordinate(coord.getX(), coord.getY());
            switch (this.getLookingAngle()) {
                case types_2.RobotLookingAngles.UP:
                    if (newCoordinate.getY() - distance < 0)
                        throw new Error("Out of bounds");
                    newCoordinate.setY(newCoordinate.getY() - distance);
                    break;
                case types_2.RobotLookingAngles.RIGHT:
                    if (newCoordinate.getX() + distance > this.arena.getWidth())
                        throw new Error("Out of bounds");
                    newCoordinate.setX(newCoordinate.getX() + distance);
                    break;
                case types_2.RobotLookingAngles.DOWN:
                    if (newCoordinate.getY() + distance > this.arena.getHeight())
                        throw new Error("Out of bounds");
                    newCoordinate.setY(newCoordinate.getY() + distance);
                    break;
                case types_2.RobotLookingAngles.LEFT:
                    if (newCoordinate.getX() - distance < 0)
                        throw new Error("Out of bounds");
                    newCoordinate.setX(newCoordinate.getX() - distance);
                    break;
            }
            return newCoordinate;
        });
    }
    rotateDegrees(angle) {
        this.setLookingAngle((this.getLookingAngle() + angle) % 360);
    }
    getArena() {
        return this.arena;
    }
    setViewOfAngle(viewOfAngle) {
        this.viewOfAngle = viewOfAngle;
    }
    setViewOfDistance(viewOfDistance) {
        this.viewOfDistance = viewOfDistance;
    }
    setSize(size) {
        this.size = size;
    }
}
exports.default = Robot;
//# sourceMappingURL=Robot.js.map