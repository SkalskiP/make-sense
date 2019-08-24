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
import {PointUtil} from "../../utils/PointUtil";
import {updateCustomCursorStyle} from "../../store/general/actionCreators";
import {CustomCursorStyle} from "../../data/CustomCursorStyle";
import {EditorSelector} from "../../store/selectors/EditorSelector";
import {EditorData} from "../../data/EditorData";
import {BaseRenderEngine} from "./BaseRenderEngine";

export class PointRenderEngine extends BaseRenderEngine {
    private config: RenderEngineConfig = new RenderEngineConfig();

    // =================================================================================================================
    // STATE
    // =================================================================================================================

    private transformInProgress: boolean;

    public constructor(canvas: HTMLCanvasElement) {
        super(canvas);
    }

    // =================================================================================================================
    // EVENT HANDLERS
    // =================================================================================================================

    public mouseDownHandler(data: EditorData): void {
        const isMouseOverImage: boolean = RectUtil.isPointInside(data.activeImageRectOnCanvas,
            data.mousePositionOnCanvas);
        const isMouseOverCanvas: boolean = RectUtil.isPointInside({x: 0, y: 0, ...data.canvasSize},
            data.mousePositionOnCanvas);

        if (isMouseOverCanvas) {
            const labelPoint: LabelPoint = this.getLabelPointUnderMouse(data.mousePositionOnCanvas, data.activeImageRectOnCanvas, data.activeImageScale);
            if (!!labelPoint) {
                const labelPointOnImage: IPoint = PointUtil.multiply(labelPoint.point, 1/data.activeImageScale);
                const pointBetweenPixels = DrawUtil
                    .setPointBetweenPixels(PointUtil.add(labelPointOnImage, data.activeImageRectOnCanvas));
                const handleRect: IRect = RectUtil.getRectWithCenterAndSize(pointBetweenPixels, this.config.anchorHoverSize);
                if (RectUtil.isPointInside(handleRect, data.mousePositionOnCanvas)) {
                    store.dispatch(updateActiveLabelId(labelPoint.id));
                    this.transformInProgress = true;
                    return;
                } else {
                    store.dispatch(updateActiveLabelId(null));
                    const point: IPoint = PointUtil.multiply(PointUtil.subtract(
                        data.mousePositionOnCanvas, data.activeImageRectOnCanvas), data.activeImageScale);
                    this.addPointLabel(point);
                }
            } else if (isMouseOverImage) {
                const point: IPoint = PointUtil.multiply(PointUtil.subtract(
                    data.mousePositionOnCanvas, data.activeImageRectOnCanvas), data.activeImageScale);
                this.addPointLabel(point);
            }
        }
    }

    public mouseUpHandler(data: EditorData): void {
        if (this.transformInProgress) {
            const activeLabelPoint: LabelPoint = EditorSelector.getActivePointLabel();
            const snappedPoint: IPoint = RectUtil.snapPointToRect(data.mousePositionOnCanvas, data.activeImageRectOnCanvas);
            const scaledPoint: IPoint = PointUtil.multiply(PointUtil.subtract(snappedPoint, data.activeImageRectOnCanvas),
                data.activeImageScale);

            const imageData = EditorSelector.getActiveImageData();
            imageData.labelPoints = imageData.labelPoints.map((labelPoint: LabelPoint) => {
                if (labelPoint.id === activeLabelPoint.id) {
                    return {
                        ...labelPoint,
                        point: scaledPoint
                    };
                }
                return labelPoint;
            });
            store.dispatch(updateImageDataById(imageData.id, imageData));
        }
        this.transformInProgress = false;
    }

    public mouseMoveHandler(data: EditorData): void {
        const isOverImage: boolean = RectUtil.isPointInside(data.activeImageRectOnCanvas, data.mousePositionOnCanvas);
        if (isOverImage) {
            const labelPoint: LabelPoint = this.getLabelPointUnderMouse(data.mousePositionOnCanvas, data.activeImageRectOnCanvas, data.activeImageScale);
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
                    if (this.transformInProgress) {
                        const pointSnapped: IPoint = RectUtil.snapPointToRect(data.mousePositionOnCanvas, data.activeImageRectOnCanvas);
                        const pointBetweenPixels: IPoint = DrawUtil.setPointBetweenPixels(pointSnapped);
                        const handleRect: IRect = RectUtil.getRectWithCenterAndSize(pointBetweenPixels, this.config.anchorSize);
                        DrawUtil.drawRectWithFill(this.canvas, handleRect, this.config.activeAnchorColor);
                    } else {
                        this.renderPoint(labelPoint, true, data.activeImageRectOnCanvas, data.activeImageScale);
                    }
                } else {
                    this.renderPoint(labelPoint, labelPoint.id === activeLabelId || labelPoint.id === highlightedLabelId, data.activeImageRectOnCanvas, data.activeImageScale);
                }
            });
        }
        this.updateCursorStyle(data);
    }

    private renderPoint(labelPoint: LabelPoint, isActive: boolean, imageRect: IRect, scale: number) {
        const pointOnImage: IPoint = PointUtil.multiply(labelPoint.point, 1/scale);
        const pointBetweenPixels = DrawUtil
            .setPointBetweenPixels(PointUtil.add(pointOnImage, imageRect));
        const handleRect: IRect = RectUtil.getRectWithCenterAndSize(pointBetweenPixels, this.config.anchorSize);
        const handleColor: string = isActive ? this.config.activeAnchorColor : this.config.inactiveAnchorColor;
        DrawUtil.drawRectWithFill(this.canvas, handleRect, handleColor);
    }

    private updateCursorStyle(data: EditorData) {
        if (!!this.canvas && !!data.mousePositionOnCanvas) {
            const labelPoint: LabelPoint = this.getLabelPointUnderMouse(data.mousePositionOnCanvas, data.activeImageRectOnCanvas, data.activeImageScale);
            if (!!labelPoint) {
                const pointOnImage: IPoint = PointUtil.multiply(labelPoint.point, 1/data.activeImageScale);
                const pointBetweenPixels = DrawUtil
                    .setPointBetweenPixels(PointUtil.add(pointOnImage, data.activeImageRectOnCanvas));
                const handleRect: IRect = RectUtil.getRectWithCenterAndSize(pointBetweenPixels, this.config.anchorHoverSize);
                if (RectUtil.isPointInside(handleRect, data.mousePositionOnCanvas)) {
                    store.dispatch(updateCustomCursorStyle(CustomCursorStyle.MOVE));
                    return;
                }
            } else if (this.transformInProgress) {
                store.dispatch(updateCustomCursorStyle(CustomCursorStyle.MOVE));
                return;
            }

            if (RectUtil.isPointInside({x: 0, y: 0, ...CanvasUtil.getSize(this.canvas)}, data.mousePositionOnCanvas)) {
                store.dispatch(updateCustomCursorStyle(CustomCursorStyle.DEFAULT));
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
        return !!this.transformInProgress;
    }

    private getLabelPointUnderMouse(mousePosition: IPoint, imageRect: IRect, scale: number): LabelPoint {
        const labelPoints: LabelPoint[] = EditorSelector.getActiveImageData().labelPoints;
        for (let i = 0; i < labelPoints.length; i++) {
            const pointOnImage: IPoint = PointUtil.multiply(labelPoints[i].point, 1/scale);
            const handleRect: IRect = RectUtil.getRectWithCenterAndSize(PointUtil.add(pointOnImage, imageRect), this.config.anchorHoverSize);
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