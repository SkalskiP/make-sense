import {LabelType} from "../../data/LabelType";
import {EditorModel} from "../../model/EditorModel";
import {RectRenderEngine} from "../render/RectRenderEngine";
import {PointRenderEngine} from "../render/PointRenderEngine";
import {PolygonRenderEngine} from "../render/PolygonRenderEngine";
import {IRect} from "../../interfaces/IRect";
import {Settings} from "../../settings/Settings";
import {RectUtil} from "../../utils/RectUtil";
import {EditorData} from "../../data/EditorData";
import {CanvasUtil} from "../../utils/CanvasUtil";
import {ISize} from "../../interfaces/ISize";
import React from "react";
import {IPoint} from "../../interfaces/IPoint";
import {DrawUtil} from "../../utils/DrawUtil";
import {PrimaryEditorRenderEngine} from "../render/PrimaryEditorRenderEngine";
import {ContextManager} from "../context/ContextManager";
import {EditorSelector} from "../../store/selectors/EditorSelector";

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
        if (!!EditorModel.canvas) {
            DrawUtil.clearCanvas(EditorModel.canvas);
            EditorModel.primaryRenderingEngine.render(EditorActions.getEditorData());
            EditorModel.supportRenderingEngine && EditorModel.supportRenderingEngine.render(EditorActions.getEditorData());
        }
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

    public static getViewPortRect(image: HTMLImageElement): IRect | null {
        if (!!image && !!EditorModel.canvas) {
            const canvasPaddingWidth: number = Settings.CANVAS_PADDING_WIDTH_PX;
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

    public static getImageScale(image: HTMLImageElement): number | null {
        if (!image || !EditorModel.viewPortRectOnCanvas)
            return null;

        return image.width / EditorModel.viewPortRectOnCanvas.width;
    }

    public static getRenderImageRect(): IRect | null {
        if (!EditorModel.viewPortRectOnCanvas)
            return null;

        const zoomPercentage: number = EditorSelector.getCurrentZoomPercentage();
        const zoomFactor: number = zoomPercentage / 100;
        const renderImageSize: ISize = {
            width: EditorModel.viewPortRectOnCanvas.width * zoomFactor,
            height: EditorModel.viewPortRectOnCanvas.height * zoomFactor,
        };
        return {
            x: (renderImageSize.width - EditorModel.viewPortRectOnCanvas.width) / 2,
            y: (renderImageSize.height - EditorModel.viewPortRectOnCanvas.height) / 2,
            ...renderImageSize
        }
    }
    public static getRenderImageScale(image: HTMLImageElement): number | null {
        if (!image || !EditorModel.viewPortRectOnRenderImage)
            return null;

        return image.width / EditorModel.viewPortRectOnRenderImage.width;
    }



    public static getEditorData(event?: Event): EditorData {
        return {
            mousePositionOnCanvas: EditorModel.mousePositionOnCanvas,
            canvasSize: CanvasUtil.getSize(EditorModel.canvas),
            activeImageScale: EditorModel.realImageToViewPortScale,
            viewPortRectOnCanvas: EditorModel.viewPortRectOnCanvas,
            viewPortRectOnRenderImage: EditorModel.viewPortRectOnRenderImage,
            event: event,
            activeKeyCombo: ContextManager.activeCombo,
            realImageToRenderImageScale: EditorModel.realImageToRenderImageScale
        }
    }

    // =================================================================================================================
    // HELPERS
    // =================================================================================================================

    public static calculateActiveImageCharacteristics() {
        if (!!EditorModel.image) {
            EditorModel.viewPortRectOnCanvas = EditorActions.getViewPortRect(EditorModel.image);
            EditorModel.realImageToViewPortScale = EditorActions.getImageScale(EditorModel.image);
            EditorModel.viewPortRectOnRenderImage = EditorActions.getRenderImageRect();
            EditorModel.realImageToRenderImageScale = EditorActions.getRenderImageScale(EditorModel.image);
        }
    }

    public static resizeCanvas = (newCanvasSize: ISize) => {
        if (!!newCanvasSize && !!EditorModel.canvas) {
            EditorModel.canvas.width = newCanvasSize.width;
            EditorModel.canvas.height = newCanvasSize.height;
        }
    };

    public static updateMousePositionIndicator(event: React.MouseEvent<HTMLCanvasElement, MouseEvent> | MouseEvent) {

        if (!EditorModel.viewPortRectOnCanvas || !EditorModel.canvas) {
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

        const isOverImage: boolean = RectUtil.isPointInside(EditorModel.viewPortRectOnCanvas, mousePositionOnCanvas);

        if (isOverImage) {
            const scale = EditorModel.realImageToViewPortScale;
            const x: number = Math.round((mousePositionOnCanvas.x - EditorModel.viewPortRectOnCanvas.x) * scale);
            const y: number = Math.round((mousePositionOnCanvas.y - EditorModel.viewPortRectOnCanvas.y) * scale);
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