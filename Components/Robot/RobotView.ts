import { ItemsTypes, ItemSize } from "../Item/types";

class RobotViewItem {
  private angle: number;
  private clockwise: boolean;
  private distance: number;
  private type: ItemsTypes;
  private ItemSize: ItemSize = ItemSize.SMALL;

  constructor({ angle, distance, type, size }: { angle: number; distance: number; type: ItemsTypes, size: ItemSize}) {
    this.angle = angle;
    this.distance = distance;
    this.type = type;
    this.ItemSize = this.ItemSize;
  }

  public getAngle(): number {
    return this.angle;
  }

  public getSize(): ItemSize {
    return this.ItemSize;
  }

  public getDistance(): number {
    return this.distance;
  }

  public getType(): ItemsTypes {
    return this.type;
  }

  public setAngle(angle: number): void {
    this.angle = angle;
  }

  public setDistance(distance: number): void {
    this.distance = distance;
  }

  public setType(type: ItemsTypes): void {
    this.type = type;
  }
}

export default RobotViewItem;
