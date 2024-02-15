import Robot from "../../Components/Robot/Robot";
import { Arena } from "../../Components/Arena/Arena";
import RobotViewItem from "../../Components/Robot/RobotView";
import { ItemsTypes } from "../../Components/Item/types";

class Client {
  private isReady: boolean = false;
  private hasPassedStepOne: boolean = false;
  private arena: Arena;
  private robot: Robot;
  private socket: any;

  constructor(arena: Arena, robot: Robot, socket: any) {
    this.arena = arena;
    this.robot = robot;
    this.socket = socket;
  }

  setClientReady(): void {
    this.isReady = true;
  }

  private isClientReady(): boolean {
    return this.isReady;
  }

  registerViewObjects(data: any): void {
    if(!this.isClientReady()) return;

    for (const item of data) {
      try {
        const ObstacleView: RobotViewItem = new RobotViewItem({
          angle: item["angle"],
          distance: item["distance"],
          type: item["type"],
          size: item["size"],
        });

        this.arena.addItemByView(ObstacleView);
      } catch (err) {
        console.log(`Error registering view objects item ${item}`, err);
      }
    }
  }

  mainProcess() {
    while(this.arena.containsItem(ItemsTypes.Trash)) {

    }
  }
}

// function waitForEvent(server: any, event: string) {
//     return new Promise((resolve) => {
//       methodListeners[event] = resolve;
//     });
//   }

export default Client;
