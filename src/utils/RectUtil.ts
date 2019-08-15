import {IRect} from "../interfaces/IRect";
import {IPoint} from "../interfaces/IPoint";
import {ISize} from "../interfaces/ISize";
import {AnchorType} from "../data/AnchorType";
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

    public static resizeRect(inputRect: IRect, rectAnchor: AnchorType, delta): IRect {
        const rect: IRect = {...inputRect};
        switch (rectAnchor) {
            case AnchorType.RIGHT:
                rect.width += delta.x;
                break;
            case AnchorType.BOTTOM_RIGHT:
                rect.width += delta.x;
                rect.height += delta.y;
                break;
            case AnchorType.BOTTOM:
                rect.height += delta.y;
                break;
            case AnchorType.TOP_RIGHT:
                rect.width += delta.x;
                rect.y += delta.y;
                rect.height -= delta.y;
                break;
            case AnchorType.TOP:
                rect.y += delta.y;
                rect.height -= delta.y;
                break;
            case AnchorType.TOP_LEFT:
                rect.x += delta.x;
                rect.width -= delta.x;
                rect.y += delta.y;
                rect.height -= delta.y;
                break;
            case AnchorType.LEFT:
                rect.x += delta.x;
                rect.width -= delta.x;
                break;
            case AnchorType.BOTTOM_LEFT:
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

    public static expand(rect: IRect, delta: IPoint): IRect {
        return {
            x: rect.x - delta.x,
            y: rect.y - delta.y,
            width: rect.width + 2 * delta.x,
            height: rect.height + 2 * delta.y
        }
    }

    public static mapRectToAnchors(rect: IRect): RectAnchor[] {
        return [
            {type: AnchorType.TOP_LEFT, middlePosition: {x: rect.x, y: rect.y}},
            {type: AnchorType.TOP, middlePosition: {x: rect.x + 0.5 * rect.width, y: rect.y}},
            {type: AnchorType.TOP_RIGHT, middlePosition: {x: rect.x + rect.width, y: rect.y}},
            {type: AnchorType.LEFT, middlePosition: {x: rect.x, y: rect.y + 0.5 * rect.height}},
            {type: AnchorType.RIGHT, middlePosition: {x: rect.x + rect.width, y: rect.y + 0.5 * rect.height}},
            {type: AnchorType.BOTTOM_LEFT, middlePosition: {x: rect.x, y: rect.y + rect.height}},
            {type: AnchorType.BOTTOM, middlePosition: {x: rect.x + 0.5 * rect.width, y: rect.y + rect.height}},
            {type: AnchorType.BOTTOM_RIGHT, middlePosition: {x: rect.x + rect.width, y: rect.y + rect.height}}
        ]
    }
}