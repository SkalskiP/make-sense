import {IRect} from "../interfaces/IRect";
import {IPoint} from "../interfaces/IPoint";
import {ISize} from "../interfaces/ISize";

export class RectUtil {
    public static getRatio(rect: IRect): number {
        return rect.width/rect.height
    }

    public static intersect(r1: IRect, r2: IRect) {
        return !(
            r2.x > r1.x + r1.width ||
            r2.x + r2.width < r1.x ||
            r2.y > r1.y + r1.height ||
            r2.y + r2.height < r1.y
        );
    }

    public static isPointInside(rect: IRect, point: IPoint): boolean {
        return (
            rect.x < point.x &&
            rect.x + rect.width > point.x &&
            rect.y < point.y &&
            rect.y + rect.height > point.y
        )
    }

    public static getRectVertices(rect: IRect): IPoint[] {
        return [
            {
                x: rect.x,
                y: rect.y
            },
            {
                x: rect.x,
                y: rect.y + rect.height
            },
            {
                x: rect.x + rect.width,
                y: rect.y
            },
            {
                x: rect.x + rect.width,
                y: rect.y + rect.height
            }
        ]
    }

    public static getRectWithCenterAndSize(centerPoint: IPoint, size: ISize): IRect {
        return {
            x: centerPoint.x - 0.5 * size.width,
            y: centerPoint.y - 0.5 * size.height,
            ...size
        }
    }

    public static fitInsideRectWithRatio(containerRect: IRect, ratio: number): IRect {
        const containerRectRatio = RectUtil.getRatio(containerRect);
        if (containerRectRatio < ratio) {
            const innerRectHeight = containerRect.width / ratio;
            return {
                x: containerRect.x,
                y: containerRect.y + (containerRect.height - innerRectHeight) / 2,
                width: containerRect.width,
                height: innerRectHeight
            }
        }
        else {
            const innerRectWidth = containerRect.height * ratio;
            return {
                x: containerRect.x + (containerRect.width - innerRectWidth) / 2,
                y: containerRect.y,
                width: innerRectWidth,
                height: containerRect.height
            }
        }
    }
}