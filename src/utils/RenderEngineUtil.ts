import {EditorData} from "../data/EditorData";
import {RectUtil} from "./RectUtil";
import {store} from "../index";
import {CustomCursorStyle} from "../data/CustomCursorStyle";
import {updateCustomCursorStyle} from "../store/general/actionCreators";
import {IPoint} from "../interfaces/IPoint";
import {PointUtil} from "./PointUtil";
import {IRect} from "../interfaces/IRect";
import {Direction} from "../data/Direction";

export class RenderEngineUtil {

    public static isMouseOverImage(data: EditorData): boolean {
        return RectUtil.isPointInside(data.viewPortRectOnCanvas, data.mousePositionOnCanvas);
    }

    public static isMouseOverCanvas(data: EditorData): boolean {
        return RectUtil.isPointInside({x: 0, y: 0, ...data.canvasSize}, data.mousePositionOnCanvas);
    }

    public static transferPolygonFromImageToCanvas(polygon: IPoint[], data: EditorData): IPoint[] {
        return polygon.map((point: IPoint) => RenderEngineUtil.transferPointFromImageToCanvas(point, data));
    }

    public static transferPointFromImageToCanvas(point: IPoint, data: EditorData): IPoint {
        return PointUtil.subtract(PointUtil.add(PointUtil.multiply(point, 1/data.realImageToRenderImageScale), data.viewPortRectOnCanvas), data.viewPortRectOnRenderImage);
    }

    public static transferPolygonFromCanvasToImage(polygon: IPoint[], data: EditorData): IPoint[] {
        return polygon.map((point: IPoint) => RenderEngineUtil.transferPointFromCanvasToImage(point, data));
    }

    public static transferPointFromCanvasToImage(point: IPoint, data: EditorData): IPoint {
        return PointUtil.multiply(PointUtil.add(PointUtil.subtract(point, data.viewPortRectOnCanvas), data.viewPortRectOnRenderImage), data.realImageToRenderImageScale);
    }

    public static transferRectFromCanvasToImage(rect: IRect, data: EditorData): IRect {
        const translation: IPoint = {
            x: data.viewPortRectOnCanvas.x - data.viewPortRectOnRenderImage.x,
            y: data.viewPortRectOnCanvas.y - data.viewPortRectOnRenderImage.y,
        };
        return RectUtil.translate(RectUtil.scaleRect(rect, 1/data.realImageToRenderImageScale), translation);
    }

    public static transferRectFromImageToCanvas(rect: IRect, data: EditorData): IRect {
        const translation: IPoint = {
            x: data.viewPortRectOnRenderImage.x - data.viewPortRectOnCanvas.x,
            y: data.viewPortRectOnRenderImage.y - data.viewPortRectOnCanvas.y,
        };
        return RectUtil.scaleRect(RectUtil.translate(rect, translation), data.realImageToRenderImageScale);
    }

    public static wrapDefaultCursorStyleInCancel(data: EditorData) {
        if (RectUtil.isPointInside(data.viewPortRectOnCanvas, data.mousePositionOnCanvas)) {
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

    public static transformDirectionIntoVector(direction: Direction): IPoint {
        switch (direction) {
            case Direction.RIGHT:
                return {x: 1, y: 0};
            case Direction.LEFT:
                return {x: -1, y: 0};
            case Direction.TOP:
                return {x: 0, y: 1};
            case Direction.BOTTOM:
                return {x: 0, y: -1};
            case Direction.TOP_RIGHT:
                return {x: 1, y: 1};
            case Direction.TOP_LEFT:
                return {x: -1, y: 1};
            case Direction.BOTTOM_RIGHT:
                return {x: 1, y: -1};
            case Direction.BOTTOM_LEFT:
                return {x: -1, y: -1};
            case Direction.CENTER:
                return {x: 0, y: 0};
            default:
                return null;
        }
    }
}