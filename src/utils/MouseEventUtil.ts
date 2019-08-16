import {MouseEventType} from "../data/MouseEventType";

export class MouseEventUtil {
    public static getEventType(event: MouseEvent): MouseEventType | null {
        if (!event) return null;

        switch (event.type) {
            case MouseEventType.DOWN:
                return MouseEventType.DOWN;
            case MouseEventType.UP:
                return MouseEventType.UP;
            case MouseEventType.MOVE:
                return MouseEventType.MOVE;
            default:
                return null;
        }
    }
}