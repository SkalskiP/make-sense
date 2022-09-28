import {store} from '../../index';
import {RectUtil} from '../../utils/RectUtil';
import {updateCustomCursorStyle} from '../../store/general/actionCreators';
import {CustomCursorStyle} from '../../data/enums/CustomCursorStyle';
import {EditorData} from '../../data/EditorData';
import {BaseRenderEngine} from './BaseRenderEngine';
import {RenderEngineSettings} from '../../settings/RenderEngineSettings';
import {IPoint} from '../../interfaces/IPoint';
import {ILine} from '../../interfaces/ILine';
import {DrawUtil} from '../../utils/DrawUtil';
import {IRect} from '../../interfaces/IRect';
import {ImageData, LabelPolygon} from '../../store/labels/types';
import {LabelsSelector} from '../../store/selectors/LabelsSelector';
import {
    updateActiveLabelId,
    updateFirstLabelCreatedFlag,
    updateHighlightedLabelId,
    updateImageDataById
} from '../../store/labels/actionCreators';
import {LineUtil} from '../../utils/LineUtil';
import {MouseEventUtil} from '../../utils/MouseEventUtil';
import {EventType} from '../../data/enums/EventType';
import {RenderEngineUtil} from '../../utils/RenderEngineUtil';
import {LabelType} from '../../data/enums/LabelType';
import {EditorActions} from '../actions/EditorActions';
import {GeneralSelector} from '../../store/selectors/GeneralSelector';
import {Settings} from '../../settings/Settings';
import {LabelUtil} from '../../utils/LabelUtil';
import {PolygonUtil} from '../../utils/PolygonUtil';

export class PolygonRenderEngine extends BaseRenderEngine {

    // =================================================================================================================
    // STATE
    // =================================================================================================================

    private activePath: IPoint[] = [];
    private resizeAnchorIndex: number = null;
    private suggestedAnchorPositionOnCanvas: IPoint = null;
    private suggestedAnchorIndexInPolygon: number = null;

    public constructor(canvas: HTMLCanvasElement) {
        super(canvas);
        this.labelType = LabelType.POLYGON;
    }

    // =================================================================================================================
    // EVENT HANDLERS
    // =================================================================================================================

    public update(data: EditorData): void {
        if (!!data.event) {
            switch (MouseEventUtil.getEventType(data.event)) {
                case EventType.MOUSE_MOVE:
                    this.mouseMoveHandler(data);
                    break;
                case EventType.MOUSE_UP:
                    this.mouseUpHandler(data);
                    break;
                case EventType.MOUSE_DOWN:
                    this.mouseDownHandler(data);
                    break;
                default:
                    break;
            }
        }
    }

    public mouseDownHandler(data: EditorData): void {
        const isMouseOverCanvas: boolean = RenderEngineUtil.isMouseOverCanvas(data);
        if (isMouseOverCanvas) {
            if (this.isCreationInProgress()) {
                const isMouseOverStartAnchor: boolean = this.isMouseOverAnchor(
                    data.mousePositionOnViewPortContent, this.activePath[0]);
                if (isMouseOverStartAnchor) {
                    this.addLabelAndFinishCreation(data);
                } else  {
                    this.updateActivelyCreatedLabel(data);
                }
            } else {
                const polygonUnderMouse: LabelPolygon = this.getPolygonUnderMouse(data);
                if (!!polygonUnderMouse) {
                    const anchorIndex: number = polygonUnderMouse.vertices.reduce(
                        (indexUnderMouse: number, anchor: IPoint, index: number) => {
                        if (indexUnderMouse === null) {
                            const anchorOnCanvas: IPoint = RenderEngineUtil.transferPointFromImageToViewPortContent(anchor, data);
                            if (this.isMouseOverAnchor(data.mousePositionOnViewPortContent, anchorOnCanvas)) {
                                return index;
                            }
                        }
                        return indexUnderMouse;
                    }, null);

                    if (anchorIndex !== null) {
                        this.startExistingLabelResize(data, polygonUnderMouse.id, anchorIndex);
                    } else {
                        store.dispatch(updateActiveLabelId(polygonUnderMouse.id));
                        const isMouseOverNewAnchor: boolean = this.isMouseOverAnchor(data.mousePositionOnViewPortContent, this.suggestedAnchorPositionOnCanvas);
                        if (isMouseOverNewAnchor) {
                            this.addSuggestedAnchorToPolygonLabel(data);
                        }
                    }
                } else {
                    this.updateActivelyCreatedLabel(data);
                }
            }
        }
    }

    public mouseUpHandler(data: EditorData): void {
        if (this.isResizeInProgress())
            this.endExistingLabelResize(data);
    }

    public mouseMoveHandler(data: EditorData): void {
        if (!!data.viewPortContentImageRect && !!data.mousePositionOnViewPortContent) {
            const isOverImage: boolean = RenderEngineUtil.isMouseOverImage(data);
            if (isOverImage && !this.isCreationInProgress()) {
                const labelPolygon: LabelPolygon = this.getPolygonUnderMouse(data);
                if (!!labelPolygon && !this.isResizeInProgress()) {
                    if (LabelsSelector.getHighlightedLabelId() !== labelPolygon.id) {
                        store.dispatch(updateHighlightedLabelId(labelPolygon.id))
                    }
                    const pathOnCanvas: IPoint[] = RenderEngineUtil.transferPolygonFromImageToViewPortContent(labelPolygon.vertices, data);
                    const linesOnCanvas: ILine[] = PolygonUtil.getEdges(pathOnCanvas);

                    for (let j = 0; j < linesOnCanvas.length; j++) {
                        const mouseOverLine = RenderEngineUtil.isMouseOverLine(
                            data.mousePositionOnViewPortContent,
                            linesOnCanvas[j],
                            RenderEngineSettings.anchorHoverSize.width / 2
                        )
                        if (mouseOverLine) {
                            this.suggestedAnchorPositionOnCanvas = LineUtil.getCenter(linesOnCanvas[j]);
                            this.suggestedAnchorIndexInPolygon = j + 1;
                            break;
                        }
                    }
                } else {
                    if (LabelsSelector.getHighlightedLabelId() !== null) {
                        store.dispatch(updateHighlightedLabelId(null));
                        this.discardSuggestedPoint();
                    }
                }
            }
        }
    }

    // =================================================================================================================
    // RENDERING
    // =================================================================================================================

    public render(data: EditorData): void {
        const imageData: ImageData = LabelsSelector.getActiveImageData();
        if (imageData) {
            this.drawExistingLabels(data);
            this.drawActivelyCreatedLabel(data);
            this.drawActivelyResizeLabel(data);
            this.updateCursorStyle(data);
            this.drawSuggestedAnchor(data);
        }
    }

    private updateCursorStyle(data: EditorData) {
        if (!!this.canvas && !!data.mousePositionOnViewPortContent && !GeneralSelector.getImageDragModeStatus()) {
            const isMouseOverCanvas: boolean = RenderEngineUtil.isMouseOverCanvas(data);
            if (isMouseOverCanvas) {
                if (this.isCreationInProgress()) {
                    const isMouseOverStartAnchor: boolean = this.isMouseOverAnchor(data.mousePositionOnViewPortContent, this.activePath[0]);
                    if (isMouseOverStartAnchor && this.activePath.length > 2)
                        store.dispatch(updateCustomCursorStyle(CustomCursorStyle.CLOSE));
                    else
                        store.dispatch(updateCustomCursorStyle(CustomCursorStyle.DEFAULT));
                } else {
                    const anchorUnderMouse: IPoint = this.getAnchorUnderMouse(data);
                    const isMouseOverNewAnchor: boolean = this.isMouseOverAnchor(data.mousePositionOnViewPortContent, this.suggestedAnchorPositionOnCanvas);
                    if (!!isMouseOverNewAnchor) {
                        store.dispatch(updateCustomCursorStyle(CustomCursorStyle.ADD));
                    } else if (this.isResizeInProgress()) {
                        store.dispatch(updateCustomCursorStyle(CustomCursorStyle.MOVE));
                    } else if (!!anchorUnderMouse) {
                        store.dispatch(updateCustomCursorStyle(CustomCursorStyle.MOVE));
                    } else {
                        RenderEngineUtil.wrapDefaultCursorStyleInCancel(data);
                    }
                }
                this.canvas.style.cursor = 'none';
            } else {
                this.canvas.style.cursor = 'default';
            }
        }
    }

    private drawActivelyCreatedLabel(data: EditorData) {
        const standardizedPoints: IPoint[] = this.activePath.map((point: IPoint) => RenderEngineUtil.setPointBetweenPixels(point));
        const path = standardizedPoints.concat(data.mousePositionOnViewPortContent);
        const lines: ILine[] = PolygonUtil.getEdges(path, false);
        const lineColor: string = BaseRenderEngine.resolveLabelLineColor(null, true)
        const anchorColor: string = BaseRenderEngine.resolveLabelAnchorColor(true)
        DrawUtil.drawPolygonWithFill(this.canvas, path, DrawUtil.hexToRGB(lineColor, 0.2));
        lines.forEach((line: ILine) => {
            DrawUtil.drawLine(this.canvas, line.start, line.end, lineColor, RenderEngineSettings.LINE_THICKNESS);
        });
        standardizedPoints.forEach((point: IPoint) => {
            DrawUtil.drawCircleWithFill(this.canvas, point, Settings.RESIZE_HANDLE_DIMENSION_PX/2, anchorColor);
        })
    }

    private drawActivelyResizeLabel(data: EditorData) {
        const activeLabelPolygon: LabelPolygon = LabelsSelector.getActivePolygonLabel();
        if (!!activeLabelPolygon && this.isResizeInProgress()) {
            const snappedMousePosition: IPoint = RectUtil.snapPointToRect(data.mousePositionOnViewPortContent, data.viewPortContentImageRect);
            const polygonOnCanvas: IPoint[] = activeLabelPolygon.vertices.map((point: IPoint, index: number) => {
                return index === this.resizeAnchorIndex ? snappedMousePosition : RenderEngineUtil.transferPointFromImageToViewPortContent(point, data);
            });
            this.drawPolygon(activeLabelPolygon.labelId, polygonOnCanvas, true);
        }
    }

    private drawExistingLabels(data: EditorData) {
        const activeLabelId: string = LabelsSelector.getActiveLabelId();
        const highlightedLabelId: string = LabelsSelector.getHighlightedLabelId();
        const imageData: ImageData = LabelsSelector.getActiveImageData();
        imageData.labelPolygons.forEach((labelPolygon: LabelPolygon) => {
            if (labelPolygon.isVisible) {
                const isActive: boolean = labelPolygon.id === activeLabelId || labelPolygon.id === highlightedLabelId;
                const pathOnCanvas: IPoint[] = RenderEngineUtil.transferPolygonFromImageToViewPortContent(labelPolygon.vertices, data);
                if (!(labelPolygon.id === activeLabelId && this.isResizeInProgress())) {
                    this.drawPolygon(labelPolygon.labelId, pathOnCanvas, isActive);
                }
            }
        });
    }

    private drawPolygon(labelId: string | null, polygon: IPoint[], isActive: boolean) {
        const lineColor: string = BaseRenderEngine.resolveLabelLineColor(labelId, true)
        const anchorColor: string = BaseRenderEngine.resolveLabelAnchorColor(true)
        const standardizedPoints: IPoint[] = polygon.map((point: IPoint) => RenderEngineUtil.setPointBetweenPixels(point));
        if (isActive) {
            DrawUtil.drawPolygonWithFill(this.canvas, standardizedPoints, DrawUtil.hexToRGB(lineColor, 0.2));
        }
        DrawUtil.drawPolygon(this.canvas, standardizedPoints, lineColor, RenderEngineSettings.LINE_THICKNESS);
        if (isActive) {
            standardizedPoints.forEach((point: IPoint) => {
                DrawUtil.drawCircleWithFill(this.canvas, point, Settings.RESIZE_HANDLE_DIMENSION_PX/2, anchorColor);
            })
        }
    }

    private drawSuggestedAnchor(data: EditorData) {
        const anchorColor: string = BaseRenderEngine.resolveLabelAnchorColor(true)
        if (this.suggestedAnchorPositionOnCanvas) {
            const suggestedAnchorRect: IRect = RectUtil
                .getRectWithCenterAndSize(this.suggestedAnchorPositionOnCanvas, RenderEngineSettings.suggestedAnchorDetectionSize);
            const isMouseOverSuggestedAnchor: boolean = RectUtil.isPointInside(suggestedAnchorRect, data.mousePositionOnViewPortContent);

            if (isMouseOverSuggestedAnchor) {
                DrawUtil.drawCircleWithFill(
                    this.canvas, this.suggestedAnchorPositionOnCanvas, Settings.RESIZE_HANDLE_DIMENSION_PX/2, anchorColor);
            }
        }
    }

    // =================================================================================================================
    // CREATION
    // =================================================================================================================

    private updateActivelyCreatedLabel(data: EditorData) {
        if (this.isCreationInProgress()) {
            const mousePositionSnapped: IPoint = RectUtil.snapPointToRect(data.mousePositionOnViewPortContent, data.viewPortContentImageRect);
            this.activePath.push(mousePositionSnapped);
        } else {
            const isMouseOverImage: boolean = RectUtil.isPointInside(data.viewPortContentImageRect, data.mousePositionOnViewPortContent);
            if (isMouseOverImage) {
                EditorActions.setViewPortActionsDisabledStatus(true);
                this.activePath.push(data.mousePositionOnViewPortContent);
                store.dispatch(updateActiveLabelId(null));
            }
        }
    }

    public cancelLabelCreation() {
        this.activePath = [];
        EditorActions.setViewPortActionsDisabledStatus(false);
    }

    private finishLabelCreation() {
        this.activePath = [];
        EditorActions.setViewPortActionsDisabledStatus(false);
    }

    public addLabelAndFinishCreation(data: EditorData) {
        if (this.isCreationInProgress() && this.activePath.length > 2) {
            const polygonOnImage: IPoint[] = RenderEngineUtil.transferPolygonFromViewPortContentToImage(this.activePath, data);
            this.addPolygonLabel(polygonOnImage);
            this.finishLabelCreation();
        }
    }

    private addPolygonLabel(polygon: IPoint[]) {
        const activeLabelId = LabelsSelector.getActiveLabelNameId();
        const imageData: ImageData = LabelsSelector.getActiveImageData();
        const labelPolygon: LabelPolygon = LabelUtil.createLabelPolygon(activeLabelId, polygon);
        imageData.labelPolygons.push(labelPolygon);
        store.dispatch(updateImageDataById(imageData.id, imageData));
        store.dispatch(updateFirstLabelCreatedFlag(true));
        store.dispatch(updateActiveLabelId(labelPolygon.id));
    };

    // =================================================================================================================
    // TRANSFER
    // =================================================================================================================

    private startExistingLabelResize(data: EditorData, labelId: string, anchorIndex: number) {
        store.dispatch(updateActiveLabelId(labelId));
        this.resizeAnchorIndex = anchorIndex;
        EditorActions.setViewPortActionsDisabledStatus(true);
    }

    private endExistingLabelResize(data: EditorData) {
        this.applyResizeToPolygonLabel(data);
        this.resizeAnchorIndex = null;
        EditorActions.setViewPortActionsDisabledStatus(false);
    }

    private applyResizeToPolygonLabel(data: EditorData) {
        const imageData: ImageData = LabelsSelector.getActiveImageData();
        const activeLabel: LabelPolygon = LabelsSelector.getActivePolygonLabel();
        imageData.labelPolygons = imageData.labelPolygons.map((polygon: LabelPolygon) => {
            if (polygon.id !== activeLabel.id) {
                return polygon
            } else {
                return {
                    ...polygon,
                    vertices: polygon.vertices.map((value: IPoint, index: number) => {
                        if (index !== this.resizeAnchorIndex) {
                            return value;
                        } else {
                            const snappedMousePosition: IPoint =
                                RectUtil.snapPointToRect(data.mousePositionOnViewPortContent, data.viewPortContentImageRect);
                            return RenderEngineUtil.transferPointFromViewPortContentToImage(snappedMousePosition, data);
                        }
                    })
                }
            }
        });
        store.dispatch(updateImageDataById(imageData.id, imageData));
        store.dispatch(updateActiveLabelId(activeLabel.id));
    }

    private discardSuggestedPoint(): void {
        this.suggestedAnchorIndexInPolygon = null;
        this.suggestedAnchorPositionOnCanvas = null;
    }

    // =================================================================================================================
    // UPDATE
    // =================================================================================================================

    private addSuggestedAnchorToPolygonLabel(data: EditorData) {
        const imageData: ImageData = LabelsSelector.getActiveImageData();
        const activeLabel: LabelPolygon = LabelsSelector.getActivePolygonLabel();
        const newAnchorPositionOnImage: IPoint =
            RenderEngineUtil.transferPointFromViewPortContentToImage(this.suggestedAnchorPositionOnCanvas, data);
        const insert = (arr, index, newItem) => [...arr.slice(0, index), newItem, ...arr.slice(index)];

        const newImageData: ImageData = {
            ...imageData,
            labelPolygons: imageData.labelPolygons.map((polygon: LabelPolygon) => {
                if (polygon.id !== activeLabel.id) {
                    return polygon
                } else {
                    return {
                        ...polygon,
                        vertices: insert(polygon.vertices, this.suggestedAnchorIndexInPolygon, newAnchorPositionOnImage)
                    }
                }
            })
        };

        store.dispatch(updateImageDataById(newImageData.id, newImageData));
        this.startExistingLabelResize(data, activeLabel.id, this.suggestedAnchorIndexInPolygon);
        this.discardSuggestedPoint();
    }

    // =================================================================================================================
    // VALIDATORS
    // =================================================================================================================

    public isInProgress(): boolean {
        return this.isCreationInProgress() || this.isResizeInProgress();
    }

    private isCreationInProgress(): boolean {
        return this.activePath !== null && this.activePath.length !== 0;
    }

    private isResizeInProgress(): boolean {
        return this.resizeAnchorIndex !== null;
    }

    private isMouseOverAnchor(mouse: IPoint, anchor: IPoint): boolean {
        if (!mouse || !anchor) return null;
        return RectUtil.isPointInside(RectUtil.getRectWithCenterAndSize(anchor, RenderEngineSettings.anchorSize), mouse);
    }

    // =================================================================================================================
    // GETTERS
    // =================================================================================================================

    private getPolygonUnderMouse(data: EditorData): LabelPolygon | null {
        const mouseOnCanvas = data.mousePositionOnViewPortContent;
        if (!mouseOnCanvas) return null;

        const labelPolygons: LabelPolygon[] = LabelsSelector
            .getActiveImageData()
            .labelPolygons
            .filter((labelPolygon: LabelPolygon) => labelPolygon.isVisible);
        const radius = RenderEngineSettings.anchorHoverSize.width / 2;

        for (const labelPolygon of labelPolygons) {
            const verticesOnCanvas = RenderEngineUtil
                .transferPolygonFromImageToViewPortContent(labelPolygon.vertices, data);
            if (RenderEngineUtil.isMouseOverPolygon(mouseOnCanvas, verticesOnCanvas, radius)) {
                return labelPolygon;
            }
        }
        return null;
    }

    private getAnchorUnderMouse(data: EditorData): IPoint | null {
        const mouseOnCanvas = data.mousePositionOnViewPortContent;
        if (!mouseOnCanvas) return null;

        const labelPolygons: LabelPolygon[] = LabelsSelector
            .getActiveImageData()
            .labelPolygons
            .filter((labelPolygon: LabelPolygon) => labelPolygon.isVisible);
        const radius = RenderEngineSettings.anchorHoverSize.width / 2;

        for (const labelPolygon of labelPolygons) {
            const verticesOnCanvas = RenderEngineUtil
                .transferPolygonFromImageToViewPortContent(labelPolygon.vertices, data);
            for (const vertexOnCanvas of verticesOnCanvas) {
                if (RenderEngineUtil.isMouseOverAnchor(mouseOnCanvas, vertexOnCanvas, radius)) return vertexOnCanvas;
            }
        }
        return null;
    }
}
