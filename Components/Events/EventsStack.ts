import { Event } from "./types";
class EventsStack {
    private events: Array<Event> = [];

    public push(event: Event): void {
        this.events.push(event);
    }

    public pop(): Event {
        return this.events.pop();
    }

    public getEvents(): Array<Event> {
        return this.events;
    }
}

export default EventsStack;