import {EditorData} from "../data/EditorData";
import {RectUtil} from "./RectUtil";
import {store} from "../index";
import {CustomCursorStyle} from "../data/enums/CustomCursorStyle";
import {updateCustomCursorStyle} from "../store/general/actionCreators";
import {IPoint} from "../interfaces/IPoint";
import {PointUtil} from "./PointUtil";
import {IRect} from "../interfaces/IRect";

export class RenderEngineUtil {
    public static calculateImageScale(data: EditorData): number {
        return data.realImageSize.width / data.viewPortContentImageRect.width;
    }

    public static isMouseOverImage(data: EditorData): boolean {
        return RectUtil.isPointInside(data.viewPortContentImageRect, data.mousePositionOnViewPortContent);
    }

    public static isMouseOverCanvas(data: EditorData): boolean {
        return RectUtil.isPointInside({x: 0, y: 0, ...data.viewPortContentSize}, data.mousePositionOnViewPortContent);
    }

    public static transferPolygonFromImageToViewPortContent(polygon: IPoint[], data: EditorData): IPoint[] {
        return polygon.map((point: IPoint) => RenderEngineUtil.transferPointFromImageToViewPortContent(point, data));
    }

    public static transferPointFromImageToViewPortContent(point: IPoint, data: EditorData): IPoint {
        const scale = RenderEngineUtil.calculateImageScale(data);
        return PointUtil.add(PointUtil.multiply(point, 1/scale), data.viewPortContentImageRect);
    }

    public static transferPolygonFromViewPortContentToImage(polygon: IPoint[], data: EditorData): IPoint[] {
        return polygon.map((point: IPoint) => RenderEngineUtil.transferPointFromViewPortContentToImage(point, data));
    }

    public static transferPointFromViewPortContentToImage(point: IPoint, data: EditorData): IPoint {
        const scale = RenderEngineUtil.calculateImageScale(data);
        return PointUtil.multiply(PointUtil.subtract(point, data.viewPortContentImageRect), scale);
    }

    public static transferRectFromViewPortContentToImage(rect: IRect, data: EditorData): IRect {
        const scale = RenderEngineUtil.calculateImageScale(data);
        return RectUtil.translate(RectUtil.scaleRect(rect, 1/scale), data.viewPortContentImageRect);
    }

    public static transferRectFromImageToViewPortContent(rect: IRect, data: EditorData): IRect {
        const scale = RenderEngineUtil.calculateImageScale(data);
        const translation: IPoint = {
            x: - data.viewPortContentImageRect.x,
            y: - data.viewPortContentImageRect.y
        };

        return RectUtil.scaleRect(RectUtil.translate(rect, translation), scale);
    }

    public static wrapDefaultCursorStyleInCancel(data: EditorData) {
        if (RectUtil.isPointInside(data.viewPortContentImageRect, data.mousePositionOnViewPortContent)) {
            store.dispatch(updateCustomCursorStyle(CustomCursorStyle.DEFAULT));
        } else {
            store.dispatch(updateCustomCursorStyle(CustomCursorStyle.CANCEL));
        }
    }

    public static setValueBetweenPixels(value: number): number {
        return Math.floor(value) + 0.5;
    }

    public static setPointBetweenPixels(point: IPoint): IPoint {
        return {
            x: RenderEngineUtil.setValueBetweenPixels(point.x),
            y: RenderEngineUtil.setValueBetweenPixels(point.y)
        }
    }

    public static setRectBetweenPixels(rect: IRect): IRect {
        const topLeft: IPoint = {
            x: rect.x,
            y: rect.y
        };
        const bottomRight: IPoint = {
            x: rect.x + rect.width,
            y: rect.y + rect.height
        };
        const topLeftBetweenPixels = RenderEngineUtil.setPointBetweenPixels(topLeft);
        const bottomRightBetweenPixels = RenderEngineUtil.setPointBetweenPixels(bottomRight);
        return {
            x: topLeftBetweenPixels.x,
            y: topLeftBetweenPixels.y,
            width: bottomRightBetweenPixels.x - topLeftBetweenPixels.x,
            height: bottomRightBetweenPixels.y - topLeftBetweenPixels.y
        }
    }
}