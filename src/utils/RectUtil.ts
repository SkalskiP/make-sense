import {IRect} from "../interfaces/IRect";
import {IPoint} from "../interfaces/IPoint";
import {ISize} from "../interfaces/ISize";
import {RectAnchorType} from "../data/RectAnchorType";
import {RectAnchor} from "../data/RectAnchor";

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

    public static resizeRect(inputRect: IRect, rectAnchor: RectAnchorType, delta): IRect {
        const rect: IRect = {...inputRect};
        switch (rectAnchor) {
            case RectAnchorType.RIGHT:
                rect.width += delta.x;
                break;
            case RectAnchorType.BOTTOM_RIGHT:
                rect.width += delta.x;
                rect.height += delta.y;
                break;
            case RectAnchorType.BOTTOM:
                rect.height += delta.y;
                break;
            case RectAnchorType.TOP_RIGHT:
                rect.width += delta.x;
                rect.y += delta.y;
                rect.height -= delta.y;
                break;
            case RectAnchorType.TOP:
                rect.y += delta.y;
                rect.height -= delta.y;
                break;
            case RectAnchorType.TOP_LEFT:
                rect.x += delta.x;
                rect.width -= delta.x;
                rect.y += delta.y;
                rect.height -= delta.y;
                break;
            case RectAnchorType.LEFT:
                rect.x += delta.x;
                rect.width -= delta.x;
                break;
            case RectAnchorType.BOTTOM_LEFT:
                rect.x += delta.x;
                rect.width -= delta.x;
                rect.height += delta.y;
                break;
        }

        if (rect.width < 0)  {
            rect.x = rect.x + rect.width;
            rect.width = - rect.width;
        }

        if (rect.height < 0)  {
            rect.y = rect.y + rect.height;
            rect.height = - rect.height;
        }

        return rect;
    }

    public static translate(rect: IRect, delta: IPoint): IRect {
        return {
            ...rect,
            x: rect.x + delta.x,
            y: rect.y + delta.y
        }
    }

    public static mapRectToAnchors(rect: IRect): RectAnchor[] {
        return [
            {type: RectAnchorType.TOP_LEFT, middlePosition: {x: rect.x, y: rect.y}},
            {type: RectAnchorType.TOP, middlePosition: {x: rect.x + 0.5 * rect.width, y: rect.y}},
            {type: RectAnchorType.TOP_RIGHT, middlePosition: {x: rect.x + rect.width, y: rect.y}},
            {type: RectAnchorType.LEFT, middlePosition: {x: rect.x, y: rect.y + 0.5 * rect.height}},
            {type: RectAnchorType.RIGHT, middlePosition: {x: rect.x + rect.width, y: rect.y + 0.5 * rect.height}},
            {type: RectAnchorType.BOTTOM_LEFT, middlePosition: {x: rect.x, y: rect.y + rect.height}},
            {type: RectAnchorType.BOTTOM, middlePosition: {x: rect.x + 0.5 * rect.width, y: rect.y + rect.height}},
            {type: RectAnchorType.BOTTOM_RIGHT, middlePosition: {x: rect.x + rect.width, y: rect.y + rect.height}}
        ]
    }
}