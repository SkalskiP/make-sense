import {LabelType} from "../../data/enums/LabelType";
import {EditorModel} from "../../staticModels/EditorModel";
import {RectRenderEngine} from "../render/RectRenderEngine";
import {PointRenderEngine} from "../render/PointRenderEngine";
import {PolygonRenderEngine} from "../render/PolygonRenderEngine";
import {IRect} from "../../interfaces/IRect";
import {RectUtil} from "../../utils/RectUtil";
import {EditorData} from "../../data/EditorData";
import {CanvasUtil} from "../../utils/CanvasUtil";
import React from "react";
import {IPoint} from "../../interfaces/IPoint";
import {DrawUtil} from "../../utils/DrawUtil";
import {PrimaryEditorRenderEngine} from "../render/PrimaryEditorRenderEngine";
import {ContextManager} from "../context/ContextManager";
import {ViewPointSettings} from "../../settings/ViewPointSettings";
import {PointUtil} from "../../utils/PointUtil";
import {ViewPortActions} from "./ViewPortActions";
import {ISize} from "../../interfaces/ISize";
import {ImageUtil} from "../../utils/ImageUtil";

export class EditorActions {

    // =================================================================================================================
    // RENDER ENGINES
    // =================================================================================================================

    public static mountSupportRenderingEngine(activeLabelType: LabelType) {
        switch (activeLabelType) {
            case LabelType.RECTANGLE:
                EditorModel.supportRenderingEngine = new RectRenderEngine(EditorModel.canvas);
                break;
            case LabelType.POINT:
                EditorModel.supportRenderingEngine = new PointRenderEngine(EditorModel.canvas);
                break;
            case LabelType.POLYGON:
                EditorModel.supportRenderingEngine = new PolygonRenderEngine(EditorModel.canvas);
                break;
            default:
                EditorModel.supportRenderingEngine = null;
                break;
        }
    };

    public static swapSupportRenderingEngine(activeLabelType: LabelType) {
        EditorActions.mountSupportRenderingEngine(activeLabelType);
    };

    public static mountRenderEngines(activeLabelType: LabelType) {
        EditorModel.primaryRenderingEngine = new PrimaryEditorRenderEngine(EditorModel.canvas);
        EditorActions.mountSupportRenderingEngine(activeLabelType);
    }

    // =================================================================================================================
    // RENDER
    // =================================================================================================================

    public static fullRender() {
        DrawUtil.clearCanvas(EditorModel.canvas);
        EditorModel.primaryRenderingEngine.render(EditorActions.getEditorData());
        EditorModel.supportRenderingEngine && EditorModel.supportRenderingEngine.render(EditorActions.getEditorData());
    }

    // =================================================================================================================
    // SETTERS
    // =================================================================================================================

    public static setLoadingStatus(status: boolean) {
        EditorModel.isLoading = status;
    }
    public static setActiveImage(image: HTMLImageElement) {
        EditorModel.image = image;
    }

    public static setTransformationInProgress(status: boolean) {
        EditorModel.isTransformationInProgress = status;
    }

    // =================================================================================================================
    // GETTERS
    // =================================================================================================================

    public static getEditorData(event?: Event): EditorData {
        return {
            mousePositionOnViewPortContent: EditorModel.mousePositionOnCanvas,
            viewPortContentSize: CanvasUtil.getSize(EditorModel.canvas),
            activeImageScale: EditorModel.imageScale,
            activeImageRectOnCanvas: EditorModel.imageRectOnCanvas,
            activeKeyCombo: ContextManager.getActiveCombo(),
            event: event,
            zoom: EditorModel.zoom,
            viewPortSize: EditorModel.viewPortSize,
            defaultRenderImageRect: EditorModel.defaultRenderImageRect,
            viewPortContentImageRect: ViewPortActions.calculateViewPortContentImageRect(),
            realImageSize: ImageUtil.getSize(EditorModel.image)
        }
    }

    // =================================================================================================================
    // CALCULATIONS
    // =================================================================================================================

    // todo: to be deleted
    public static calculateImageRect(image: HTMLImageElement): IRect | null {
        if (!!image) {
            const canvasMarginWidth: number = ViewPointSettings.CANVAS_MIN_MARGIN_PX;
            const imageRect: IRect = { x: 0, y: 0, width: image.width, height: image.height};
            const canvasRect: IRect = {
                x: canvasMarginWidth,
                y: canvasMarginWidth,
                width: EditorModel.canvas.width - 2 * canvasMarginWidth,
                height: EditorModel.canvas.height - 2 * canvasMarginWidth
            };
            return RectUtil.fitInsideRectWithRatio(canvasRect, RectUtil.getRatio(imageRect));
        }
        return null;
    };

    // todo: to be deleted
    public static calculateImageScale(image: HTMLImageElement): number | null {
        if (!image || !EditorModel.imageRectOnCanvas)
            return null;

        return image.width / EditorModel.imageRectOnCanvas.width;
    }

    // =================================================================================================================
    // HELPERS
    // =================================================================================================================

    // todo: to be deleted
    public static calculateAllCharacteristics() {
        EditorModel.imageRectOnCanvas = EditorActions.calculateImageRect(EditorModel.image);
        EditorModel.imageScale = EditorActions.calculateImageScale(EditorModel.image);
    }

    public static updateMousePositionIndicator(event: React.MouseEvent<HTMLCanvasElement, MouseEvent> | MouseEvent) {
        if (!EditorModel.image || !EditorModel.canvas) {
            EditorModel.mousePositionIndicator.style.display = "none";
            EditorModel.cursor.style.display = "none";
            return;
        }

        const mousePositionOverViewPortContent: IPoint = CanvasUtil.getMousePositionOnCanvasFromEvent(event, EditorModel.canvas);
        const viewPortContentScrollPosition: IPoint = ViewPortActions.getAbsoluteScrollPosition();
        const viewPortContentImageRect: IRect = ViewPortActions.calculateViewPortContentImageRect();
        const mousePositionOverViewPort: IPoint = PointUtil.subtract(mousePositionOverViewPortContent, viewPortContentScrollPosition);
        const isMouseOverImage: boolean = RectUtil.isPointInside(viewPortContentImageRect, mousePositionOverViewPortContent);
        const isMouseOverViewPort: boolean = RectUtil.isPointInside({x: 0, y: 0, ...EditorModel.viewPortSize}, mousePositionOverViewPort);

        if (isMouseOverViewPort) {
            EditorModel.cursor.style.left = mousePositionOverViewPort.x + "px";
            EditorModel.cursor.style.top = mousePositionOverViewPort.y + "px";
            EditorModel.cursor.style.display = "block";
        } else {
            EditorModel.cursor.style.display = "none";
        }

        if (isMouseOverImage) {
            const imageSize: ISize = ImageUtil.getSize(EditorModel.image);
            const scale: number = imageSize.width / viewPortContentImageRect.width;
            const mousePositionOverImage: IPoint = PointUtil.multiply(
                PointUtil.subtract(mousePositionOverViewPortContent, viewPortContentImageRect), scale);
            const text: string = "x: " + Math.round(mousePositionOverImage.x) + ", y: " + Math.round(mousePositionOverImage.y);

            EditorModel.mousePositionIndicator.innerHTML = text;
            EditorModel.mousePositionIndicator.style.left = (mousePositionOverViewPort.x + 15) + "px";
            EditorModel.mousePositionIndicator.style.top = (mousePositionOverViewPort.y + 15) + "px";
            EditorModel.mousePositionIndicator.style.display = "block";
        } else {
            EditorModel.mousePositionIndicator.style.display = "none";
        }
    };
}