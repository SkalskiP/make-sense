import {EditorModel} from "../../staticModels/EditorModel";
import {NumberUtil} from "../../utils/NumberUtil";
import {ViewPointSettings} from "../../settings/ViewPointSettings";
import {ISize} from "../../interfaces/ISize";
import {IRect} from "../../interfaces/IRect";
import {ImageUtil} from "../../utils/ImageUtil";
import {RectUtil} from "../../utils/RectUtil";
import {IPoint} from "../../interfaces/IPoint";
import {PointUtil} from "../../utils/PointUtil";

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

    public static calculateDefaulRenderImageRect(): IRect {
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

    public static resizeCanvas = (newCanvasSize: ISize) => {
        if (!!newCanvasSize && !!EditorModel.canvas) {
            EditorModel.canvas.width = newCanvasSize.width;
            EditorModel.canvas.height = newCanvasSize.height;
        }
    };

    public static zoomIn() {
        const currentZoomPercentage: number = EditorModel.zoomPercentage;
        ViewPortActions.setZoomPercentage(currentZoomPercentage + ViewPointSettings.ZOOM_PERCENTAGE_STEP);
    }

    public static zoomOut() {
        const currentZoomPercentage: number = EditorModel.zoomPercentage;
        ViewPortActions.setZoomPercentage(currentZoomPercentage - ViewPointSettings.ZOOM_PERCENTAGE_STEP);
    }

    public static setZoomPercentage(value: number) {
        const currentZoomPercentage: number = EditorModel.zoomPercentage;
        const isNewValueValid: boolean = NumberUtil.isValueInRange(
            value, ViewPointSettings.MIN_ZOOM_PERCENTAGE, ViewPointSettings.MAX_ZOOM_PERCENTAGE);

        if (isNewValueValid && value !== currentZoomPercentage) {
            EditorModel.zoomPercentage = value;
        }
    }
}