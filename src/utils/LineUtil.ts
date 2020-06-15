import {ILine} from "../interfaces/ILine";
import {IPoint} from "../interfaces/IPoint";

export class LineUtil {
    public static getDistanceFromLine(l: ILine, p: IPoint): number {
        if (l.start.x !== l.end.x || l.start.y !== l.end.y) {
            const nom: number = Math.abs((l.end.y - l.start.y) * p.x - (l.end.x - l.start.x) * p.y + l.end.x * l.start.y - l.end.y * l.start.x);
            const denom: number = Math.sqrt(Math.pow(l.end.y - l.start.y, 2) + Math.pow(l.end.x - l.start.x, 2));
            return nom / denom;
        }
        return null;
    }

    public static getCenter(l: ILine): IPoint {
        return {
            x: (l.start.x + l.end.x) / 2,
            y: (l.start.y + l.end.y) / 2
        }
    }

    public static getPoints(l: ILine): IPoint[] {
        return [l.start, l.end]
    }
}