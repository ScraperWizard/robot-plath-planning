enum EventTypes {
  MOVE = "MOVE",
  PICK_UP = "PICK_UP",
  THROW_TRASH_BIN = "THROW_TRASH_BIN",
  DROP = "DROP",
  UNEXPECTED_OBJECT = "UNEXPECTED_OBJECT",
  OBJECT_DETECTED = "OBJECT_DETECTED",
}

class Event {
  private timestamp = new Date();
  private type: EventTypes;
  private data: any;

  constructor(type: EventTypes, data: any) {
    this.type = type;
    this.data = data;
  }

  public getPassedTimeSinceTimStamp(): Date {
    return new Date(new Date().getTime() - this.timestamp.getTime());
  }

  public getType(): EventTypes {
    return this.type;
  }

  public getData(): any {
    return this.data;
  }
}

export { Event, EventTypes };
