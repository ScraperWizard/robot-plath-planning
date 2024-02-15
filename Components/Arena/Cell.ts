import { Item } from "../../Components/Item/Item";
import { ItemsTypes } from "../../Components/Item/types";
import Robot from "../../Components/Robot/Robot";

class Cell {
    private x: number;
    private y: number;
    private isVisited: Boolean = false;
    private hasItem: Boolean = false;
    private Item: Item | Robot;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public getX(): number {
        return this.x;
    }

    public getY(): number {
        return this.y;
    }

    public getIsVisited(): Boolean {
        return this.isVisited;
    }

    getIsWalkable(): Boolean {
        if(this.hasItem) {
            if(this.getHasItem() && this.getItem().getType() == ItemsTypes.Obstacle) {
                return false;
            }
        }

        return true;
    }

    public setIsVisited(isVisited: Boolean): void {
        this.isVisited = isVisited;
    }

    public getHasItem(): Boolean {
        return this.hasItem;
    }

    public addItem(Item: Item | Robot) {
        this.hasItem = true;
        this.setIsVisited(true);
        this.Item = Item;
    }

    public removeItem(): void {
        this.hasItem = false;
        this.Item = null;
    }

    public getItem(): Item | Robot {
        return this.Item;
    }

    public visit(): void {
        this.isVisited = true;
    }
}

export default Cell;