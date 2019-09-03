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
import {RenderEngineConfig} from "../../settings/RenderEngineConfig";
import {updateCustomCursorStyle} from "../../store/general/actionCreators";
import {CustomCursorStyle} from "../../data/CustomCursorStyle";
import {EditorSelector} from "../../store/selectors/EditorSelector";
import {EditorData} from "../../data/EditorData";
import {BaseRenderEngine} from "./BaseRenderEngine";
import {RenderEngineUtil} from "../../utils/RenderEngineUtil";
import {LabelType} from "../../data/LabelType";

export class RectRenderEngine extends BaseRenderEngine {
    private config: RenderEngineConfig = new RenderEngineConfig();

    // =================================================================================================================
    // STATE
    // =================================================================================================================

    private startCreateRectPoint: IPoint;
    private startResizeRectAnchor: RectAnchor;

    public constructor(canvas: HTMLCanvasElement) {
        super(canvas);
        this.labelType = LabelType.RECTANGLE;
    }

    // =================================================================================================================
    // EVENT HANDLERS
    // =================================================================================================================

    public mouseDownHandler = (data: EditorData) => {
        const isMouseOverImage: boolean = RenderEngineUtil.isMouseOverImage(data);
        const isMouseOverCanvas: boolean = RenderEngineUtil.isMouseOverCanvas(data);
        if (isMouseOverCanvas) {
            const rectUnderMouse: LabelRect = this.getRectUnderMouse(data.activeImageScale, data.viewPortRectOnCanvas, data.mousePositionOnCanvas);
            if (!!rectUnderMouse) {
                const rect: IRect = this.calculateRectRelativeToActiveImage(rectUnderMouse.rect, data.activeImageScale);
                const anchorUnderMouse: RectAnchor = this.getAnchorUnderMouseByRect(rect, data.mousePositionOnCanvas, data.viewPortRectOnCanvas);
                if (!!anchorUnderMouse) {
                    store.dispatch(updateActiveLabelId(rectUnderMouse.id));
                    this.startRectResize(anchorUnderMouse);
                } else {
                    if (!!EditorSelector.getHighlightedLabelId())
                        store.dispatch(updateActiveLabelId(EditorSelector.getHighlightedLabelId()));
                    else
                        this.startRectCreation(data.mousePositionOnCanvas);
                }
            } else if (isMouseOverImage) {

                this.startRectCreation(data.mousePositionOnCanvas);
            }
        }
    };

    public mouseUpHandler = (data: EditorData) => {
        if (!!data.viewPortRectOnCanvas) {
            const mousePositionSnapped: IPoint = RectUtil.snapPointToRect(data.mousePositionOnCanvas, data.viewPortRectOnCanvas);

            if (!!this.startCreateRectPoint && !PointUtil.equals(this.startCreateRectPoint, mousePositionSnapped)) {

                const minX: number = Math.min(this.startCreateRectPoint.x, mousePositionSnapped.x);
                const minY: number = Math.min(this.startCreateRectPoint.y, mousePositionSnapped.y);
                const maxX: number = Math.max(this.startCreateRectPoint.x, mousePositionSnapped.x);
                const maxY: number = Math.max(this.startCreateRectPoint.y, mousePositionSnapped.y);

                const rect: IRect = {
                    x: (minX - data.viewPortRectOnCanvas.x) * data.activeImageScale,
                    y: (minY - data.viewPortRectOnCanvas.y) * data.activeImageScale,
                    width: (maxX - minX) * data.activeImageScale,
                    height: (maxY - minY) * data.activeImageScale
                };
                this.addRectLabel(rect);
            }

            if (!!this.startResizeRectAnchor) {
                const activeLabelRect: LabelRect = EditorSelector.getActiveRectLabel();
                const rect: IRect = this.calculateRectRelativeToActiveImage(activeLabelRect.rect, data.activeImageScale);
                const startAnchorPosition: IPoint = PointUtil.add(this.startResizeRectAnchor.position,
                    data.viewPortRectOnCanvas);
                const delta: IPoint = PointUtil.subtract(mousePositionSnapped, startAnchorPosition);
                const resizeRect: IRect = RectUtil.resizeRect(rect, this.startResizeRectAnchor.type, delta);
                const scaledRect: IRect = RectUtil.scaleRect(resizeRect, data.activeImageScale);

                const imageData = EditorSelector.getActiveImageData();
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

    public mouseMoveHandler = (data: EditorData) => {
        if (!!data.viewPortRectOnCanvas && !!data.mousePositionOnCanvas) {
            const isOverImage: boolean = RenderEngineUtil.isMouseOverImage(data);
            if (isOverImage && !this.startResizeRectAnchor) {
                const labelRect: LabelRect = this.getRectUnderMouse(data.activeImageScale, data.viewPortRectOnCanvas, data.mousePositionOnCanvas);
                if (!!labelRect) {
                    if (EditorSelector.getHighlightedLabelId() !== labelRect.id) {
                        store.dispatch(updateHighlightedLabelId(labelRect.id))
                    }
                } else {
                    if (EditorSelector.getHighlightedLabelId() !== null) {
                        store.dispatch(updateHighlightedLabelId(null))
                    }
                }
            }
        }
    };

    // =================================================================================================================
    // RENDERING
    // =================================================================================================================

    public render(data: EditorData) {
        const activeLabelId: string = EditorSelector.getActiveLabelId();
        const imageData: ImageData = EditorSelector.getActiveImageData();

        if (imageData) {
            imageData.labelRects.forEach((labelRect: LabelRect) => {
                labelRect.id === activeLabelId ? this.drawActiveRect(labelRect, data.mousePositionOnCanvas, data.viewPortRectOnCanvas, data.activeImageScale) : this.drawInactiveRect(labelRect, data);
            });
            this.drawCurrentlyCreatedRect(data.mousePositionOnCanvas, data.viewPortRectOnCanvas);
            this.updateCursorStyle(data);
        }
    }

    private drawCurrentlyCreatedRect(mousePosition: IPoint, imageRect: IRect) {
        if (!!this.startCreateRectPoint) {
            const mousePositionSnapped: IPoint = RectUtil.snapPointToRect(mousePosition, imageRect);
            const activeRect: IRect = {
                x: this.startCreateRectPoint.x,
                y: this.startCreateRectPoint.y,
                width: mousePositionSnapped.x - this.startCreateRectPoint.x,
                height: mousePositionSnapped.y - this.startCreateRectPoint.y
            };
            const activeRectBetweenPixels = RenderEngineUtil.setRectBetweenPixels(activeRect);
            DrawUtil.drawRect(this.canvas, activeRectBetweenPixels, this.config.lineActiveColor, this.config.lineThickness);
        }
    }

    private drawInactiveRect(labelRect: LabelRect, data: EditorData) {
        const rectOnImage: IRect = RenderEngineUtil.transferRectFromCanvasToImage(labelRect.rect, data);
        const highlightedLabelId: string = EditorSelector.getHighlightedLabelId();
        this.renderRect(rectOnImage, labelRect.id === highlightedLabelId);
    }

    private drawActiveRect(labelRect: LabelRect, mousePosition: IPoint, imageRect: IRect, scale: number) {
        let rect: IRect = this.calculateRectRelativeToActiveImage(labelRect.rect, scale);
        if (!!this.startResizeRectAnchor) {
            const startAnchorPosition: IPoint = PointUtil.add(this.startResizeRectAnchor.position, imageRect);
            const endAnchorPositionSnapped: IPoint = RectUtil.snapPointToRect(mousePosition, imageRect);
            const delta = PointUtil.subtract(endAnchorPositionSnapped, startAnchorPosition);
            rect = RectUtil.resizeRect(rect, this.startResizeRectAnchor.type, delta);
        }
        const rectOnImage: IRect = RectUtil.translate(rect, imageRect);
        this.renderRect(rectOnImage, true);
    }

    private renderRect(rectOnImage: IRect, isActive: boolean) {
        const rectBetweenPixels = RenderEngineUtil.setRectBetweenPixels(rectOnImage);
        const lineColor: string = isActive ? this.config.lineActiveColor : this.config.lineInactiveColor;
        DrawUtil.drawRect(this.canvas, rectBetweenPixels, lineColor, this.config.lineThickness);
        if (isActive) {
            const handleCenters: IPoint[] = RectUtil.mapRectToAnchors(rectOnImage).map((rectAnchor: RectAnchor) => rectAnchor.position);
            handleCenters.forEach((center: IPoint) => {
                const handleRect: IRect = RectUtil.getRectWithCenterAndSize(center, this.config.anchorSize);
                const handleRectBetweenPixels: IRect = RenderEngineUtil.setRectBetweenPixels(handleRect);
                DrawUtil.drawRectWithFill(this.canvas, handleRectBetweenPixels, this.config.activeAnchorColor);
            })
        }
    }

    private updateCursorStyle(data: EditorData) {
        if (!!this.canvas && !!data.mousePositionOnCanvas) {
            const rectAnchorUnderMouse: RectAnchor = this.getAnchorUnderMouse(data.activeImageScale, data.mousePositionOnCanvas, data.viewPortRectOnCanvas);
            if (!!rectAnchorUnderMouse || !!this.startResizeRectAnchor) {
                store.dispatch(updateCustomCursorStyle(CustomCursorStyle.MOVE));
                return;
            }
            if (RenderEngineUtil.isMouseOverCanvas(data)) {
                if (!RectUtil.isPointInside(data.viewPortRectOnCanvas, data.mousePositionOnCanvas) && !!this.startCreateRectPoint)
                    store.dispatch(updateCustomCursorStyle(CustomCursorStyle.MOVE));
                else
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
        return !!this.startCreateRectPoint || !!this.startResizeRectAnchor;
    }

    private calculateRectRelativeToActiveImage(rect: IRect, scale: number):IRect {
        return RectUtil.scaleRect(rect, 1/scale);
    }

    private addRectLabel = (rect: IRect) => {
        const activeLabelIndex = EditorSelector.getActiveLabelNameIndex();
        const imageData: ImageData = EditorSelector.getActiveImageData();
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

    private getRectUnderMouse(scale: number, imageRect: IRect, mousePosition: IPoint): LabelRect {
        const activeRectLabel: LabelRect = EditorSelector.getActiveRectLabel();
        if (!!activeRectLabel && this.isMouseOverRectEdges(activeRectLabel.rect, scale, imageRect, mousePosition)) {
            return activeRectLabel;
        }

        const labelRects: LabelRect[] = EditorSelector.getActiveImageData().labelRects;
        for (let i = 0; i < labelRects.length; i++) {
            if (this.isMouseOverRectEdges(labelRects[i].rect, scale, imageRect, mousePosition)) {
                return labelRects[i];
            }
        }
        return null;
    }

    private isMouseOverRectEdges(rect: IRect, scale: number, imageRect: IRect, mousePosition: IPoint): boolean {
        const rectOnImage: IRect = RectUtil.translate(
            this.calculateRectRelativeToActiveImage(rect, scale), imageRect);

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

        return (RectUtil.isPointInside(outerRect, mousePosition) &&
            !RectUtil.isPointInside(innerRect, mousePosition));
    }

    private getAnchorUnderMouseByRect(rect: IRect, mousePosition: IPoint, imageRect: IRect): RectAnchor {
        const rectAnchors: RectAnchor[] = RectUtil.mapRectToAnchors(rect);
        for (let i = 0; i < rectAnchors.length; i++) {
            const anchorRect: IRect = RectUtil.translate(RectUtil.getRectWithCenterAndSize(rectAnchors[i].position, this.config.anchorHoverSize), imageRect)
            if (!!mousePosition && RectUtil.isPointInside(anchorRect, mousePosition)) {
                return rectAnchors[i];
            }
        }
        return null;
    }

    private getAnchorUnderMouse(scale: number, mousePosition: IPoint, imageRect: IRect): RectAnchor {
        const labelRects: LabelRect[] = EditorSelector.getActiveImageData().labelRects;
        for (let i = 0; i < labelRects.length; i++) {
            const rect: IRect = this.calculateRectRelativeToActiveImage(labelRects[i].rect, scale);
            const rectAnchor = this.getAnchorUnderMouseByRect(rect, mousePosition, imageRect);
            if (!!rectAnchor) return rectAnchor;
        }
        return null;
    }

    private startRectCreation(mousePosition: IPoint) {
        this.startCreateRectPoint = mousePosition;
        store.dispatch(updateActiveLabelId(null));
    }

    private startRectResize(activatedAnchor: RectAnchor) {
        this.startResizeRectAnchor = activatedAnchor;
    }

    private endRectTransformation() {
        this.startCreateRectPoint = null;
        this.startResizeRectAnchor = null;
    }
}