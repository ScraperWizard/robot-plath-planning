import Robot from "../../Components/Robot/Robot";
import { Arena } from "./Arena";
import ArenaCoordinate from "./ArenaCoordinate";
import Cell from "./Cell";
import { Item } from "../../Components/Item/Item";
import RobotViewItem from "../../Components/Robot/RobotView";
import { ItemSize } from "../../Components/Item/types";
import { RobotLookingAngles } from "../../Components/Robot/types";

class ArenaPlotter {
  private arena: Arena;
  private grid: Array<Array<Cell>>;
  private robot: Robot;

  constructor(arena: Arena) {
    this.arena = arena;
    this.grid = this.arena.getGrid();
  }

  plotRobot(coordinate: ArenaCoordinate, Robot: Robot): void {
    if (this.arena.getRobot() !== null) {
      throw new Error("Robot already exists");
    }

    const newRobotCoordinate: Array<ArenaCoordinate> = this.plotItem(coordinate, Robot);

    Robot.setPosition(newRobotCoordinate);
    this.arena.setRobot(Robot);
    this.robot = Robot;
    this.updateRobotView();
  }

  updateRobotView() {
    this.markCellsAsVisitedInViewOfRobot();
  }

  markCellsAsVisitedInViewOfRobot(): void {
    const distanceOfView = this.robot.getViewOfDistance();
    const robotPositionReference = this.getArenaCoordinateAtAngle(this.robot.getPosition(), this.robot.getLookingAngle());
    const x = robotPositionReference.getX();
    const y = robotPositionReference.getY();

    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        const cell = this.grid[i][j];
        const cellX = j;
        const cellY = i;
        let v = cellX - x;
        let b = y - cellY;
        let c = Math.atan2(b, v) * (180 / Math.PI);
        if (c <= 0) {
          c = Math.abs(c) + 90;
        } else {
          if (c <= 90) {
            c = 90 - c;
          } else {
            c = 360 - (c - 90);
          }
        }

        //adjust the value of c relative to the robot angle
        let fullCircle = 360;
        let c1 = Math.abs(c - this.robot.getLookingAngle());
        let c2 = Math.abs(fullCircle - c + this.robot.getLookingAngle());
        c = Math.min(c1, c2);

        //adjust the value of
        if (c > 180) {
          c -= 360;
        }

        const angle = this.robot.getViewOfAngle();
        let midAngle = angle / 2;

        const distance = Math.sqrt(Math.pow(cellX - x, 2) + Math.pow(cellY - y, 2));

        if (distance <= distanceOfView && Math.abs(c) <= midAngle) {
          cell.setIsVisited(true);
        }
      }
    }
  }

  isItemInLineOfSight(x1: number, y1: number, x2: number, y2: number): Boolean {
    // Define differences and error check
    let dx = Math.abs(x2 - x1);
    let dy = Math.abs(y2 - y1);
    let sx = x1 < x2 ? 1 : -1;
    let sy = y1 < y2 ? 1 : -1;
    let err = dx - dy;
    let isItemFound = false;

    // Main loop
    while (!(x1 == x2 && y1 == y2)) {
      var e2 = err << 1;
      if (e2 > -dy) {
        err -= dy;
        x1 += sx;
      }
      if (e2 < dx) {
        err += dx;
        y1 += sy;
      }

      if (this.grid[y1][x1].getHasItem()) {
        isItemFound = true;
        break;
      }
    }
    // Return the result
    return isItemFound;
  }

  plotItemByView(View: RobotViewItem) {
    const item: Item = new Item(View.getType(), View.getSize());

    if (this.robot.getLookingAngle() + View.getAngle() < 90) {
      View.setAngle(90 - View.getAngle() + this.robot.getLookingAngle());
    } else {
      View.setAngle(360 - (View.getAngle() + this.robot.getLookingAngle() - 90));
    }

    // If robot is not of size 1, then we need to get which cell is at the edge of where the robot is looking
    const itemCenterPointAngle = this.getArenaCoordinateAtAngle(this.robot.getPosition(), this.robot.getLookingAngle());

    const itemCenterPoint: ArenaCoordinate = new ArenaCoordinate(itemCenterPointAngle.getX(), itemCenterPointAngle.getY());
    itemCenterPoint.rotateAndShiftItemByView(View);

    const newItemPositions: Array<ArenaCoordinate> = this.fillArea(itemCenterPoint.getX(), itemCenterPoint.getY(), View.getSize(), item);
    item.setPosition(newItemPositions);
  }

  getArenaCoordinateAtAngle(arenaCoordinates: ArenaCoordinate[], angle: RobotLookingAngles): ArenaCoordinate {
    let minX = 100000;
    let minY = 100000;
    let maxX = -1;
    let maxY = -1;

    for (let i = 0; i < arenaCoordinates.length; i++) {
      minX = Math.min(minX, arenaCoordinates[i].getX());
      minY = Math.min(minY, arenaCoordinates[i].getY());
      maxX = Math.max(maxX, arenaCoordinates[i].getX());
      maxY = Math.max(maxY, arenaCoordinates[i].getY());
    }

    if (angle == RobotLookingAngles.UP) {
      return new ArenaCoordinate(Math.floor((minX + maxX) / 2), minY);
    }

    if (angle == RobotLookingAngles.RIGHT) {
      return new ArenaCoordinate(maxX, Math.floor((minY + maxY) / 2));
    }

    if (angle == RobotLookingAngles.DOWN) {
      return new ArenaCoordinate(Math.floor((minX + maxX) / 2), maxY);
    }

    if (angle == RobotLookingAngles.LEFT) {
      return new ArenaCoordinate(minX, Math.floor((minY + maxY) / 2));
    }

    return new ArenaCoordinate(minX, Math.floor((minY + maxY) / 2));
  }

  plotItem(coordinate: ArenaCoordinate, item: Item | Robot): Array<ArenaCoordinate> {
    const itemSize = item.getSize();
    const centerX = coordinate.getX();
    const centerY = coordinate.getY();
    const arenaHeight = this.arena.getHeight();
    const arenaWidth = this.arena.getWidth();

    if (
      centerX + itemSize > arenaWidth ||
      centerY + itemSize > arenaHeight ||
      centerX < 0 ||
      centerY < 0 ||
      itemSize > arenaWidth ||
      itemSize > arenaHeight ||
      itemSize + centerX < 0 ||
      itemSize + centerY < 0 ||
      itemSize + centerX > arenaWidth ||
      itemSize + centerY > arenaHeight ||
      centerX - itemSize < -1 ||
      centerY - itemSize < -1
    ) {
      throw new Error("Item could not be plotted, Coordinates out of bound");
    }

    const newItemCoordinate: Array<ArenaCoordinate> = this.fillArea(centerX, centerY, itemSize - 1, item);
    item.setPosition(newItemCoordinate);
    if (item instanceof Item) {
      this.arena.items.push(item);
    }
    return newItemCoordinate;
  }

  fillArea(x: number, y: number, area: number, item: Item | Robot): Array<ArenaCoordinate> {
    if (x < 0 || y < 0 || x >= this.arena.getWidth() || y >= this.arena.getHeight()) {
      return;
    }

    const newItemCoordinate: Array<ArenaCoordinate> = [];
    const startX = x - area;
    const startY = y - area;

    for (let i = startX; i <= startX + area * 2; i++) {
      for (let j = startY; j <= startY + area * 2; j++) {
        if (this.grid[j][i].getHasItem()) {
          if (this.grid[j][i].getItem().getType() === "R") {
            throw new Error(`Item could not be plotted, you cannot overwrite a robot`);
          }
        }

        this.grid[j][i].addItem(item);
        newItemCoordinate.push(new ArenaCoordinate(j, i));
      }
    }

    return newItemCoordinate;
  }

  markCellsAsVisited(coordinateArray: Array<ArenaCoordinate>): void {
    for (let i = 0; i < coordinateArray.length; i++) {
      const x = coordinateArray[i].getX();
      const y = coordinateArray[i].getY();

      this.grid[y][x].visit();
    }
  }
}

export default ArenaPlotter;
