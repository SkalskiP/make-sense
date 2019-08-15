import {IPoint} from "../../interfaces/IPoint";
import {IRect} from "../../interfaces/IRect";
import {RectUtil} from "../../utils/RectUtil";
import {DrawUtil} from "../../utils/DrawUtil";
import {store} from "../..";
import {ImageData, LabelRect} from "../../store/editor/types";
import uuidv1 from 'uuid/v1';
import {
    updateActiveLabelId,
    updateFirstLabelCreatedFlag,
    updateHighlightedLabelId,
    updateImageDataById
} from "../../store/editor/actionCreators";
import {PointUtil} from "../../utils/PointUtil";
import {RectAnchor} from "../../data/RectAnchor";
import _ from "lodash";
import {RenderEngineConfig} from "../../settings/RenderEngineConfig";
import {CanvasUtil} from "../../utils/CanvasUtil";
import {updateCustomcursorStyle} from "../../store/general/actionCreators";
import {CustomCursorStyle} from "../../data/CustomCursorStyle";
import {BaseSuportRenderEngine} from "./BaseSuportRenderEngine";
import {NumberUtil} from "../../utils/NumberUtil";

export class RectRenderEngine extends BaseSuportRenderEngine {
    private config: RenderEngineConfig = new RenderEngineConfig();

    // =================================================================================================================
    // STATE
    // =================================================================================================================

    private startCreateRectPoint: IPoint;
    private startResizeRectAnchor: RectAnchor;
    private mousePosition: IPoint;
    private scale: number;

    public constructor(canvas: HTMLCanvasElement, imageRect: IRect) {
        super(canvas, imageRect);
    }

    // =================================================================================================================
    // EVENT HANDLERS
    // =================================================================================================================

    public mouseDownHandler = (event: MouseEvent) => {
        this.mousePosition = CanvasUtil.getMousePositionOnCanvasFromEvent(event, this.canvas);
        const isMouseOverImage: boolean = RectUtil.isPointInside(this.imageRectOnCanvas, this.mousePosition);
        const isMouseOverCanvas: boolean = RectUtil.isPointInside({x: 0, y: 0, ...CanvasUtil.getSize(this.canvas)},
            this.mousePosition);

        if (isMouseOverCanvas) {
            const rectUnderMouse: LabelRect = this.getRectUnderMouse();
            if (!!rectUnderMouse) {
                const rect: IRect = this.calculateRectRelativeToActiveImage(rectUnderMouse.rect);
                const anchorUnderMouse: RectAnchor = this.getAnchorUnderMouseByRect(rect);
                if (!!anchorUnderMouse) {
                    store.dispatch(updateActiveLabelId(rectUnderMouse.id));
                    this.startRectResize(anchorUnderMouse);
                } else {
                    this.startRectCreation(this.mousePosition);
                }
            } else if (isMouseOverImage) {
                this.startRectCreation(this.mousePosition);
            }
        }
    };

    public mouseUpHandler = (event: MouseEvent) => {
        if (!!this.imageRectOnCanvas) {
            this.mousePosition = CanvasUtil.getMousePositionOnCanvasFromEvent(event, this.canvas);
            const mousePositionSnapped: IPoint = this.snapPointToImage(this.mousePosition);

            if (!!this.startCreateRectPoint && !PointUtil.equals(this.startCreateRectPoint, mousePositionSnapped)) {
                const scale = this.scale;

                const minX: number = Math.min(this.startCreateRectPoint.x, mousePositionSnapped.x);
                const minY: number = Math.min(this.startCreateRectPoint.y, mousePositionSnapped.y);
                const maxX: number = Math.max(this.startCreateRectPoint.x, mousePositionSnapped.x);
                const maxY: number = Math.max(this.startCreateRectPoint.y, mousePositionSnapped.y);

                const rect: IRect = {
                    x: (minX - this.imageRectOnCanvas.x) * scale,
                    y: (minY - this.imageRectOnCanvas.y) * scale,
                    width: (maxX - minX) * scale,
                    height: (maxY - minY) * scale
                };
                this.addRectLabel(rect);
            }

            if (!!this.startResizeRectAnchor) {
                const activeLabelRect: LabelRect = this.getActiveRectLabel();
                const rect: IRect = this.calculateRectRelativeToActiveImage(activeLabelRect.rect);
                const startAnchorPosition = {
                    x: this.startResizeRectAnchor.middlePosition.x + this.imageRectOnCanvas.x,
                    y: this.startResizeRectAnchor.middlePosition.y + this.imageRectOnCanvas.y
                };
                const delta = {
                    x: mousePositionSnapped.x - startAnchorPosition.x,
                    y: mousePositionSnapped.y - startAnchorPosition.y
                };
                const resizeRect: IRect = RectUtil.resizeRect(rect, this.startResizeRectAnchor.type, delta);
                const scale = this.scale;
                const scaledRect: IRect = RectRenderEngine.scaleRect(resizeRect, scale);

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
        if (!!this.imageRectOnCanvas) {
            const isOverImage: boolean = RectUtil.isPointInside(this.imageRectOnCanvas, this.mousePosition);
            if (isOverImage && !this.startResizeRectAnchor) {
                const labelRect: LabelRect = this.getRectUnderMouse();
                if (!!labelRect) {
                    if (store.getState().editor.highlightedLabelId !== labelRect.id) {
                        store.dispatch(updateHighlightedLabelId(labelRect.id))
                    }
                } else {
                    if (store.getState().editor.highlightedLabelId !== null) {
                        store.dispatch(updateHighlightedLabelId(null))
                    }
                }
            }
        }
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
            const mousePositionSnapped: IPoint = this.snapPointToImage(this.mousePosition);
            const activeRect: IRect = {
                x: this.startCreateRectPoint.x,
                y: this.startCreateRectPoint.y,
                width: mousePositionSnapped.x - this.startCreateRectPoint.x,
                height: mousePositionSnapped.y - this.startCreateRectPoint.y
            };
            const activeRectBetweenPixels = DrawUtil.setRectBetweenPixels(activeRect);
            DrawUtil.drawRect(this.canvas, activeRectBetweenPixels, this.config.rectActiveColor, this.config.rectThickness);
        }
    }

    private drawInactiveRect(labelRect: LabelRect) {
        const rectOnImage: IRect = this.transferRectToImage(labelRect.rect);
        const highlightedLabelId: string = store.getState().editor.highlightedLabelId;
        this.renderRect(rectOnImage, labelRect.id === highlightedLabelId);
    }

    private drawActiveRect(labelRect: LabelRect) {
        let rect: IRect = this.calculateRectRelativeToActiveImage(labelRect.rect);
        if (!!this.startResizeRectAnchor) {
            const startAnchorPosition: IPoint = {
                x: this.startResizeRectAnchor.middlePosition.x + this.imageRectOnCanvas.x,
                y: this.startResizeRectAnchor.middlePosition.y + this.imageRectOnCanvas.y
            };
            const endAnchorPositionSnapped: IPoint = this.snapPointToImage(this.mousePosition);
            const delta = {
                x: endAnchorPositionSnapped.x - startAnchorPosition.x,
                y: endAnchorPositionSnapped.y - startAnchorPosition.y
            };
            rect = RectUtil.resizeRect(rect, this.startResizeRectAnchor.type, delta);
        }
        const rectOnImage: IRect = RectUtil.translate(rect, this.imageRectOnCanvas);
        this.renderRect(rectOnImage, true);
    }

    private renderRect(rectOnImage: IRect, isActive: boolean) {
        const rectBetweenPixels = DrawUtil.setRectBetweenPixels(rectOnImage);
        const lineColor: string = isActive ? this.config.rectActiveColor : this.config.rectInactiveColor;
        DrawUtil.drawRect(this.canvas, rectBetweenPixels, lineColor, this.config.rectThickness);
        if (isActive) {
            const handleCenters: IPoint[] = RectUtil.mapRectToAnchors(rectOnImage).map((rectAnchor: RectAnchor) => rectAnchor.middlePosition);
            handleCenters.forEach((center: IPoint) => {
                const handleRect: IRect = RectUtil.getRectWithCenterAndSize(center, this.config.anchorSize);
                const handleRectBetweenPixels: IRect = DrawUtil.setRectBetweenPixels(handleRect);
                DrawUtil.drawRectWithFill(this.canvas, handleRectBetweenPixels, this.config.activeAnchorColor);
            })
        }
    }

    private updateCursorStyle() {
        if (!!this.canvas && !!this.mousePosition) {
            const rectAnchorUnderMouse: RectAnchor = this.getAnchorUnderMouse();
            if (!!rectAnchorUnderMouse || !!this.startResizeRectAnchor) {
                store.dispatch(updateCustomcursorStyle(CustomCursorStyle.MOVE));
                return;
            }
            if (RectUtil.isPointInside({x: 0, y: 0, ...CanvasUtil.getSize(this.canvas)}, this.mousePosition)) {
                if (!RectUtil.isPointInside(this.imageRectOnCanvas, this.mousePosition) && !!this.startCreateRectPoint)
                    store.dispatch(updateCustomcursorStyle(CustomCursorStyle.MOVE));
                else
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
        return !!this.startCreateRectPoint || !!this.startResizeRectAnchor;
    }

    private static scaleRect(inputRect:IRect, scale: number): IRect {
        return {
            x: inputRect.x * scale,
            y: inputRect.y * scale,
            width: inputRect.width * scale,
            height: inputRect.height * scale
        }
    }

    private calculateRectRelativeToActiveImage(rect: IRect):IRect {
        const scale = this.scale;
        return RectRenderEngine.scaleRect(rect, 1/scale);
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
        store.dispatch(updateActiveLabelId(labelRect.id));
    };

    private getActiveRectLabel(): LabelRect | null {
        const activeLabelId: string = store.getState().editor.activeLabelId;
        return _.find(this.getActiveImage().labelRects, {id: activeLabelId});
    }

    private getRectUnderMouse(): LabelRect {
        const activeRectLabel: LabelRect = this.getActiveRectLabel();
        if (!!activeRectLabel && this.isMouseOverRectEdges(activeRectLabel.rect)) {
            return activeRectLabel;
        }

        const labelRects: LabelRect[] = this.getActiveImage().labelRects;
        for (let i = 0; i < labelRects.length; i++) {
            if (this.isMouseOverRectEdges(labelRects[i].rect)) {
                return labelRects[i];
            }
        }
        return null;
    }

    private isMouseOverRectEdges(rect: IRect): boolean {
        const rectOnImage: IRect = RectUtil.translate(
            this.calculateRectRelativeToActiveImage(rect), this.imageRectOnCanvas);

        const outerRectDelta: IPoint = {
            x: this.config.anchorHoverSize.width / 2,
            y: this.config.anchorHoverSize.height / 2
        };
        const outerRect: IRect = RectUtil.expand(rectOnImage, outerRectDelta);

        const innerRectDelta: IPoint = {
            x: - this.config.anchorHoverSize.width / 2,
            y: - this.config.anchorHoverSize.height / 2
        };
        const innerRect: IRect = RectUtil.expand(rectOnImage, innerRectDelta);

        return (RectUtil.isPointInside(outerRect, this.mousePosition) &&
            !RectUtil.isPointInside(innerRect, this.mousePosition));
    }

    private getAnchorUnderMouseByRect(rect: IRect): RectAnchor {
        const rectAnchors: RectAnchor[] = RectUtil.mapRectToAnchors(rect);
        for (let i = 0; i < rectAnchors.length; i++) {
            const anchorRect: IRect = RectUtil.translate(RectUtil.getRectWithCenterAndSize(rectAnchors[i].middlePosition, this.config.anchorHoverSize), this.imageRectOnCanvas)
            if (!!this.mousePosition && RectUtil.isPointInside(anchorRect, this.mousePosition)) {
                return rectAnchors[i];
            }
        }
        return null;
    }

    private getAnchorUnderMouse(): RectAnchor {
        const labelRects: LabelRect[] = this.getActiveImage().labelRects;
        for (let i = 0; i < labelRects.length; i++) {
            const rect: IRect = this.calculateRectRelativeToActiveImage(labelRects[i].rect);
            const rectAnchor = this.getAnchorUnderMouseByRect(rect);
            if (!!rectAnchor) return rectAnchor;
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

    private transferRectToImage(rect:IRect): IRect {
        const scale = this.scale;
        const scaledRect = RectRenderEngine.scaleRect(rect, 1/scale);
        return {
            ...scaledRect,
            x: scaledRect.x + this.imageRectOnCanvas.x,
            y: scaledRect.y + this.imageRectOnCanvas.y
        }
    }

    private snapPointToImage(point: IPoint): IPoint {
        if (RectUtil.isPointInside(this.imageRectOnCanvas, point))
            return point;

        return {
            x: NumberUtil.snapValueToRange(point.x, this.imageRectOnCanvas.x, this.imageRectOnCanvas.x + this.imageRectOnCanvas.width),
            y: NumberUtil.snapValueToRange(point.y, this.imageRectOnCanvas.y, this.imageRectOnCanvas.y + this.imageRectOnCanvas.height)
        }
    }
}