import {IRect} from "../../interfaces/IRect";
import {RenderEngineConfig} from "../../settings/RenderEngineConfig";
import {IPoint} from "../../interfaces/IPoint";
import {CanvasUtil} from "../../utils/CanvasUtil";
import {store} from "../../index";
import {ImageData, LabelPoint} from "../../store/editor/types";
import uuidv1 from 'uuid/v1';
import {
    updateActiveLabelId,
    updateFirstLabelCreatedFlag,
    updateHighlightedLabelId,
    updateImageDataById
} from "../../store/editor/actionCreators";
import {RectUtil} from "../../utils/RectUtil";
import {DrawUtil} from "../../utils/DrawUtil";
import {updateCustomCursorStyle} from "../../store/general/actionCreators";
import {CustomCursorStyle} from "../../data/CustomCursorStyle";
import {EditorSelector} from "../../store/selectors/EditorSelector";
import {EditorData} from "../../data/EditorData";
import {BaseRenderEngine} from "./BaseRenderEngine";
import {RenderEngineUtil} from "../../utils/RenderEngineUtil";

export class PointRenderEngine extends BaseRenderEngine {
    private config: RenderEngineConfig = new RenderEngineConfig();

    // =================================================================================================================
    // STATE
    // =================================================================================================================

    private transformInProgress: boolean = false;

    public constructor(canvas: HTMLCanvasElement) {
        super(canvas);
    }

    // =================================================================================================================
    // EVENT HANDLERS
    // =================================================================================================================

    public mouseDownHandler(data: EditorData): void {
        const isMouseOverImage: boolean = RenderEngineUtil.isMouseOverImage(data);
        const isMouseOverCanvas: boolean = RenderEngineUtil.isMouseOverCanvas(data);

        if (isMouseOverCanvas) {
            const labelPoint: LabelPoint = this.getLabelPointUnderMouse(data.mousePositionOnCanvas, data);
            if (!!labelPoint) {
                const pointOnCanvas: IPoint = RenderEngineUtil.transferPointFromImageToCanvas(labelPoint.point, data);
                const pointBetweenPixels = RenderEngineUtil.setPointBetweenPixels(pointOnCanvas);
                const handleRect: IRect = RectUtil.getRectWithCenterAndSize(pointBetweenPixels, this.config.anchorHoverSize);
                if (RectUtil.isPointInside(handleRect, data.mousePositionOnCanvas)) {
                    store.dispatch(updateActiveLabelId(labelPoint.id));
                    this.transformInProgress = true;
                    return;
                } else {
                    store.dispatch(updateActiveLabelId(null));
                    const pointOnImage: IPoint = RenderEngineUtil.transferPointFromCanvasToImage(data.mousePositionOnCanvas, data);
                    this.addPointLabel(pointOnImage);
                }
            } else if (isMouseOverImage) {
                const pointOnImage: IPoint = RenderEngineUtil.transferPointFromCanvasToImage(data.mousePositionOnCanvas, data);
                this.addPointLabel(pointOnImage);
            }
        }
    }

    public mouseUpHandler(data: EditorData): void {
        if (this.isInProgress()) {
            const activeLabelPoint: LabelPoint = EditorSelector.getActivePointLabel();
            const pointSnapped: IPoint = RectUtil.snapPointToRect(data.mousePositionOnCanvas, data.activeImageRectOnCanvas);
            const pointOnImage: IPoint = RenderEngineUtil.transferPointFromCanvasToImage(pointSnapped, data);
            const imageData = EditorSelector.getActiveImageData();

            imageData.labelPoints = imageData.labelPoints.map((labelPoint: LabelPoint) => {
                if (labelPoint.id === activeLabelPoint.id) {
                    return {
                        ...labelPoint,
                        point: pointOnImage
                    };
                }
                return labelPoint;
            });
            store.dispatch(updateImageDataById(imageData.id, imageData));
        }
        this.transformInProgress = false;
    }

    public mouseMoveHandler(data: EditorData): void {
        const isOverImage: boolean = RenderEngineUtil.isMouseOverImage(data);
        if (isOverImage) {
            const labelPoint: LabelPoint = this.getLabelPointUnderMouse(data.mousePositionOnCanvas, data);
            if (!!labelPoint) {
                if (EditorSelector.getHighlightedLabelId() !== labelPoint.id) {
                    store.dispatch(updateHighlightedLabelId(labelPoint.id))
                }
            } else {
                if (EditorSelector.getHighlightedLabelId() !== null) {
                    store.dispatch(updateHighlightedLabelId(null))
                }
            }
        }
    }

    // =================================================================================================================
    // RENDERING
    // =================================================================================================================

    public render(data: EditorData): void {
        const activeLabelId: string = EditorSelector.getActiveLabelId();
        const highlightedLabelId: string = EditorSelector.getHighlightedLabelId();
        const imageData: ImageData = EditorSelector.getActiveImageData();
        if (imageData) {
            imageData.labelPoints.forEach((labelPoint: LabelPoint) => {
                if (labelPoint.id === activeLabelId) {
                    if (this.isInProgress()) {
                        const pointSnapped: IPoint = RectUtil.snapPointToRect(data.mousePositionOnCanvas, data.activeImageRectOnCanvas);
                        const pointBetweenPixels: IPoint = RenderEngineUtil.setPointBetweenPixels(pointSnapped);
                        const handleRect: IRect = RectUtil.getRectWithCenterAndSize(pointBetweenPixels, this.config.anchorSize);
                        DrawUtil.drawRectWithFill(this.canvas, handleRect, this.config.activeAnchorColor);
                    } else {
                        this.renderPoint(labelPoint, true, data);
                    }
                } else {
                    this.renderPoint(labelPoint, labelPoint.id === activeLabelId || labelPoint.id === highlightedLabelId, data);
                }
            });
        }
        this.updateCursorStyle(data);
    }

    private renderPoint(labelPoint: LabelPoint, isActive: boolean, data: EditorData) {
        const pointOnImage: IPoint = RenderEngineUtil.transferPointFromImageToCanvas(labelPoint.point, data);
        const pointBetweenPixels = RenderEngineUtil.setPointBetweenPixels(pointOnImage);
        const handleRect: IRect = RectUtil.getRectWithCenterAndSize(pointBetweenPixels, this.config.anchorSize);
        const handleColor: string = isActive ? this.config.activeAnchorColor : this.config.inactiveAnchorColor;
        DrawUtil.drawRectWithFill(this.canvas, handleRect, handleColor);
    }

    private updateCursorStyle(data: EditorData) {
        if (!!this.canvas && !!data.mousePositionOnCanvas) {
            const labelPoint: LabelPoint = this.getLabelPointUnderMouse(data.mousePositionOnCanvas, data);
            if (!!labelPoint) {
                const pointOnCanvas: IPoint = RenderEngineUtil.transferPointFromImageToCanvas(labelPoint.point, data);
                const pointBetweenPixels = RenderEngineUtil.setPointBetweenPixels(pointOnCanvas);
                const handleRect: IRect = RectUtil.getRectWithCenterAndSize(pointBetweenPixels, this.config.anchorHoverSize);
                if (RectUtil.isPointInside(handleRect, data.mousePositionOnCanvas)) {
                    store.dispatch(updateCustomCursorStyle(CustomCursorStyle.MOVE));
                    return;
                }
            } else if (this.isInProgress()) {
                store.dispatch(updateCustomCursorStyle(CustomCursorStyle.MOVE));
                return;
            }

            if (RectUtil.isPointInside({x: 0, y: 0, ...CanvasUtil.getSize(this.canvas)}, data.mousePositionOnCanvas)) {
                RenderEngineUtil.wrapDefaultCursorStyleInCancel(data);
                this.canvas.style.cursor = "none";
            } else {
                this.canvas.style.cursor = "default";
            }
        }
    }

    // =================================================================================================================
    // HELPERS
    // =================================================================================================================

    public isInProgress(): boolean {
        return this.transformInProgress;
    }

    private getLabelPointUnderMouse(mousePosition: IPoint, data: EditorData): LabelPoint {
        const labelPoints: LabelPoint[] = EditorSelector.getActiveImageData().labelPoints;
        for (let i = 0; i < labelPoints.length; i++) {
            const pointOnCanvas: IPoint = RenderEngineUtil.transferPointFromImageToCanvas(labelPoints[i].point, data);
            const handleRect: IRect = RectUtil.getRectWithCenterAndSize(pointOnCanvas, this.config.anchorHoverSize);
            if (RectUtil.isPointInside(handleRect, mousePosition)) {
                return labelPoints[i];
            }
        }
        return null;
    }

    private addPointLabel = (point: IPoint) => {
        const activeLabelIndex = EditorSelector.getActiveLabelNameIndex();
        const imageData: ImageData = EditorSelector.getActiveImageData();
        const labelPoint: LabelPoint = {
            id: uuidv1(),
            labelIndex: activeLabelIndex,
            point
        };
        imageData.labelPoints.push(labelPoint);
        store.dispatch(updateImageDataById(imageData.id, imageData));
        store.dispatch(updateFirstLabelCreatedFlag(true));
        store.dispatch(updateActiveLabelId(labelPoint.id));
    };
}