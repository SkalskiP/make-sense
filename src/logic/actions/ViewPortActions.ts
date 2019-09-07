import {EditorModel} from "../../staticModels/EditorModel";
import {NumberUtil} from "../../utils/NumberUtil";
import {ViewPointSettings} from "../../settings/ViewPointSettings";
import {ISize} from "../../interfaces/ISize";
import {IRect} from "../../interfaces/IRect";
import {ImageUtil} from "../../utils/ImageUtil";
import {RectUtil} from "../../utils/RectUtil";
import {IPoint} from "../../interfaces/IPoint";
import {PointUtil} from "../../utils/PointUtil";
import {SizeUtil} from "../../utils/SizeUtil";
import {EditorActions} from "./EditorActions";

export class ViewPortActions {
    public static calculateViewPortSize(): ISize {
        if (!!EditorModel.editor) {
            return {
                width: EditorModel.editor.offsetWidth,
                height: EditorModel.editor.offsetHeight
            }
        } else {
            return null;
        }
    }

    public static calculateDefaultViewPortImageRect(): IRect {
        if (!!EditorModel.viewPortSize && !!EditorModel.image) {
            const minMargin: IPoint = {x: ViewPointSettings.CANVAS_MIN_MARGIN_PX, y: ViewPointSettings.CANVAS_MIN_MARGIN_PX};
            const realImageRect: IRect = {x: 0, y: 0, ...ImageUtil.getSize(EditorModel.image)};
            const viewPortWithMarginRect: IRect = {x: 0, y: 0, ...EditorModel.viewPortSize};
            const viewPortWithoutMarginRect: IRect = RectUtil.expand(viewPortWithMarginRect, PointUtil.multiply(minMargin, -1));
            return RectUtil.fitInsideRectWithRatio(viewPortWithoutMarginRect, RectUtil.getRatio(realImageRect));
        } else {
            return null;
        }
    }

    public static calculateViewPortContentSize(): ISize {
        if (!!EditorModel.viewPortSize) {
            return SizeUtil.scale(EditorModel.viewPortSize, EditorModel.zoom);
        } else {
            return null;
        }
    }

    public static calculateViewPortContentImageRect(): IRect {
        if (!!EditorModel.viewPortSize && !!EditorModel.image) {
            const defaultViewPortImageRect: IRect = ViewPortActions.calculateDefaultViewPortImageRect();
            const viewPortContentSize: ISize = ViewPortActions.calculateViewPortContentSize();
            return {
                ...defaultViewPortImageRect,
                width: viewPortContentSize.width - 2 * defaultViewPortImageRect.x,
                height: viewPortContentSize.height - 2 * defaultViewPortImageRect.y
            }
        } else {
            return null;
        }
    }

    public static resizeViewPortContent = (newCanvasSize: ISize) => {
        if (!!newCanvasSize && !!EditorModel.canvas) {
            EditorModel.canvas.width = newCanvasSize.width;
            EditorModel.canvas.height = newCanvasSize.height;
        }
    };

    public static zoomIn() {
        const currentZoomPercentage: number = EditorModel.zoom;
        ViewPortActions.setZoom(currentZoomPercentage + ViewPointSettings.ZOOM_STEP);
        const viewPortContentSize = ViewPortActions.calculateViewPortContentSize();
        viewPortContentSize && ViewPortActions.resizeViewPortContent(viewPortContentSize);
        EditorActions.fullRender();
    }

    public static zoomOut() {
        const currentZoomPercentage: number = EditorModel.zoom;
        ViewPortActions.setZoom(currentZoomPercentage - ViewPointSettings.ZOOM_STEP);
        const viewPortContentSize = ViewPortActions.calculateViewPortContentSize();
        viewPortContentSize && ViewPortActions.resizeViewPortContent(viewPortContentSize);
        EditorActions.fullRender();
    }

    public static setZoom(value: number) {
        const currentZoom: number = EditorModel.zoom;
        const isNewValueValid: boolean = NumberUtil.isValueInRange(
            value, ViewPointSettings.MIN_ZOOM, ViewPointSettings.MAX_ZOOM);

        if (isNewValueValid && value !== currentZoom) {
            EditorModel.zoom = value;
        }
    }
}