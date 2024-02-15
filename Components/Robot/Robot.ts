import { Arena } from "../../Components/Arena/Arena";
import { ArenaCoordinate } from "../../Components/Arena/types";
import { RobotLookingAngles } from "./types";

class Robot {
  private coordinate: Array<ArenaCoordinate> = [];
  private size: number;
  private lookingAngle: RobotLookingAngles;
  private viewOfAngle: number;
  private viewOfDistance: number;
  private arena: Arena;

  constructor({ size, lookingAngle, viewOfAngle, viewOfDistance, arena }: { size: number; lookingAngle: RobotLookingAngles; viewOfAngle: number; viewOfDistance: number; arena: Arena }) {
    this.size = size;
    this.lookingAngle = lookingAngle;
    this.viewOfAngle = viewOfAngle;
    this.viewOfDistance = viewOfDistance;
    this.arena = arena;
  }

  getSize(): number {
    return this.size;
  }

  getViewOfAngle(): number {
    return this.viewOfAngle;
  }

  getViewOfDistance(): number {
    return this.viewOfDistance;
  }

  setLookingAngle(lookingAngle: RobotLookingAngles): void {
    this.lookingAngle = lookingAngle;
  }

  getLookingAngle(): RobotLookingAngles {
    return this.lookingAngle;
  }

  getPointCoordinate() {
    const coord: ArenaCoordinate = this.coordinate[Math.floor(this.coordinate.length / 2)];

    return {
      x: coord.getX(),
      y: coord.getY(),
    };
  }

  getPosition(): Array<ArenaCoordinate> {
    return this.coordinate;
  }

  setPosition(coordinate: Array<ArenaCoordinate>): void {
    this.coordinate = coordinate;
  }

  getType(): string {
    return "R";
  }

  moveForward(distance: number): void {
    this.coordinate = this.coordinate.map((coord) => {
      const newCoordinate = new ArenaCoordinate(coord.getX(), coord.getY());

      switch (this.getLookingAngle()) {
        case RobotLookingAngles.UP:
          if(newCoordinate.getY() - distance < 0) throw new Error("Out of bounds")
          newCoordinate.setY(newCoordinate.getY() - distance);
          break;
        case RobotLookingAngles.RIGHT:
          if(newCoordinate.getX() + distance > this.arena.getWidth()) throw new Error("Out of bounds")
          newCoordinate.setX(newCoordinate.getX() + distance);
          break;
        case RobotLookingAngles.DOWN:
          if(newCoordinate.getY() + distance > this.arena.getHeight()) throw new Error("Out of bounds")
          newCoordinate.setY(newCoordinate.getY() + distance);
          break;
        case RobotLookingAngles.LEFT:
          if(newCoordinate.getX() - distance < 0) throw new Error("Out of bounds")
          newCoordinate.setX(newCoordinate.getX() - distance);
          break;
      }

      return newCoordinate;
    });
  }

  rotateDegrees(angle: number): void {
    this.setLookingAngle((this.getLookingAngle() + angle) % 360);
  }

  getArena(): Arena {
    return this.arena;
  }

  setViewOfAngle(viewOfAngle: number): void {
    this.viewOfAngle = viewOfAngle;
  }

  setViewOfDistance(viewOfDistance: number): void {
    this.viewOfDistance = viewOfDistance;
  }

  setSize(size: number): void {
    this.size = size;
  }
}

export default Robot;
