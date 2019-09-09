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
import {Direction} from "../../data/enums/Direction";
import {DirectionUtil} from "../../utils/DirectionUtil";

export class ViewPortActions {
    public static updateViewPortSize() {
        if (!!EditorModel.editor) {
            EditorModel.viewPortSize = {
                width: EditorModel.editor.offsetWidth,
                height: EditorModel.editor.offsetHeight
            }
        } else {
            return null;
        }
    }

    public static updateDefaultViewPortImageRect() {
        if (!!EditorModel.viewPortSize && !!EditorModel.image) {
            const minMargin: IPoint = {x: ViewPointSettings.CANVAS_MIN_MARGIN_PX, y: ViewPointSettings.CANVAS_MIN_MARGIN_PX};
            const realImageRect: IRect = {x: 0, y: 0, ...ImageUtil.getSize(EditorModel.image)};
            const viewPortWithMarginRect: IRect = {x: 0, y: 0, ...EditorModel.viewPortSize};
            const viewPortWithoutMarginRect: IRect = RectUtil.expand(viewPortWithMarginRect, PointUtil.multiply(minMargin, -1));
            EditorModel.defaultRenderImageRect = RectUtil.fitInsideRectWithRatio(viewPortWithoutMarginRect, RectUtil.getRatio(realImageRect));
        } else {
            return null;
        }
    }

    public static calculateViewPortContentSize(): ISize {
        if (!!EditorModel.viewPortSize && !!EditorModel.image) {
            const defaultViewPortImageRect: IRect = EditorModel.defaultRenderImageRect;
            const scaledImageSize: ISize = SizeUtil.scale(EditorModel.defaultRenderImageRect, EditorModel.zoom);
            return {
                width: scaledImageSize.width + 2 * defaultViewPortImageRect.x,
                height: scaledImageSize.height + 2 * defaultViewPortImageRect.y
            }
        } else {
            return null;
        }
    }

    public static calculateViewPortContentImageRect(): IRect {
        if (!!EditorModel.viewPortSize && !!EditorModel.image) {
            const defaultViewPortImageRect: IRect = EditorModel.defaultRenderImageRect;
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

    public static resizeCanvas(newCanvasSize: ISize) {
        if (!!newCanvasSize && !!EditorModel.canvas) {
            EditorModel.canvas.width = newCanvasSize.width;
            EditorModel.canvas.height = newCanvasSize.height;
        }
    };

    public static resizeViewPortContent() {
        const viewPortContentSize = ViewPortActions.calculateViewPortContentSize();
        viewPortContentSize && ViewPortActions.resizeCanvas(viewPortContentSize);
    }

    public static calculateAbsoluteScrollPosition(relativePosition: IPoint): IPoint {
        const viewPortContentSize = ViewPortActions.calculateViewPortContentSize();
        const viewPortSize = EditorModel.viewPortSize;
        return {
            x: relativePosition.x * (viewPortContentSize.width - viewPortSize.width),
            y: relativePosition.y * (viewPortContentSize.height - viewPortSize.height)
        };
    }

    public static getRelativeScrollPosition(): IPoint {
        if (!!EditorModel.viewPortScrollbars) {
            const values = EditorModel.viewPortScrollbars.getValues();
            return {
                x: values.left,
                y: values.top
            }
        } else {
            return null;
        }
    }

    public static getAbsoluteScrollPosition(): IPoint {
        if (!!EditorModel.viewPortScrollbars) {
            const values = EditorModel.viewPortScrollbars.getValues();
            return {
                x: values.scrollLeft,
                y: values.scrollTop
            }
        } else {
            return null;
        }
    }

    public static setScrollPosition(position: IPoint) {
        EditorModel.viewPortScrollbars.scrollLeft(position.x);
        EditorModel.viewPortScrollbars.scrollTop(position.y);
    }

    public static translateViewPortPosition(direction: Direction) {
        if (EditorModel.isTransformationInProgress) return;

        const directionVector: IPoint = DirectionUtil.convertDirectionToVector(direction);
        const translationVector: IPoint = PointUtil.multiply(directionVector, ViewPointSettings.TRANSLATION_STEP_PX);
        const currentScrollPosition = ViewPortActions.getAbsoluteScrollPosition();
        const nextScrollPosition = PointUtil.add(currentScrollPosition, translationVector);
        ViewPortActions.setScrollPosition(nextScrollPosition);
        EditorActions.fullRender();
    }

    public static zoomIn() {
        if (EditorModel.isTransformationInProgress) return;

        const currentZoomPercentage: number = EditorModel.zoom;
        const currentRelativeScrollPosition: IPoint = ViewPortActions.getRelativeScrollPosition();
        const nextRelativeScrollPosition = currentZoomPercentage === 1 ? {x: 0.5, y: 0.5} : currentRelativeScrollPosition;
        ViewPortActions.setZoom(currentZoomPercentage + ViewPointSettings.ZOOM_STEP);
        ViewPortActions.resizeViewPortContent();
        ViewPortActions.setScrollPosition(ViewPortActions.calculateAbsoluteScrollPosition(nextRelativeScrollPosition));
        EditorActions.fullRender();
    }

    public static zoomOut() {
        if (EditorModel.isTransformationInProgress) return;

        const currentZoomPercentage: number = EditorModel.zoom;
        const currentRelativeScrollPosition: IPoint = ViewPortActions.getRelativeScrollPosition();
        ViewPortActions.setZoom(currentZoomPercentage - ViewPointSettings.ZOOM_STEP);
        ViewPortActions.resizeViewPortContent();
        ViewPortActions.setScrollPosition(ViewPortActions.calculateAbsoluteScrollPosition(currentRelativeScrollPosition));
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