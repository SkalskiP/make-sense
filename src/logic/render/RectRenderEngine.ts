import {IPoint} from "../../interfaces/IPoint";
import {IRect} from "../../interfaces/IRect";
import {RectUtil} from "../../utils/RectUtil";
import {DrawUtil} from "../../utils/DrawUtil";
import {BaseRenderEngine} from "./BaseRenderEngine";
import {store} from "../..";
import {ImageData, LabelRect} from "../../store/editor/types";
import uuidv1 from 'uuid/v1';
import {updateActiveLabelId, updateFirstLabelCreatedFlag, updateImageDataById} from "../../store/editor/actionCreators";
import {PointUtil} from "../../utils/PointUtil";
import {RectAnchor} from "../../data/RectAnchor";
import {AnchorTypeToCursorStyleMapping} from "../../data/AnchorTypeToCursorStyleMapping";
import _ from "lodash";
import {RenderEngineConfig} from "../../settings/RenderEngineConfig";
import {CanvasUtil} from "../../utils/CanvasUtil";

export class RectRenderEngine extends BaseRenderEngine {
    private config: RenderEngineConfig = new RenderEngineConfig();

    // =================================================================================================================
    // STATE
    // =================================================================================================================

    private startCreateRectPoint: IPoint;
    private startResizeRectAnchor: RectAnchor;
    private mousePosition: IPoint;

    public constructor(canvas: HTMLCanvasElement, imageRect: IRect) {
        super(canvas, imageRect);
    }

    // =================================================================================================================
    // EVENT HANDLERS
    // =================================================================================================================

    public mouseDownHandler = (event: MouseEvent) => {
        const mousePosition: IPoint = CanvasUtil.getMousePositionOnCanvasFromEvent(event, this.canvas);
        const isMouseOverImage: boolean = RectUtil.isPointInside(this.imageRectOnCanvas, mousePosition);
        if (isMouseOverImage) {
            const activeLabelRect: LabelRect = this.getActiveRectLabel();
            if (!!activeLabelRect) {
                const rect: IRect = this.calculateRectRelativeToActiveImage(activeLabelRect.rect);
                const activatedAnchor: RectAnchor = this.getRectAnchorUnderMouse(rect);
                !!activatedAnchor ? this.startRectResize(activatedAnchor) : this.startRectCreation(mousePosition);
            } else {
                this.startRectCreation(mousePosition);
            }
        }
    };

    public mouseUpHandler = (event: MouseEvent) => {
        if (!!this.imageRectOnCanvas) {
            const mousePosition: IPoint = CanvasUtil.getMousePositionOnCanvasFromEvent(event, this.canvas);
            const isOverImage: boolean = RectUtil.isPointInside(this.imageRectOnCanvas, mousePosition);

            if (isOverImage && !!this.startCreateRectPoint && !PointUtil.equals(this.startCreateRectPoint, this.mousePosition)) {
                const scale = this.getActiveImageScale();

                const minX: number = Math.min(this.startCreateRectPoint.x, this.mousePosition.x);
                const minY: number = Math.min(this.startCreateRectPoint.y, this.mousePosition.y);
                const maxX: number = Math.max(this.startCreateRectPoint.x, this.mousePosition.x);
                const maxY: number = Math.max(this.startCreateRectPoint.y, this.mousePosition.y);

                const rect: IRect = {
                    x: (minX - this.imageRectOnCanvas.x) * scale,
                    y: (minY - this.imageRectOnCanvas.y) * scale,
                    width: (maxX - minX) * scale,
                    height: (maxY - minY) * scale
                };
                this.addRectLabel(rect);
            }

            if (isOverImage && !!this.startResizeRectAnchor) {
                const activeLabelRect: LabelRect = this.getActiveRectLabel();
                const rect: IRect = this.calculateRectRelativeToActiveImage(activeLabelRect.rect);
                const startAnchorPosition = {
                    x: this.startResizeRectAnchor.middlePosition.x + this.imageRectOnCanvas.x,
                    y: this.startResizeRectAnchor.middlePosition.y + this.imageRectOnCanvas.y
                };
                const delta = {
                    x: this.mousePosition.x - startAnchorPosition.x,
                    y: this.mousePosition.y - startAnchorPosition.y
                };
                const resizedRect: IRect = RectUtil.resizeRect(rect, this.startResizeRectAnchor.type, delta);
                const scale = this.getActiveImageScale();
                const scaledRect: IRect = RectRenderEngine.scaleRect(resizedRect, scale);

                const imageData = this.getActiveImage();
                imageData.labelRects = imageData.labelRects.map((labelRect: LabelRect) => {
                    if (labelRect.id === activeLabelRect.id) {
                        return {
                            ...labelRect,
                            rect: scaledRect
                        };
                    }
                    return labelRect;
                });
                store.dispatch(updateImageDataById(imageData.id, imageData));
            }
        }
        this.endRectTransformation()
    };

    public mouseMoveHandler = (event: MouseEvent) => {
        this.mousePosition = CanvasUtil.getMousePositionOnCanvasFromEvent(event, this.canvas);
    };

    // =================================================================================================================
    // RENDERING
    // =================================================================================================================

    public render() {
        const activeLabelId: string = store.getState().editor.activeLabelId;
        const imageData: ImageData = this.getActiveImage();

        if (imageData) {
            imageData.labelRects.forEach((labelRect: LabelRect) => {
                labelRect.id === activeLabelId ? this.drawActiveRect(labelRect) : this.drawInactiveRect(labelRect);
            });
            this.drawCurrentlyCreatedRect();
            this.updateCursorStyle();
        }
    }

    private drawCurrentlyCreatedRect() {
        if (!!this.startCreateRectPoint) {
            const activeRect: IRect = {
                x: this.startCreateRectPoint.x,
                y: this.startCreateRectPoint.y,
                width: this.mousePosition.x - this.startCreateRectPoint.x,
                height: this.mousePosition.y - this.startCreateRectPoint.y
            };
            const activeRectBetweenPixels = DrawUtil.setRectBetweenPixels(activeRect);
            DrawUtil.drawRect(this.canvas, activeRectBetweenPixels, this.config.rectActiveColor, this.config.rectThickness);
        }
    }

    private drawInactiveRect(labelRect: LabelRect) {
        const highlightedLabelId: string = store.getState().editor.highlightedLabelId;
        const rect: IRect = this.transferRectToCanvas(labelRect.rect);
        const color: string = labelRect.id === highlightedLabelId ? this.config.rectActiveColor : this.config.rectInactiveColor;
        const rectBetweenPixels = DrawUtil.setRectBetweenPixels(rect);
        DrawUtil.drawRect(this.canvas, rectBetweenPixels, color, this.config.rectThickness);
    }

    private drawActiveRect(labelRect: LabelRect) {
        let rect: IRect = this.calculateRectRelativeToActiveImage(labelRect.rect);
        if (!!this.startResizeRectAnchor) {
            const startAnchorPosition = {
                x: this.startResizeRectAnchor.middlePosition.x + this.imageRectOnCanvas.x,
                y: this.startResizeRectAnchor.middlePosition.y + this.imageRectOnCanvas.y
            };
            const delta = {
                x: this.mousePosition.x - startAnchorPosition.x,
                y: this.mousePosition.y - startAnchorPosition.y
            };

            rect = RectUtil.resizeRect(rect, this.startResizeRectAnchor.type, delta);
        }

        const rectBetweenPixels = DrawUtil
            .setRectBetweenPixels(RectUtil.translate(rect, this.imageRectOnCanvas));
        DrawUtil.drawRect(this.canvas, rectBetweenPixels, this.config.rectActiveColor, this.config.rectThickness);

        const handleCenters: IPoint[] = RectUtil.mapRectToAnchors(rect).map((rectAnchor: RectAnchor) => rectAnchor.middlePosition);
        handleCenters.forEach((center: IPoint) => {
            const handleRect: IRect = RectUtil.getRectWithCenterAndSize(center, this.config.anchorSize);
            const handleRectBetweenPixels: IRect = DrawUtil
                .setRectBetweenPixels({...handleRect, x: handleRect.x + this.imageRectOnCanvas.x, y: handleRect.y + this.imageRectOnCanvas.y});
            DrawUtil.drawRectWithFill(this.canvas, handleRectBetweenPixels, this.config.activeAnchorColor);
        })
    }

    private updateCursorStyle() {
        if (!!this.canvas && !!this.mousePosition) {
            const labelRect: LabelRect = this.getActiveRectLabel();
            if (!!labelRect) {
                const rect: IRect = this.calculateRectRelativeToActiveImage(labelRect.rect);
                const rectAnchorUnderMouse: RectAnchor = this.getRectAnchorUnderMouse(rect);
                if (!!rectAnchorUnderMouse) {
                    this.canvas.style.cursor = AnchorTypeToCursorStyleMapping.get(rectAnchorUnderMouse.type);
                    return;
                }
            }
            this.canvas.style.cursor = (RectUtil.isPointInside(this.imageRectOnCanvas, this.mousePosition)) ? "crosshair" : "default";
        }
    }

    // =================================================================================================================
    // HELPERS
    // =================================================================================================================

    private static scaleRect(inputRect:IRect, scale: number): IRect {
        return {
            x: inputRect.x * scale,
            y: inputRect.y * scale,
            width: inputRect.width * scale,
            height: inputRect.height * scale
        }
    }

    private calculateRectRelativeToActiveImage(rect: IRect):IRect {
        const scale = this.getActiveImageScale();
        return RectRenderEngine.scaleRect(rect, 1/scale);
    }

    public updateImageRect(imageRect: IRect): void {
        this.imageRectOnCanvas = imageRect;
    }

    private addRectLabel = (rect: IRect) => {
        const activeImageIndex = store.getState().editor.activeImageIndex;
        const activeLabelIndex = store.getState().editor.activeLabelNameIndex;
        const imageData: ImageData = store.getState().editor.imagesData[activeImageIndex];
        const labelRect: LabelRect = {
            id: uuidv1(),
            labelIndex: activeLabelIndex,
            rect
        };
        imageData.labelRects.push(labelRect);
        store.dispatch(updateImageDataById(imageData.id, imageData));
        store.dispatch(updateFirstLabelCreatedFlag(true));
    };

    private getActiveRectLabel(): LabelRect | null {
        const activeLabelId: string = store.getState().editor.activeLabelId;
        return _.find(this.getActiveImage().labelRects, {id: activeLabelId});
    }

    private getRectAnchorUnderMouse(rect: IRect): RectAnchor {
        const rectAnchors: RectAnchor[] = RectUtil.mapRectToAnchors(rect);
        for (let i = 0; i < rectAnchors.length; i++) {
            const anchorRect: IRect = RectUtil.translate(RectUtil.getRectWithCenterAndSize(rectAnchors[i].middlePosition, this.config.anchorHoverSize), this.imageRectOnCanvas)
            if (!!this.mousePosition && RectUtil.isPointInside(anchorRect, this.mousePosition)) {
                return rectAnchors[i];
            }
        }
        return null;
    }

    private startRectCreation(mousePosition: IPoint) {
        this.startCreateRectPoint = mousePosition;
        this.mousePosition = mousePosition;
        store.dispatch(updateActiveLabelId(null));
    }

    private startRectResize(activatedAnchor: RectAnchor) {
        this.startResizeRectAnchor = activatedAnchor;
    }

    private endRectTransformation() {
        this.startCreateRectPoint = null;
        this.mousePosition = null;
        this.startResizeRectAnchor = null;
    }

    private transferRectToCanvas(rect:IRect): IRect {
        const scale = this.getActiveImageScale();
        const scaledRect = RectRenderEngine.scaleRect(rect, 1/scale);
        return {
            ...scaledRect,
            x: scaledRect.x + this.imageRectOnCanvas.x,
            y: scaledRect.y + this.imageRectOnCanvas.y
        }
    }
}