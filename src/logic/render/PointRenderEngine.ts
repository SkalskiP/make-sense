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
import {BaseSuportRenderEngine} from "./BaseSuportRenderEngine";
import {NumberUtil} from "../../utils/NumberUtil";
import {EditorSelector} from "../../store/selectors/EditorSelector";
import {EditorData} from "../../data/EditorData";

export class PointRenderEngine extends BaseSuportRenderEngine {
    private config: RenderEngineConfig = new RenderEngineConfig();

    // =================================================================================================================
    // STATE
    // =================================================================================================================

    private transformInProgress: boolean;
    private mousePosition: IPoint;
    private scale: number;

    public constructor(canvas: HTMLCanvasElement, imageRect: IRect) {
        super(canvas, imageRect);
    }

    // =================================================================================================================
    // EVENT HANDLERS
    // =================================================================================================================

    public update(data: EditorData): void {

    }

    public mouseDownHandler(event: MouseEvent): void {
        const mousePosition: IPoint = CanvasUtil.getMousePositionOnCanvasFromEvent(event, this.canvas);
        const isMouseOverImage: boolean = RectUtil.isPointInside(this.imageRectOnCanvas, mousePosition);
        const isMouseOverCanvas: boolean = RectUtil.isPointInside({x: 0, y: 0, ...CanvasUtil.getSize(this.canvas)},
            this.mousePosition);

        if (isMouseOverCanvas) {
            const labelPoint: LabelPoint = this.getLabelPointUnderMouse();
            if (!!labelPoint) {
                const pointOnImage: IPoint = this.calculatePointRelativeToActiveImage(labelPoint.point);
                const pointBetweenPixels = DrawUtil
                    .setPointBetweenPixels(PointUtil.translate(pointOnImage, this.imageRectOnCanvas));
                const handleRect: IRect = RectUtil.getRectWithCenterAndSize(pointBetweenPixels, this.config.anchorHoverSize);
                if (RectUtil.isPointInside(handleRect, this.mousePosition)) {
                    store.dispatch(updateActiveLabelId(labelPoint.id));
                    this.transformInProgress = true;
                    return;
                } else {
                    store.dispatch(updateActiveLabelId(null));
                    const scale = this.scale;
                    const point: IPoint = {
                        x: (mousePosition.x - this.imageRectOnCanvas.x) * scale,
                        y: (mousePosition.y - this.imageRectOnCanvas.y) * scale
                    };
                    this.addPointLabel(point);
                }
            } else if (isMouseOverImage) {
                const scale = this.scale;
                const point: IPoint = {
                    x: (mousePosition.x - this.imageRectOnCanvas.x) * scale,
                    y: (mousePosition.y - this.imageRectOnCanvas.y) * scale
                };
                this.addPointLabel(point);
            }
        }
    }

    public mouseUpHandler(event: MouseEvent): void {
        const mousePosition: IPoint = CanvasUtil.getMousePositionOnCanvasFromEvent(event, this.canvas);

        if (this.transformInProgress) {
            const scale = this.scale;
            const activeLabelPoint: LabelPoint = EditorSelector.getActivePointLabel();
            const snappedPoint: IPoint = this.snapPointToImage(mousePosition);
            const scaledPoint: IPoint = PointRenderEngine.scalePoint({
                x: snappedPoint.x - this.imageRectOnCanvas.x,
                y: snappedPoint.y - this.imageRectOnCanvas.y,
            }, scale);

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

    public mouseMoveHandler(event: MouseEvent): void {
        this.mousePosition = CanvasUtil.getMousePositionOnCanvasFromEvent(event, this.canvas);
        const isOverImage: boolean = RectUtil.isPointInside(this.imageRectOnCanvas, this.mousePosition);
        if (isOverImage) {
            const labelPoint: LabelPoint = this.getLabelPointUnderMouse();
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

    public render(): void {
        const activeLabelId: string = store.getState().editor.activeLabelId;
        const highlightedLabelId: string = store.getState().editor.highlightedLabelId;
        const imageData: ImageData = EditorSelector.getActiveImageData();
        if (imageData) {
            imageData.labelPoints.forEach((labelPoint: LabelPoint) => {
                if (labelPoint.id === activeLabelId) {
                    if (this.transformInProgress) {
                        const pointSnapped: IPoint = this.snapPointToImage(this.mousePosition);
                        const pointBetweenPixels: IPoint = DrawUtil.setPointBetweenPixels(pointSnapped);
                        const handleRect: IRect = RectUtil.getRectWithCenterAndSize(pointBetweenPixels, this.config.anchorSize);
                        DrawUtil.drawRectWithFill(this.canvas, handleRect, this.config.activeAnchorColor);
                    } else {
                        this.renderPoint(labelPoint, true);
                    }
                } else {
                    this.renderPoint(labelPoint, labelPoint.id === activeLabelId || labelPoint.id === highlightedLabelId);
                }
            });
        }
        this.updateCursorStyle();
    }

    private renderPoint(labelPoint: LabelPoint, isActive: boolean) {
        const pointOnImage: IPoint = this.calculatePointRelativeToActiveImage(labelPoint.point);
        const pointBetweenPixels = DrawUtil
            .setPointBetweenPixels(PointUtil.translate(pointOnImage, this.imageRectOnCanvas));
        const handleRect: IRect = RectUtil.getRectWithCenterAndSize(pointBetweenPixels, this.config.anchorSize);
        const handleColor: string = isActive ? this.config.activeAnchorColor : this.config.inactiveAnchorColor;
        DrawUtil.drawRectWithFill(this.canvas, handleRect, handleColor);
    }

    private updateCursorStyle() {
        if (!!this.canvas && !!this.mousePosition) {
            const labelPoint: LabelPoint = this.getLabelPointUnderMouse();
            if (!!labelPoint) {
                const pointOnImage: IPoint = this.calculatePointRelativeToActiveImage(labelPoint.point);
                const pointBetweenPixels = DrawUtil
                    .setPointBetweenPixels(PointUtil.translate(pointOnImage, this.imageRectOnCanvas));
                const handleRect: IRect = RectUtil.getRectWithCenterAndSize(pointBetweenPixels, this.config.anchorHoverSize);
                if (RectUtil.isPointInside(handleRect, this.mousePosition)) {
                    store.dispatch(updateCustomcursorStyle(CustomCursorStyle.MOVE));
                    return;
                }
            } else if (this.transformInProgress) {
                store.dispatch(updateCustomcursorStyle(CustomCursorStyle.MOVE));
                return;
            }

            if (RectUtil.isPointInside({x: 0, y: 0, ...CanvasUtil.getSize(this.canvas)}, this.mousePosition)) {
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

    public updateImageRect(imageRect: IRect): void {
        this.imageRectOnCanvas = imageRect;
        this.scale = this.getActiveImageScale();
    }

    public isInProgress(): boolean {
        return !!this.transformInProgress;
    }

    private static scalePoint(inputPoint:IPoint, scale: number): IPoint {
        return {
            x: inputPoint.x * scale,
            y: inputPoint.y * scale
        }
    }

    private calculatePointRelativeToActiveImage(point: IPoint):IPoint {
        const scale = this.scale;
        return PointRenderEngine.scalePoint(point, 1/scale);
    }

    private getLabelPointUnderMouse(): LabelPoint {
        const labelPoints: LabelPoint[] = EditorSelector.getActiveImageData().labelPoints;
        for (let i = 0; i < labelPoints.length; i++) {
            const pointOnImage: IPoint = this.calculatePointRelativeToActiveImage(labelPoints[i].point);
            const handleRect: IRect = RectUtil.getRectWithCenterAndSize(PointUtil.translate(pointOnImage, this.imageRectOnCanvas), this.config.anchorHoverSize);
            if (RectUtil.isPointInside(handleRect, this.mousePosition)) {
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

    private snapPointToImage(point: IPoint): IPoint {
        if (RectUtil.isPointInside(this.imageRectOnCanvas, point))
            return point;

        return {
            x: NumberUtil.snapValueToRange(point.x, this.imageRectOnCanvas.x, this.imageRectOnCanvas.x + this.imageRectOnCanvas.width),
            y: NumberUtil.snapValueToRange(point.y, this.imageRectOnCanvas.y, this.imageRectOnCanvas.y + this.imageRectOnCanvas.height)
        }
    }
}