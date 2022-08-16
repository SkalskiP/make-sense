import {IPoint} from '../../interfaces/IPoint';
import {IRect} from '../../interfaces/IRect';
import {RectUtil} from '../../utils/RectUtil';
import {DrawUtil} from '../../utils/DrawUtil';
import {store} from '../..';
import {ImageData, LabelRect} from '../../store/labels/types';
import {
    updateActiveLabelId,
    updateFirstLabelCreatedFlag,
    updateHighlightedLabelId,
    updateImageDataById
} from '../../store/labels/actionCreators';
import {PointUtil} from '../../utils/PointUtil';
import {RectAnchor} from '../../data/RectAnchor';
import {RenderEngineSettings} from '../../settings/RenderEngineSettings';
import {updateCustomCursorStyle} from '../../store/general/actionCreators';
import {CustomCursorStyle} from '../../data/enums/CustomCursorStyle';
import {LabelsSelector} from '../../store/selectors/LabelsSelector';
import {EditorData} from '../../data/EditorData';
import {BaseRenderEngine} from './BaseRenderEngine';
import {RenderEngineUtil} from '../../utils/RenderEngineUtil';
import {LabelType} from '../../data/enums/LabelType';
import {EditorActions} from '../actions/EditorActions';
import {GeneralSelector} from '../../store/selectors/GeneralSelector';
import {LabelStatus} from '../../data/enums/LabelStatus';
import {LabelUtil} from '../../utils/LabelUtil';

export class RectRenderEngine extends BaseRenderEngine {

    // =================================================================================================================
    // STATE
    // =================================================================================================================

    private startCreateRectPoint: IPoint;
    private startResizeRectAnchor: RectAnchor;

    public constructor(canvas: HTMLCanvasElement) {
        super(canvas);
        this.labelType = LabelType.RECT;
    }

    // =================================================================================================================
    // EVENT HANDLERS
    // =================================================================================================================

    public mouseDownHandler = (data: EditorData) => {
        const isMouseOverImage: boolean = RenderEngineUtil.isMouseOverImage(data);
        const isMouseOverCanvas: boolean = RenderEngineUtil.isMouseOverCanvas(data);
        if (isMouseOverCanvas) {
            const rectUnderMouse: LabelRect = this.getRectUnderMouse(data);
            if (!!rectUnderMouse) {
                const rect: IRect = this.calculateRectRelativeToActiveImage(rectUnderMouse.rect, data);
                const anchorUnderMouse: RectAnchor = this.getAnchorUnderMouseByRect(rect, data.mousePositionOnViewPortContent, data.viewPortContentImageRect);
                if (!!anchorUnderMouse && rectUnderMouse.status === LabelStatus.ACCEPTED) {
                    store.dispatch(updateActiveLabelId(rectUnderMouse.id));
                    this.startRectResize(anchorUnderMouse);
                } else {
                    if (!!LabelsSelector.getHighlightedLabelId())
                        store.dispatch(updateActiveLabelId(LabelsSelector.getHighlightedLabelId()));
                    else
                        this.startRectCreation(data.mousePositionOnViewPortContent);
                }
            } else if (isMouseOverImage) {

                this.startRectCreation(data.mousePositionOnViewPortContent);
            }
        }
    };

    public mouseUpHandler = (data: EditorData) => {
        if (!!data.viewPortContentImageRect) {
            const mousePositionSnapped: IPoint = RectUtil.snapPointToRect(data.mousePositionOnViewPortContent, data.viewPortContentImageRect);
            const activeLabelRect: LabelRect = LabelsSelector.getActiveRectLabel();

            if (!!this.startCreateRectPoint && !PointUtil.equals(this.startCreateRectPoint, mousePositionSnapped)) {

                const minX: number = Math.min(this.startCreateRectPoint.x, mousePositionSnapped.x);
                const minY: number = Math.min(this.startCreateRectPoint.y, mousePositionSnapped.y);
                const maxX: number = Math.max(this.startCreateRectPoint.x, mousePositionSnapped.x);
                const maxY: number = Math.max(this.startCreateRectPoint.y, mousePositionSnapped.y);

                const rect = {x: minX, y: minY, width: maxX - minX, height: maxY - minY};
                this.addRectLabel(RenderEngineUtil.transferRectFromImageToViewPortContent(rect, data));
            }

            if (!!this.startResizeRectAnchor && !!activeLabelRect) {
                const rect: IRect = this.calculateRectRelativeToActiveImage(activeLabelRect.rect, data);
                const startAnchorPosition: IPoint = PointUtil.add(this.startResizeRectAnchor.position,
                    data.viewPortContentImageRect);
                const delta: IPoint = PointUtil.subtract(mousePositionSnapped, startAnchorPosition);
                const resizeRect: IRect = RectUtil.resizeRect(rect, this.startResizeRectAnchor.type, delta);
                const scale: number = RenderEngineUtil.calculateImageScale(data);
                const scaledRect: IRect = RectUtil.scaleRect(resizeRect, scale);

                const imageData = LabelsSelector.getActiveImageData();
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
        if (!!data.viewPortContentImageRect && !!data.mousePositionOnViewPortContent) {
            const isOverImage: boolean = RenderEngineUtil.isMouseOverImage(data);
            if (isOverImage && !this.startResizeRectAnchor) {
                const labelRect: LabelRect = this.getRectUnderMouse(data);
                if (!!labelRect && !this.isInProgress()) {
                    if (LabelsSelector.getHighlightedLabelId() !== labelRect.id) {
                        store.dispatch(updateHighlightedLabelId(labelRect.id))
                    }
                } else {
                    if (LabelsSelector.getHighlightedLabelId() !== null) {
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
        const activeLabelId: string = LabelsSelector.getActiveLabelId();
        const imageData: ImageData = LabelsSelector.getActiveImageData();
        if (imageData) {
            imageData.labelRects.forEach((labelRect: LabelRect) => {
                if (labelRect.isVisible) {
                    if (labelRect.status === LabelStatus.ACCEPTED && labelRect.id === activeLabelId) {
                        this.drawActiveRect(labelRect, data)
                    } else {
                        this.drawInactiveRect(labelRect, data);
                    }
                }
            });
            this.drawCurrentlyCreatedRect(data.mousePositionOnViewPortContent, data.viewPortContentImageRect);
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
            const lineColor: string = BaseRenderEngine.resolveLabelLineColor(null, true)
            DrawUtil.drawRect(this.canvas, activeRectBetweenPixels, lineColor, RenderEngineSettings.LINE_THICKNESS);
        }
    }

    private drawInactiveRect(labelRect: LabelRect, data: EditorData) {
        const rectOnImage: IRect = RenderEngineUtil.transferRectFromViewPortContentToImage(labelRect.rect, data)
        const highlightedLabelId: string = LabelsSelector.getHighlightedLabelId()
        const displayAsActive: boolean = labelRect.status === LabelStatus.ACCEPTED && labelRect.id === highlightedLabelId;
        const lineColor: string = BaseRenderEngine.resolveLabelLineColor(labelRect.labelId, displayAsActive)
        const anchorColor: string = BaseRenderEngine.resolveLabelAnchorColor(displayAsActive);
        this.renderRect(rectOnImage, displayAsActive, lineColor, anchorColor);
    }

    private drawActiveRect(labelRect: LabelRect, data: EditorData) {
        let rect: IRect = this.calculateRectRelativeToActiveImage(labelRect.rect, data);
        if (!!this.startResizeRectAnchor) {
            const startAnchorPosition: IPoint = PointUtil.add(this.startResizeRectAnchor.position, data.viewPortContentImageRect);
            const endAnchorPositionSnapped: IPoint = RectUtil.snapPointToRect(data.mousePositionOnViewPortContent, data.viewPortContentImageRect);
            const delta = PointUtil.subtract(endAnchorPositionSnapped, startAnchorPosition);
            rect = RectUtil.resizeRect(rect, this.startResizeRectAnchor.type, delta);
        }
        const rectOnImage: IRect = RectUtil.translate(rect, data.viewPortContentImageRect);
        const lineColor: string = BaseRenderEngine.resolveLabelLineColor(labelRect.labelId, true)
        const anchorColor: string = BaseRenderEngine.resolveLabelAnchorColor(true);
        this.renderRect(rectOnImage, true, lineColor, anchorColor);
    }

    private renderRect(rectOnImage: IRect, isActive: boolean, lineColor: string, anchorColor: string) {
        const rectBetweenPixels = RenderEngineUtil.setRectBetweenPixels(rectOnImage);
        DrawUtil.drawRectWithFill(this.canvas, rectBetweenPixels, DrawUtil.hexToRGB(lineColor, 0.2));
        DrawUtil.drawRect(this.canvas, rectBetweenPixels, lineColor, RenderEngineSettings.LINE_THICKNESS);
        if (isActive) {
            const handleCenters: IPoint[] = RectUtil.mapRectToAnchors(rectOnImage).map((rectAnchor: RectAnchor) => rectAnchor.position);
            handleCenters.forEach((center: IPoint) => {
                const handleRect: IRect = RectUtil.getRectWithCenterAndSize(center, RenderEngineSettings.anchorSize);
                const handleRectBetweenPixels: IRect = RenderEngineUtil.setRectBetweenPixels(handleRect);
                DrawUtil.drawRectWithFill(this.canvas, handleRectBetweenPixels, anchorColor);
            })
        }
    }

    private updateCursorStyle(data: EditorData) {
        if (!!this.canvas && !!data.mousePositionOnViewPortContent && !GeneralSelector.getImageDragModeStatus()) {
            const rectUnderMouse: LabelRect = this.getRectUnderMouse(data);
            const rectAnchorUnderMouse: RectAnchor = this.getAnchorUnderMouse(data);
            if ((!!rectAnchorUnderMouse && rectUnderMouse && rectUnderMouse.status === LabelStatus.ACCEPTED) || !!this.startResizeRectAnchor) {
                store.dispatch(updateCustomCursorStyle(CustomCursorStyle.MOVE));
                return;
            }
            else if (RenderEngineUtil.isMouseOverCanvas(data)) {
                if (!RenderEngineUtil.isMouseOverImage(data) && !!this.startCreateRectPoint)
                    store.dispatch(updateCustomCursorStyle(CustomCursorStyle.MOVE));
                else
                    RenderEngineUtil.wrapDefaultCursorStyleInCancel(data);
                this.canvas.style.cursor = 'none';
            } else {
                this.canvas.style.cursor = 'default';
            }
        }
    }

    // =================================================================================================================
    // HELPERS
    // =================================================================================================================

    public isInProgress(): boolean {
        return !!this.startCreateRectPoint || !!this.startResizeRectAnchor;
    }

    private calculateRectRelativeToActiveImage(rect: IRect, data: EditorData):IRect {
        const scale: number = RenderEngineUtil.calculateImageScale(data);
        return RectUtil.scaleRect(rect, 1/scale);
    }

    private addRectLabel = (rect: IRect) => {
        const activeLabelId = LabelsSelector.getActiveLabelNameId();
        const imageData: ImageData = LabelsSelector.getActiveImageData();
        const labelRect: LabelRect = LabelUtil.createLabelRect(activeLabelId, rect);
        imageData.labelRects.push(labelRect);
        store.dispatch(updateImageDataById(imageData.id, imageData));
        store.dispatch(updateFirstLabelCreatedFlag(true));
        store.dispatch(updateActiveLabelId(labelRect.id));
    };

    private getRectUnderMouse(data: EditorData): LabelRect {
        const activeRectLabel: LabelRect = LabelsSelector.getActiveRectLabel();
        if (!!activeRectLabel && activeRectLabel.isVisible && this.isMouseOverRectEdges(activeRectLabel.rect, data)) {
            return activeRectLabel;
        }

        const labelRects: LabelRect[] = LabelsSelector.getActiveImageData().labelRects;
        for (const labelRect of labelRects) {
            if (labelRect.isVisible && this.isMouseOverRectEdges(labelRect.rect, data)) {
                return labelRect;
            }
        }
        return null;
    }

    private isMouseOverRectEdges(rect: IRect, data: EditorData): boolean {
        const rectOnImage: IRect = RectUtil.translate(
            this.calculateRectRelativeToActiveImage(rect, data), data.viewPortContentImageRect);

        const outerRectDelta: IPoint = {
            x: RenderEngineSettings.anchorHoverSize.width / 2,
            y: RenderEngineSettings.anchorHoverSize.height / 2
        };
        const outerRect: IRect = RectUtil.expand(rectOnImage, outerRectDelta);

        const innerRectDelta: IPoint = {
            x: - RenderEngineSettings.anchorHoverSize.width / 2,
            y: - RenderEngineSettings.anchorHoverSize.height / 2
        };
        const innerRect: IRect = RectUtil.expand(rectOnImage, innerRectDelta);

        return (RectUtil.isPointInside(outerRect, data.mousePositionOnViewPortContent) &&
            !RectUtil.isPointInside(innerRect, data.mousePositionOnViewPortContent));
    }

    private getAnchorUnderMouseByRect(rect: IRect, mousePosition: IPoint, imageRect: IRect): RectAnchor {
        const rectAnchors: RectAnchor[] = RectUtil.mapRectToAnchors(rect);
        for (let i = 0; i < rectAnchors.length; i++) {
            const anchorRect: IRect = RectUtil.translate(RectUtil.getRectWithCenterAndSize(rectAnchors[i].position, RenderEngineSettings.anchorHoverSize), imageRect);
            if (!!mousePosition && RectUtil.isPointInside(anchorRect, mousePosition)) {
                return rectAnchors[i];
            }
        }
        return null;
    }

    private getAnchorUnderMouse(data: EditorData): RectAnchor {
        const labelRects: LabelRect[] = LabelsSelector.getActiveImageData().labelRects;
        for (let i = 0; i < labelRects.length; i++) {
            const rect: IRect = this.calculateRectRelativeToActiveImage(labelRects[i].rect, data);
            const rectAnchor = this.getAnchorUnderMouseByRect(rect, data.mousePositionOnViewPortContent, data.viewPortContentImageRect);
            if (!!rectAnchor) return rectAnchor;
        }
        return null;
    }

    private startRectCreation(mousePosition: IPoint) {
        this.startCreateRectPoint = mousePosition;
        store.dispatch(updateActiveLabelId(null));
        EditorActions.setViewPortActionsDisabledStatus(true);
    }

    private startRectResize(activatedAnchor: RectAnchor) {
        this.startResizeRectAnchor = activatedAnchor;
        EditorActions.setViewPortActionsDisabledStatus(true);
    }

    private endRectTransformation() {
        this.startCreateRectPoint = null;
        this.startResizeRectAnchor = null;
        EditorActions.setViewPortActionsDisabledStatus(false);
    }
}
