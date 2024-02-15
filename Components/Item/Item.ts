import { ArenaCoordinate } from "../Arena/types.js";
import { ItemSize, ItemsTypes } from "./types";

class Item {
  private position: Array<ArenaCoordinate>;
  private type: ItemsTypes;
  private size: ItemSize;

  constructor(type: ItemsTypes, size: ItemSize) {
    this.type = type;
    this.size = size;
  }

  public getPosition(): Array<ArenaCoordinate> {
    return this.position;
  }

  getPointCoordinate() {
    const coord: ArenaCoordinate = this.position[Math.floor(this.position.length / 2)];

    return {
      x: coord.getX(),
      y: coord.getY(),
    };
  }

  public getSize(): number {
    return this.size;
  }

  public setSize(size: number): void {
    this.size = size;
  }

  public getType(): ItemsTypes {
    return this.type;
  }

  public setPosition(position: Array<ArenaCoordinate>): void {
    this.position = position;
  }

  public setType(type: ItemsTypes): void {
    this.type = type;
  }
}

export { Item };
