import RobotViewItem from "Components/Robot/RobotView";

class ArenaCoordinate {
  private x: number;
  private y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  getX() {
    return Math.floor(this.x);
  }

  getY() {
    return Math.floor(this.y);
  }

  getXByFactor(factor: number) {
    return Math.floor(this.x / factor);
  }

  getYByFactor(factor: number) {
    return Math.floor(this.y / factor);
  }

  getXFloat(): number {
    return this.x;
  }

  getYFloat(): number {
    return this.y;
  }

  rotateAndShiftItemByView(View: RobotViewItem): void {
    const distanceToBeShifted = View.getDistance();
    const angleToBeShifted = View.getAngle();
    const angleInRadians = (angleToBeShifted * Math.PI) / 180; // Convert angle to radians

    // Shift coordinates clockwise
    let xShifted = distanceToBeShifted * Math.cos(angleInRadians);
    let yShifted = (distanceToBeShifted * Math.sin(angleInRadians)) * -1;

    if(xShifted > 0) {
      xShifted = Math.ceil(xShifted);
    } else {
      xShifted = Math.floor(xShifted);
    }

    if(yShifted > 0) {
      yShifted = Math.ceil(yShifted);
    } else {
      yShifted = Math.floor(yShifted);
    }

    // Update coordinates
    this.x += xShifted;
    this.y += yShifted;
  }
}

export default ArenaCoordinate;
