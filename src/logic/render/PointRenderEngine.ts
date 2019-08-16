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
import {updateCustomcursorStyle} from "../../store/general/actionCreators";
import {CustomCursorStyle} from "../../data/CustomCursorStyle";
import {BaseSupportRenderEngine} from "./BaseSupportRenderEngine";
import {NumberUtil} from "../../utils/NumberUtil";
import {EditorSelector} from "../../store/selectors/EditorSelector";
import {EditorData} from "../../data/EditorData";

export class PointRenderEngine extends BaseSupportRenderEngine {
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
                const labelPointOnImage: IPoint = this.calculatePointRelativeToActiveImage(labelPoint.point, data.activeImageScale);
                const pointBetweenPixels = DrawUtil
                    .setPointBetweenPixels(PointUtil.translate(labelPointOnImage, data.activeImageRectOnCanvas));
                const handleRect: IRect = RectUtil.getRectWithCenterAndSize(pointBetweenPixels, this.config.anchorHoverSize);
                if (RectUtil.isPointInside(handleRect, data.mousePositionOnCanvas)) {
                    store.dispatch(updateActiveLabelId(labelPoint.id));
                    this.transformInProgress = true;
                    return;
                } else {
                    store.dispatch(updateActiveLabelId(null));
                    const point: IPoint = {
                        x: (data.mousePositionOnCanvas.x - data.activeImageRectOnCanvas.x) * data.activeImageScale,
                        y: (data.mousePositionOnCanvas.y - data.activeImageRectOnCanvas.y) * data.activeImageScale
                    };
                    this.addPointLabel(point);
                }
            } else if (isMouseOverImage) {
                const point: IPoint = {
                    x: (data.mousePositionOnCanvas.x - data.activeImageRectOnCanvas.x) * data.activeImageScale,
                    y: (data.mousePositionOnCanvas.y - data.activeImageRectOnCanvas.y) * data.activeImageScale
                };
                this.addPointLabel(point);
            }
        }
    }

    public mouseUpHandler(data: EditorData): void {
        if (this.transformInProgress) {
            const activeLabelPoint: LabelPoint = EditorSelector.getActivePointLabel();
            const snappedPoint: IPoint = this.snapPointToImage(data.mousePositionOnCanvas, data.activeImageRectOnCanvas);
            const scaledPoint: IPoint = PointRenderEngine.scalePoint({
                x: snappedPoint.x - data.activeImageRectOnCanvas.x,
                y: snappedPoint.y - data.activeImageRectOnCanvas.y,
            }, data.activeImageScale);

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
                if (store.getState().editor.highlightedLabelId !== labelPoint.id) {
                    store.dispatch(updateHighlightedLabelId(labelPoint.id))
                }
            } else {
                if (store.getState().editor.highlightedLabelId !== null) {
                    store.dispatch(updateHighlightedLabelId(null))
                }
            }
        }
    }

    // =================================================================================================================
    // RENDERING
    // =================================================================================================================

    public render(data: EditorData): void {
        const activeLabelId: string = store.getState().editor.activeLabelId;
        const highlightedLabelId: string = store.getState().editor.highlightedLabelId;
        const imageData: ImageData = EditorSelector.getActiveImageData();
        if (imageData) {
            imageData.labelPoints.forEach((labelPoint: LabelPoint) => {
                if (labelPoint.id === activeLabelId) {
                    if (this.transformInProgress) {
                        const pointSnapped: IPoint = this.snapPointToImage(data.mousePositionOnCanvas, data.activeImageRectOnCanvas);
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
        const pointOnImage: IPoint = this.calculatePointRelativeToActiveImage(labelPoint.point, scale);
        const pointBetweenPixels = DrawUtil
            .setPointBetweenPixels(PointUtil.translate(pointOnImage, imageRect));
        const handleRect: IRect = RectUtil.getRectWithCenterAndSize(pointBetweenPixels, this.config.anchorSize);
        const handleColor: string = isActive ? this.config.activeAnchorColor : this.config.inactiveAnchorColor;
        DrawUtil.drawRectWithFill(this.canvas, handleRect, handleColor);
    }

    private updateCursorStyle(data: EditorData) {
        if (!!this.canvas && !!data.mousePositionOnCanvas) {
            const labelPoint: LabelPoint = this.getLabelPointUnderMouse(data.mousePositionOnCanvas, data.activeImageRectOnCanvas, data.activeImageScale);
            if (!!labelPoint) {
                const pointOnImage: IPoint = this.calculatePointRelativeToActiveImage(labelPoint.point, data.activeImageScale);
                const pointBetweenPixels = DrawUtil
                    .setPointBetweenPixels(PointUtil.translate(pointOnImage, data.activeImageRectOnCanvas));
                const handleRect: IRect = RectUtil.getRectWithCenterAndSize(pointBetweenPixels, this.config.anchorHoverSize);
                if (RectUtil.isPointInside(handleRect, data.mousePositionOnCanvas)) {
                    store.dispatch(updateCustomcursorStyle(CustomCursorStyle.MOVE));
                    return;
                }
            } else if (this.transformInProgress) {
                store.dispatch(updateCustomcursorStyle(CustomCursorStyle.MOVE));
                return;
            }

            if (RectUtil.isPointInside({x: 0, y: 0, ...CanvasUtil.getSize(this.canvas)}, data.mousePositionOnCanvas)) {
                store.dispatch(updateCustomcursorStyle(CustomCursorStyle.DEFAULT));
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

    private static scalePoint(inputPoint:IPoint, scale: number): IPoint {
        return {
            x: inputPoint.x * scale,
            y: inputPoint.y * scale
        }
    }

    private calculatePointRelativeToActiveImage(point: IPoint, scale: number):IPoint {
        return PointRenderEngine.scalePoint(point, 1/scale);
    }

    private getLabelPointUnderMouse(mousePosition: IPoint, imageRect: IRect, scale: number): LabelPoint {
        const labelPoints: LabelPoint[] = EditorSelector.getActiveImageData().labelPoints;
        for (let i = 0; i < labelPoints.length; i++) {
            const pointOnImage: IPoint = this.calculatePointRelativeToActiveImage(labelPoints[i].point, scale);
            const handleRect: IRect = RectUtil.getRectWithCenterAndSize(PointUtil.translate(pointOnImage, imageRect), this.config.anchorHoverSize);
            if (RectUtil.isPointInside(handleRect, mousePosition)) {
                return labelPoints[i];
            }
        }
        return null;
    }

    private addPointLabel = (point: IPoint) => {
        const activeImageIndex = store.getState().editor.activeImageIndex;
        const activeLabelIndex = store.getState().editor.activeLabelNameIndex;
        const imageData: ImageData = store.getState().editor.imagesData[activeImageIndex];
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

    private snapPointToImage(point: IPoint, imageRect: IRect): IPoint {
        if (RectUtil.isPointInside(imageRect, point))
            return point;

        return {
            x: NumberUtil.snapValueToRange(point.x, imageRect.x, imageRect.x + imageRect.width),
            y: NumberUtil.snapValueToRange(point.y, imageRect.y, imageRect.y + imageRect.height)
        }
    }
}