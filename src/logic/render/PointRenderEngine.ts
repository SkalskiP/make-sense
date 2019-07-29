import {BaseRenderEngine} from "./BaseRenderEngine";
import {IRect} from "../../interfaces/IRect";
import {RenderEngineConfig} from "../../settings/RenderEngineConfig";
import {IPoint} from "../../interfaces/IPoint";
import {CanvasUtil} from "../../utils/CanvasUtil";
import {store} from "../../index";
import {ImageData, LabelPoint, LabelRect} from "../../store/editor/types";
import uuidv1 from 'uuid/v1';
import {updateImageDataById} from "../../store/editor/actionCreators";
import {RectUtil} from "../../utils/RectUtil";
import _ from "lodash";
import {DrawUtil} from "../../utils/DrawUtil";
import {PointUtil} from "../../utils/PointUtil";

export class PointRenderEngine extends BaseRenderEngine {
    private config: RenderEngineConfig = new RenderEngineConfig();

    // =================================================================================================================
    // STATE
    // =================================================================================================================

    private startTransformPoint: IPoint;
    private mousePosition: IPoint;

    public constructor(canvas: HTMLCanvasElement, imageRect: IRect) {
        super(canvas, imageRect);
    }

    // =================================================================================================================
    // EVENT HANDLERS
    // =================================================================================================================

    public mouseDownHandler(event: MouseEvent): void {
        const mousePosition: IPoint = CanvasUtil.getMousePositionOnCanvasFromEvent(event, this.canvas);
        const isMouseOverImage: boolean = RectUtil.isPointInside(this.imageRectOnCanvas, mousePosition);
        if (isMouseOverImage) {
            const scale = this.getActiveImageScale();
            const point: IPoint = {
                x: (mousePosition.x - this.imageRectOnCanvas.x) * scale,
                y: (mousePosition.y - this.imageRectOnCanvas.y) * scale
            };
            this.addPointLabel(point);
        }
    }

    public mouseUpHandler(event: MouseEvent): void {

    }

    public mouseMoveHandler(event: MouseEvent): void {
        this.mousePosition = CanvasUtil.getMousePositionOnCanvasFromEvent(event, this.canvas);
    }

    // =================================================================================================================
    // RENDERING
    // =================================================================================================================

    public render(): void {
        const activeLabelId: string = store.getState().editor.activeLabelId;
        const imageData: ImageData = this.getActiveImage();

        if (imageData) {
            imageData.labelPoints.forEach((labelPoint: LabelPoint) => {
                this.renderPoint(labelPoint, labelPoint.id === activeLabelId);
            });
        }
    }

    private renderPoint(labelPoint: LabelPoint, isActive: boolean) {
        const pointOnImage: IPoint = this.calculatePointRelativeToActiveImage(labelPoint.point);
        const pointBetweenPixels = DrawUtil
            .setPointBetweenPixels(PointUtil.translate(pointOnImage, this.imageRectOnCanvas));
        const handleRect: IRect = RectUtil.getRectWithCenterAndSize(pointBetweenPixels, this.config.anchorSize);
        const handleColor: string = isActive ? this.config.activeAnchorColor : this.config.inactiveAnchorColor;
        DrawUtil.drawRectWithFill(this.canvas, handleRect, handleColor);
    }

    // =================================================================================================================
    // HELPERS
    // =================================================================================================================

    public updateImageRect(imageRect: IRect): void {
        this.imageRectOnCanvas = imageRect;
    }

    private static scalePoint(inputPoint:IPoint, scale: number): IPoint {
        return {
            x: inputPoint.x * scale,
            y: inputPoint.y * scale
        }
    }

    private calculatePointRelativeToActiveImage(point: IPoint):IPoint {
        const scale = this.getActiveImageScale();
        return PointRenderEngine.scalePoint(point, 1/scale);
    }

    private getActivePointLabel(): LabelPoint | null {
        const activeLabelId: string = store.getState().editor.activeLabelId;
        return _.find(this.getActiveImage().labelPoints, {id: activeLabelId});
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
    };
}