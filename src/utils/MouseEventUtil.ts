import {EventType} from "../data/enums/EventType";

export class MouseEventUtil {
    public static getEventType(event: Event): EventType | null {
        if (!event) return null;

        switch (event.type) {
            case EventType.MOUSE_DOWN:
                return EventType.MOUSE_DOWN;
            case EventType.MOUSE_UP:
                return EventType.MOUSE_UP;
            case EventType.MOUSE_MOVE:
                return EventType.MOUSE_MOVE;
            default:
                return null;
        }
    }
}