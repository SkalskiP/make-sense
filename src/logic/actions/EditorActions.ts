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
            defaultRenderImageRect: EditorModel.defaultRenderImageRect
        }
    }

    // =================================================================================================================
    // CALCULATIONS
    // =================================================================================================================

    // todo: to be deleted
    public static calculateImageRect(image: HTMLImageElement): IRect | null {
        if (!!image) {
            const canvasPaddingWidth: number = ViewPointSettings.CANVAS_MIN_MARGIN_PX;
            const imageRect: IRect = { x: 0, y: 0, width: image.width, height: image.height};
            const canvasRect: IRect = {
                x: canvasPaddingWidth,
                y: canvasPaddingWidth,
                width: EditorModel.canvas.width - 2 * canvasPaddingWidth,
                height: EditorModel.canvas.height - 2 * canvasPaddingWidth
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

        if (!EditorModel.imageRectOnCanvas || !EditorModel.canvas) {
            EditorModel.mousePositionIndicator.style.display = "none";
            EditorModel.cursor.style.display = "none";
            return;
        }

        const mousePositionOnCanvas: IPoint = CanvasUtil.getMousePositionOnCanvasFromEvent(event, EditorModel.canvas);
        const canvasRect: IRect = {x: 0, y: 0, ...CanvasUtil.getSize(EditorModel.canvas)};
        const isOverCanvas: boolean = RectUtil.isPointInside(canvasRect, mousePositionOnCanvas);

        if (!isOverCanvas) {
            EditorModel.mousePositionIndicator.style.display = "none";
            EditorModel.cursor.style.display = "none";
            return;
        }

        const isOverImage: boolean = RectUtil.isPointInside(EditorModel.imageRectOnCanvas, mousePositionOnCanvas);

        if (isOverImage) {
            const scale = EditorModel.imageScale;
            const x: number = Math.round((mousePositionOnCanvas.x - EditorModel.imageRectOnCanvas.x) * scale);
            const y: number = Math.round((mousePositionOnCanvas.y - EditorModel.imageRectOnCanvas.y) * scale);
            const text: string = "x: " + x + ", y: " + y;

            EditorModel.mousePositionIndicator.innerHTML = text;
            EditorModel.mousePositionIndicator.style.left = (mousePositionOnCanvas.x + 15) + "px";
            EditorModel.mousePositionIndicator.style.top = (mousePositionOnCanvas.y + 15) + "px";
            EditorModel.mousePositionIndicator.style.display = "block";
        } else {
            EditorModel.mousePositionIndicator.style.display = "none";
        }

        EditorModel.cursor.style.left = mousePositionOnCanvas.x + "px";
        EditorModel.cursor.style.top = mousePositionOnCanvas.y + "px";
        EditorModel.cursor.style.display = "block";
    };
}