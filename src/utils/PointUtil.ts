import {IPoint} from "../interfaces/IPoint";

export class PointUtil {
    public static equals(p1: IPoint, p2: IPoint): boolean {
        return p1.x === p2.x && p1.y === p2.y;
    }

    public static translate(point: IPoint, delta: IPoint): IPoint {
        return {
            x: point.x + delta.x,
            y: point.y + delta.y
        }
    }
}