import { ArenaCoordinate } from "../../Components/Arena/types";
import { RobotLookingAngles } from "./types";

class Robot {
  private coordinate: Array<ArenaCoordinate> = [];
  private size: number;
  private lookingAngle: RobotLookingAngles;
  private viewOfAngle: number;
  private viewOfDistance: number;

  constructor({ size, lookingAngle, viewOfAngle, viewOfDistance }: { size: number, lookingAngle: RobotLookingAngles, viewOfAngle: number, viewOfDistance: number}) {
    this.size = size;
    this.lookingAngle = lookingAngle;
    this.viewOfAngle = viewOfAngle;
    this.viewOfDistance = viewOfDistance;
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
    }
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
}

export default Robot;
