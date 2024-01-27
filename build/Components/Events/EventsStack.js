"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EventsStack {
    constructor() {
        this.events = [];
    }
    push(event) {
        this.events.push(event);
    }
    pop() {
        return this.events.pop();
    }
    getEvents() {
        return this.events;
    }
}
exports.default = EventsStack;
//# sourceMappingURL=EventsStack.js.map