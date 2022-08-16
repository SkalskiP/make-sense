import {IPoint} from '../interfaces/IPoint';

export class PointUtil {
    public static equals(p1: IPoint, p2: IPoint): boolean {
        return p1.x === p2.x && p1.y === p2.y;
    }

    public static add(p1: IPoint, p2: IPoint): IPoint {
        return {
            x: p1.x + p2.x,
            y: p1.y + p2.y
        }
    }

    public static subtract(p1: IPoint, p2: IPoint): IPoint {
        return {
            x: p1.x - p2.x,
            y: p1.y - p2.y
        }
    }

    public static multiply(p1: IPoint, factor: number) {
        return {
            x: p1.x * factor,
            y: p1.y * factor
        }
    }
}