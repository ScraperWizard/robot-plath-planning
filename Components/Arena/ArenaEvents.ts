import { Arena } from "./Arena";
import { Item } from "../../Components/Item/Item";

class ArenaEvents {
  private arena: Arena;
  constructor(arena: Arena) {
    this.arena = arena;
  }

  pickUpItem(item: Item) {
    // Check if this item is actually in the arena
    let itemFromArena: Item = null;

    for(let i = 0; i < this.arena.items.length; i++) {
      if(this.arena.items[i] == item) {
        itemFromArena = this.arena.items[i];
      }
    }

    if(itemFromArena == null) {
      throw new Error("Item is not in the arena");
    }

    // // Check if the item is in the bounds of the robot
    // for(let i = 0; i <)
  }

}
