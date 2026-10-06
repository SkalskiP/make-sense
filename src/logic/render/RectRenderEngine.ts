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
import {confidenceText, isLowConfidence} from '../review/reviewWorkflow';
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
    private movingRect: { id: string; imageId: string; rect: IRect; point: IPoint };

    public constructor(canvas: HTMLCanvasElement) {
        super(canvas);
        this.labelType = LabelType.RECT;
    }

    // =================================================================================================================
    // EVENT HANDLERS
    // =================================================================================================================

    public mouseDownHandler = (data: EditorData) => {
        if ((data.event as MouseEvent)?.button > 0) return;
        const isMouseOverImage: boolean = RenderEngineUtil.isMouseOverImage(data);
        const isMouseOverCanvas: boolean = RenderEngineUtil.isMouseOverCanvas(data);
        if (isMouseOverCanvas) {
            const rectUnderMouse: LabelRect = (data.event as MouseEvent)?.shiftKey ? null : this.getRectUnderMouse(data);
            if (!!rectUnderMouse) {
                const rect: IRect = this.calculateRectRelativeToActiveImage(rectUnderMouse.rect, data);
                const anchorUnderMouse: RectAnchor = this.getAnchorUnderMouseByRect(rect, data.mousePositionOnViewPortContent, data.viewPortContentImageRect);
                if (!!anchorUnderMouse && rectUnderMouse.status === LabelStatus.ACCEPTED) {
                    store.dispatch(updateActiveLabelId(rectUnderMouse.id));
                    this.startRectResize(anchorUnderMouse);
                } else {
                    store.dispatch(updateActiveLabelId(rectUnderMouse.id));
                    if (rectUnderMouse.status === LabelStatus.ACCEPTED) {
                        this.movingRect = {
                            id: rectUnderMouse.id,
                            imageId: LabelsSelector.getActiveImageData().id,
                            rect: { ...rectUnderMouse.rect },
                            point: { ...data.mousePositionOnViewPortContent }
                        };
                        EditorActions.setViewPortActionsDisabledStatus(true);
                    }
                }
            } else if (isMouseOverImage) {

                this.startRectCreation(data.mousePositionOnViewPortContent);
            }
        }
    };

    public mouseUpHandler = (data: EditorData) => {
        if ((data.event as MouseEvent)?.button > 0) return;
        if (this.movingRect) {
            const imageData = LabelsSelector.getActiveImageData();
            if (imageData?.id === this.movingRect.imageId && data.viewPortContentImageRect) {
                const rect = this.getMovedRect(data);
                store.dispatch(updateImageDataById(imageData.id, {
                    ...imageData,
                    labelRects: imageData.labelRects.map(label => label.id === this.movingRect.id
                        ? { ...label, rect } : label)
                }));
            }
            this.endRectTransformation();
            return;
        }
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
            if (!this.isInProgress()) {
                const labelRect: LabelRect = isOverImage ? this.getRectUnderMouse(data) : null;
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
        this.renderRect(rectOnImage, displayAsActive, lineColor, anchorColor, labelRect.isCreatedByAI);
        this.renderLabelText(labelRect, rectOnImage, displayAsActive);
    }

    // Compact label above the box: name only for manual boxes, name plus
    // confidence for AI suggestions. Shown when selected/hovered, or always
    // for low-confidence predictions that need attention.
    private renderLabelText(labelRect: LabelRect, rectOnImage: IRect, emphasized: boolean) {
        if (!emphasized && !isLowConfidence(labelRect)) return;
        const names = LabelsSelector.getLabelNames();
        const name = names.find(label => label.id === labelRect.labelId)?.name ?? 'Unlabeled';
        const text = confidenceText(name, labelRect, true);
        const textSize = 12;
        DrawUtil.drawText(this.canvas, text, textSize,
            {x: rectOnImage.x + 4, y: Math.max(rectOnImage.y - 9, textSize)},
            '#ffffff', true, 'left', 'rgba(0,0,0,0.75)');
    }

    private drawActiveRect(labelRect: LabelRect, data: EditorData) {
        const sourceRect = this.movingRect?.id === labelRect.id ? this.getMovedRect(data) : labelRect.rect;
        let rect: IRect = this.calculateRectRelativeToActiveImage(sourceRect, data);
        if (!!this.startResizeRectAnchor) {
            const startAnchorPosition: IPoint = PointUtil.add(this.startResizeRectAnchor.position, data.viewPortContentImageRect);
            const endAnchorPositionSnapped: IPoint = RectUtil.snapPointToRect(data.mousePositionOnViewPortContent, data.viewPortContentImageRect);
            const delta = PointUtil.subtract(endAnchorPositionSnapped, startAnchorPosition);
            rect = RectUtil.resizeRect(rect, this.startResizeRectAnchor.type, delta);
        }
        const rectOnImage: IRect = RectUtil.translate(rect, data.viewPortContentImageRect);
        const lineColor: string = BaseRenderEngine.resolveLabelLineColor(labelRect.labelId, true)
        const anchorColor: string = BaseRenderEngine.resolveLabelAnchorColor(true);
        this.renderRect(rectOnImage, true, lineColor, anchorColor, labelRect.isCreatedByAI);
        this.renderLabelText(labelRect, rectOnImage, true);
    }

    private renderRect(rectOnImage: IRect, isActive: boolean, lineColor: string, anchorColor: string, isAIPrediction: boolean = false) {
        const rectBetweenPixels = RenderEngineUtil.setRectBetweenPixels(rectOnImage);
        DrawUtil.drawRectWithFill(this.canvas, rectBetweenPixels, DrawUtil.hexToRGB(lineColor, 0.06));
        DrawUtil.drawRect(this.canvas, rectBetweenPixels, lineColor, RenderEngineSettings.LINE_THICKNESS,
            isAIPrediction ? [7, 4] : []);
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
            if ((rectUnderMouse && rectUnderMouse.status === LabelStatus.ACCEPTED) || !!this.startResizeRectAnchor || !!this.movingRect) {
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
        return !!this.startCreateRectPoint || !!this.startResizeRectAnchor || !!this.movingRect;
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
        const labels = LabelsSelector.getActiveImageData()?.labelRects || [];
        const visible = labels.filter(label => label.isVisible);
        // Preserve access to the selected box's handles, even inside another box.
        const active = visible.find(label => label.id === LabelsSelector.getActiveLabelId());
        if (active && this.getAnchorUnderMouseByRect(
            this.calculateRectRelativeToActiveImage(active.rect, data),
            data.mousePositionOnViewPortContent, data.viewPortContentImageRect)) return active;
        // Small nested objects (e.g. wheels inside the cabin box) remain selectable.
        return visible.filter(label => {
            const rect = RenderEngineUtil.transferRectFromViewPortContentToImage(label.rect, data);
            return RectUtil.isPointInside(rect, data.mousePositionOnViewPortContent) ||
                this.isMouseOverRectEdges(label.rect, data);
        }).sort((a, b) => a.rect.width * a.rect.height - b.rect.width * b.rect.height)[0] || null;
    }

    private getMovedRect(data: EditorData): IRect {
        const { rect, point } = this.movingRect;
        const scale = RenderEngineUtil.calculateImageScale(data);
        const delta = PointUtil.subtract(data.mousePositionOnViewPortContent, point);
        return {
            ...rect,
            x: Math.max(0, Math.min(data.realImageSize.width - rect.width, rect.x + delta.x * scale)),
            y: Math.max(0, Math.min(data.realImageSize.height - rect.height, rect.y + delta.y * scale))
        };
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
        this.movingRect = null;
        this.startCreateRectPoint = null;
        this.startResizeRectAnchor = null;
        EditorActions.setViewPortActionsDisabledStatus(false);
    }
}
