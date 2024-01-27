"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventTypes = exports.Event = void 0;
var EventTypes;
(function (EventTypes) {
    EventTypes["MOVE"] = "MOVE";
    EventTypes["PICK_UP"] = "PICK_UP";
    EventTypes["THROW_TRASH_BIN"] = "THROW_TRASH_BIN";
    EventTypes["DROP"] = "DROP";
    EventTypes["UNEXPECTED_OBJECT"] = "UNEXPECTED_OBJECT";
    EventTypes["OBJECT_DETECTED"] = "OBJECT_DETECTED";
})(EventTypes || (exports.EventTypes = EventTypes = {}));
class Event {
    constructor(type, data) {
        this.timestamp = new Date();
        this.type = type;
        this.data = data;
    }
    getPassedTimeSinceTimStamp() {
        return new Date(new Date().getTime() - this.timestamp.getTime());
    }
    getType() {
        return this.type;
    }
    getData() {
        return this.data;
    }
}
exports.Event = Event;
//# sourceMappingURL=types.js.map