import {EditorModel} from '../../staticModels/EditorModel';
import {NumberUtil} from '../../utils/NumberUtil';
import {ViewPointSettings} from '../../settings/ViewPointSettings';
import {ISize} from '../../interfaces/ISize';
import {IRect} from '../../interfaces/IRect';
import {ImageUtil} from '../../utils/ImageUtil';
import {RectUtil} from '../../utils/RectUtil';
import {IPoint} from '../../interfaces/IPoint';
import {PointUtil} from '../../utils/PointUtil';
import {SizeUtil} from '../../utils/SizeUtil';
import {EditorActions} from './EditorActions';
import {Direction} from '../../data/enums/Direction';
import {DirectionUtil} from '../../utils/DirectionUtil';
import {GeneralSelector} from '../../store/selectors/GeneralSelector';
import {store} from '../../index';
import {updateZoom} from '../../store/general/actionCreators';

export class ViewPortActions {
    public static updateViewPortSize() {
        if (!!EditorModel.editor) {
            EditorModel.viewPortSize = {
                width: EditorModel.editor.offsetWidth,
                height: EditorModel.editor.offsetHeight
            }
        }
    }

    public static updateDefaultViewPortImageRect() {
        if (!!EditorModel.viewPortSize && !!EditorModel.image) {
            const minMargin: IPoint = {
                x: ViewPointSettings.CANVAS_MIN_MARGIN_PX,
                y: ViewPointSettings.CANVAS_MIN_MARGIN_PX
            };
            const realImageRect: IRect = {x: 0, y: 0, ...ImageUtil.getSize(EditorModel.image)};
            const viewPortWithMarginRect: IRect = {x: 0, y: 0, ...EditorModel.viewPortSize};
            const viewPortWithoutMarginRect: IRect = RectUtil
                .expand(viewPortWithMarginRect, PointUtil.multiply(minMargin, -1));
            EditorModel.defaultRenderImageRect = RectUtil
                .fitInsideRectWithRatio(viewPortWithoutMarginRect, RectUtil.getRatio(realImageRect));
        }
    }

    public static calculateViewPortContentSize(): ISize {
        if (!!EditorModel.viewPortSize && !!EditorModel.image) {
            const defaultViewPortImageRect: IRect = EditorModel.defaultRenderImageRect;
            const scaledImageSize: ISize = SizeUtil
                .scale(EditorModel.defaultRenderImageRect, GeneralSelector.getZoom());
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
        if (viewPortContentSize) {
            ViewPortActions.resizeCanvas(viewPortContentSize);
        }
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
        if (EditorModel.viewPortActionsDisabled || GeneralSelector.getZoom() === ViewPointSettings.MIN_ZOOM) return;

        const directionVector: IPoint = DirectionUtil.convertDirectionToVector(direction);
        const translationVector: IPoint = PointUtil.multiply(directionVector, ViewPointSettings.TRANSLATION_STEP_PX);
        const currentScrollPosition = ViewPortActions.getAbsoluteScrollPosition();
        const nextScrollPosition = PointUtil.add(currentScrollPosition, translationVector);
        ViewPortActions.setScrollPosition(nextScrollPosition);
        EditorModel.mousePositionOnViewPortContent = PointUtil
            .add(EditorModel.mousePositionOnViewPortContent, translationVector);
        EditorActions.fullRender();
    }

    public static zoomIn() {
        if (EditorModel.viewPortActionsDisabled) return;

        const currentZoom: number = GeneralSelector.getZoom();
        const currentRelativeScrollPosition: IPoint = ViewPortActions.getRelativeScrollPosition();
        const nextRelativeScrollPosition = currentZoom === 1 ? {x: 0.5, y: 0.5} : currentRelativeScrollPosition;
        ViewPortActions.setZoom(currentZoom + ViewPointSettings.ZOOM_STEP);
        ViewPortActions.resizeViewPortContent();
        ViewPortActions.setScrollPosition(ViewPortActions.calculateAbsoluteScrollPosition(nextRelativeScrollPosition));
        EditorActions.fullRender();
    }

    public static zoomOut() {
        if (EditorModel.viewPortActionsDisabled) return;

        const currentZoom: number = GeneralSelector.getZoom();
        const currentRelativeScrollPosition: IPoint = ViewPortActions.getRelativeScrollPosition();
        ViewPortActions.setZoom(currentZoom - ViewPointSettings.ZOOM_STEP);
        ViewPortActions.resizeViewPortContent();
        ViewPortActions.setScrollPosition(ViewPortActions
            .calculateAbsoluteScrollPosition(currentRelativeScrollPosition));
        EditorActions.fullRender();
    }

    public static setDefaultZoom() {
        const currentRelativeScrollPosition: IPoint = ViewPortActions.getRelativeScrollPosition();
        ViewPortActions.setZoom(ViewPointSettings.MIN_ZOOM);
        ViewPortActions.resizeViewPortContent();
        ViewPortActions.setScrollPosition(ViewPortActions
            .calculateAbsoluteScrollPosition(currentRelativeScrollPosition));
        EditorActions.fullRender();
    }

    public static setOneForOneZoom() {
        const currentZoom: number = GeneralSelector.getZoom();
        const currentRelativeScrollPosition: IPoint = ViewPortActions.getRelativeScrollPosition();
        const nextRelativeScrollPosition = currentZoom === 1 ? {x: 0.5, y: 0.5} : currentRelativeScrollPosition;
        const nextZoom: number = EditorModel.image.width / EditorModel.defaultRenderImageRect.width
        ViewPortActions.setZoom(nextZoom);
        ViewPortActions.resizeViewPortContent();
        ViewPortActions.setScrollPosition(ViewPortActions.calculateAbsoluteScrollPosition(nextRelativeScrollPosition));
        EditorActions.fullRender();
    }

    public static setZoom(value: number) {
        const currentZoom: number = GeneralSelector.getZoom();
        const isNewValueValid: boolean = NumberUtil.isValueInRange(
            value, ViewPointSettings.MIN_ZOOM, ViewPointSettings.MAX_ZOOM);
        if (isNewValueValid && value !== currentZoom) {
            store.dispatch(updateZoom(value));
        }
    }
}
