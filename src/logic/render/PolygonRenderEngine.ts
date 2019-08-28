import {store} from "../../index";
import {RectUtil} from "../../utils/RectUtil";
import {updateCustomCursorStyle} from "../../store/general/actionCreators";
import {CustomCursorStyle} from "../../data/CustomCursorStyle";
import {EditorData} from "../../data/EditorData";
import {BaseRenderEngine} from "./BaseRenderEngine";
import {RenderEngineConfig} from "../../settings/RenderEngineConfig";
import {IPoint} from "../../interfaces/IPoint";
import {ILine} from "../../interfaces/ILine";
import {DrawUtil} from "../../utils/DrawUtil";
import {IRect} from "../../interfaces/IRect";
import {ImageData, LabelPolygon} from "../../store/editor/types";
import {EditorSelector} from "../../store/selectors/EditorSelector";
import uuidv1 from 'uuid/v1';
import {
    updateActiveLabelId,
    updateFirstLabelCreatedFlag,
    updateHighlightedLabelId,
    updateImageDataById
} from "../../store/editor/actionCreators";
import {LineUtil} from "../../utils/LineUtil";
import {MouseEventUtil} from "../../utils/MouseEventUtil";
import {EventType} from "../../data/EventType";
import {RenderEngineUtil} from "../../utils/RenderEngineUtil";

export class PolygonRenderEngine extends BaseRenderEngine {
    private config: RenderEngineConfig = new RenderEngineConfig();

    // =================================================================================================================
    // STATE
    // =================================================================================================================

    private activePath: IPoint[] = [];
    private resizeAnchorIndex: number = null;
    private suggestedAnchorPositionOnCanvas: IPoint = null;
    private suggestedAnchorIndexInPolygon: number = null;

    public constructor(canvas: HTMLCanvasElement) {
        super(canvas);
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
                case EventType.KEY_DOWN:
                    if ((data.event as KeyboardEvent).key === "Escape")
                        this.cancelLabelCreation();
                    else if ((data.event as KeyboardEvent).key === "Enter")
                        this.addLabelAndFinishCreation(data);
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
                const isMouseOverStartAnchor: boolean = this.isMouseOverAnchor(data.mousePositionOnCanvas, this.activePath[0]);
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
                            const anchorOnCanvas: IPoint = RenderEngineUtil.transferPointFromImageToCanvas(anchor, data);
                            if (this.isMouseOverAnchor(data.mousePositionOnCanvas, anchorOnCanvas)) {
                                return index;
                            }
                        }
                        return indexUnderMouse;
                    }, null);

                    if (anchorIndex !== null) {
                        this.startExistingLabelResize(data, polygonUnderMouse.id, anchorIndex);
                    } else {
                        const isMouseOverNewAnchor: boolean = this.isMouseOverAnchor(data.mousePositionOnCanvas, this.suggestedAnchorPositionOnCanvas);
                        if (isMouseOverNewAnchor) {
                            store.dispatch(updateActiveLabelId(polygonUnderMouse.id));
                            this.addSuggestedAnchorToPolygonLabel(data);
                        } else {
                            this.updateActivelyCreatedLabel(data);
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
        if (!!data.activeImageRectOnCanvas && !!data.mousePositionOnCanvas) {
            const isOverImage: boolean = RenderEngineUtil.isMouseOverImage(data);
            if (isOverImage && !this.isCreationInProgress()) {
                const labelPolygon: LabelPolygon = this.getPolygonUnderMouse(data);
                if (!!labelPolygon && !this.isResizeInProgress()) {
                    if (EditorSelector.getHighlightedLabelId() !== labelPolygon.id) {
                        store.dispatch(updateHighlightedLabelId(labelPolygon.id))
                    }
                    const pathOnCanvas: IPoint[] = RenderEngineUtil.transferPolygonFromImageToCanvas(labelPolygon.vertices, data);
                    const linesOnCanvas: ILine[] = this.mapPointsToLines(pathOnCanvas.concat(pathOnCanvas[0]));

                    for (let j = 0; j < linesOnCanvas.length; j++) {
                        if (this.isMouseOverLine(data.mousePositionOnCanvas, linesOnCanvas[j])) {
                            this.suggestedAnchorPositionOnCanvas = LineUtil.getCenter(linesOnCanvas[j]);
                            this.suggestedAnchorIndexInPolygon = j + 1;
                            break;
                        }
                    }
                } else {
                    if (EditorSelector.getHighlightedLabelId() !== null) {
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
        const imageData: ImageData = EditorSelector.getActiveImageData();
        if (imageData) {
            this.drawExistingLabels(data);
            this.drawActivelyCreatedLabel(data);
            this.drawActivelyResizeLabel(data);
            this.updateCursorStyle(data);
            this.drawSuggestedAnchor(data);
        }
    }

    private updateCursorStyle(data: EditorData) {
        if (!!this.canvas && !!data.mousePositionOnCanvas) {
            const isMouseOverCanvas: boolean = RenderEngineUtil.isMouseOverCanvas(data);
            if (isMouseOverCanvas) {
                if (this.isCreationInProgress()) {
                    const isMouseOverStartAnchor: boolean = this.isMouseOverAnchor(data.mousePositionOnCanvas, this.activePath[0]);
                    if (isMouseOverStartAnchor && this.activePath.length > 2)
                        store.dispatch(updateCustomCursorStyle(CustomCursorStyle.CLOSE));
                    else
                        store.dispatch(updateCustomCursorStyle(CustomCursorStyle.DEFAULT));
                } else {
                    const anchorUnderMouse: IPoint = this.getAnchorUnderMouse(data);
                    const isMouseOverNewAnchor: boolean = this.isMouseOverAnchor(data.mousePositionOnCanvas, this.suggestedAnchorPositionOnCanvas);
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
                this.canvas.style.cursor = "none";
            } else {
                this.canvas.style.cursor = "default";
            }
        }
    }

    private drawActivelyCreatedLabel(data: EditorData) {
        const standardizedPoints: IPoint[] = this.activePath.map((point: IPoint) => RenderEngineUtil.setPointBetweenPixels(point));
        const path = standardizedPoints.concat(data.mousePositionOnCanvas);
        const lines: ILine[] = this.mapPointsToLines(path);

        DrawUtil.drawPolygonWithFill(this.canvas, path, DrawUtil.hexToRGB(this.config.lineActiveColor, 0.2));
        lines.forEach((line: ILine) => {
            DrawUtil.drawLine(this.canvas, line.start, line.end, this.config.lineActiveColor, this.config.lineThickness);
        });
        this.mapPointsToAnchors(standardizedPoints).forEach((handleRect: IRect) => {
            DrawUtil.drawRectWithFill(this.canvas, handleRect, this.config.activeAnchorColor);
        })
    }

    private drawActivelyResizeLabel(data: EditorData) {
        const activeLabelPolygon: LabelPolygon = EditorSelector.getActivePolygonLabel();
        if (!!activeLabelPolygon && this.isResizeInProgress()) {
            const snappedMousePosition: IPoint = RectUtil.snapPointToRect(data.mousePositionOnCanvas, data.activeImageRectOnCanvas);
            const polygonOnCanvas: IPoint[] = activeLabelPolygon.vertices.map((point: IPoint, index: number) => {
                return index === this.resizeAnchorIndex ? snappedMousePosition : RenderEngineUtil.transferPointFromImageToCanvas(point, data);
            });
            this.drawPolygon(polygonOnCanvas, true);
        }
    }

    private drawExistingLabels(data: EditorData) {
        const activeLabelId: string = EditorSelector.getActiveLabelId();
        const highlightedLabelId: string = EditorSelector.getHighlightedLabelId();
        const imageData: ImageData = EditorSelector.getActiveImageData();
        imageData.labelPolygons.forEach((labelPolygon: LabelPolygon) => {
            const isActive: boolean = labelPolygon.id === activeLabelId || labelPolygon.id === highlightedLabelId;
            const pathOnCanvas: IPoint[] = RenderEngineUtil.transferPolygonFromImageToCanvas(labelPolygon.vertices, data);
            if (!(labelPolygon.id === activeLabelId && this.isResizeInProgress())) {
                this.drawPolygon(pathOnCanvas, isActive);
            }
        });
    }

    private drawPolygon(polygon: IPoint[], isActive: boolean) {
        const color: string = isActive ? this.config.lineActiveColor : this.config.lineInactiveColor;
        const standardizedPoints: IPoint[] = polygon.map((point: IPoint) => RenderEngineUtil.setPointBetweenPixels(point));
        if (isActive) {
            DrawUtil.drawPolygonWithFill(this.canvas, standardizedPoints, DrawUtil.hexToRGB(color, 0.2));
        }
        DrawUtil.drawPolygon(this.canvas, standardizedPoints, color, this.config.lineThickness);
        if (isActive) {
            this.mapPointsToAnchors(standardizedPoints).forEach((handleRect: IRect) => {
                DrawUtil.drawRectWithFill(this.canvas, handleRect, this.config.activeAnchorColor);
            })
        }
    }

    private drawSuggestedAnchor(data: EditorData) {
        if (this.suggestedAnchorPositionOnCanvas) {
            const suggestedAnchorRect: IRect = RectUtil
                .getRectWithCenterAndSize(this.suggestedAnchorPositionOnCanvas, this.config.suggestedAnchorDetectionSize);
            const isMouseOverSuggestedAnchor: boolean = RectUtil.isPointInside(suggestedAnchorRect, data.mousePositionOnCanvas);

            if (isMouseOverSuggestedAnchor) {
                const handleRect = RectUtil.getRectWithCenterAndSize(this.suggestedAnchorPositionOnCanvas, this.config.anchorSize);
                DrawUtil.drawRectWithFill(this.canvas, handleRect, this.config.lineInactiveColor);
            }
        }
    }

    // =================================================================================================================
    // CREATION
    // =================================================================================================================

    private updateActivelyCreatedLabel(data: EditorData) {
        if (this.isCreationInProgress()) {
            const mousePositionSnapped: IPoint = RectUtil.snapPointToRect(data.mousePositionOnCanvas, data.activeImageRectOnCanvas);
            this.activePath.push(mousePositionSnapped);
        } else {
            const isMouseOverImage: boolean = RectUtil.isPointInside(data.activeImageRectOnCanvas, data.mousePositionOnCanvas);
            if (isMouseOverImage) {
                this.activePath.push(data.mousePositionOnCanvas);
                store.dispatch(updateActiveLabelId(null));
            }
        }
    }

    private cancelLabelCreation() {
        this.activePath = [];
    }

    private finishLabelCreation() {
        this.activePath = [];
    }

    private addLabelAndFinishCreation(data: EditorData) {
        if (this.isCreationInProgress() && this.activePath.length > 2) {
            const polygonOnImage: IPoint[] = RenderEngineUtil.transferPolygonFromCanvasToImage(this.activePath, data);
            this.addPolygonLabel(polygonOnImage);
            this.finishLabelCreation();
        }
    }

    private addPolygonLabel(polygon: IPoint[]) {
        const activeLabelIndex = EditorSelector.getActiveLabelNameIndex();
        const imageData: ImageData = EditorSelector.getActiveImageData();
        const labelPolygon: LabelPolygon = {
            id: uuidv1(),
            labelIndex: activeLabelIndex,
            vertices: polygon
        };
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
    }

    private endExistingLabelResize(data: EditorData) {
        this.applyResizeToPolygonLabel(data);
        this.resizeAnchorIndex = null;
    }

    private applyResizeToPolygonLabel(data: EditorData) {
        const imageData: ImageData = EditorSelector.getActiveImageData();
        const activeLabel: LabelPolygon = EditorSelector.getActivePolygonLabel();
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
                                RectUtil.snapPointToRect(data.mousePositionOnCanvas, data.activeImageRectOnCanvas);
                            return RenderEngineUtil.transferPointFromCanvasToImage(snappedMousePosition, data);
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
        const imageData: ImageData = EditorSelector.getActiveImageData();
        const activeLabel: LabelPolygon = EditorSelector.getActivePolygonLabel();
        const newAnchorPositionOnImage: IPoint =
            RenderEngineUtil.transferPointFromCanvasToImage(this.suggestedAnchorPositionOnCanvas, data);
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
        return RectUtil.isPointInside(RectUtil.getRectWithCenterAndSize(anchor, this.config.anchorSize), mouse);
    }

    private isMouseOverLine(mouse: IPoint, l: ILine): boolean {
        const hoverReach: number = this.config.anchorHoverSize.width / 2;
        const minX: number = Math.min(l.start.x, l.end.x);
        const maxX: number = Math.max(l.start.x, l.end.x);
        const minY: number = Math.min(l.start.y, l.end.y);
        const maxY: number = Math.max(l.start.y, l.end.y);

        return (minX - hoverReach <= mouse.x && maxX + hoverReach >= mouse.x) &&
            (minY - hoverReach <= mouse.y && maxY + hoverReach >= mouse.y) &&
            LineUtil.getDistanceFromLine(l, mouse) < hoverReach;
    }

    // =================================================================================================================
    // MAPPERS
    // =================================================================================================================

    private mapPointsToLines(points: IPoint[]): ILine[] {
        const lines: ILine[] = [];
        for (let i = 0; i < points.length - 1; i++) {
            lines.push({start: points[i], end: points[i + 1]})
        }
        return lines;
    }

    private mapPointsToAnchors(points: IPoint[]): IRect[] {
        return points.map((point: IPoint) => RectUtil.getRectWithCenterAndSize(point, this.config.anchorSize));
    }

    // =================================================================================================================
    // GETTERS
    // =================================================================================================================

    private getPolygonUnderMouse(data: EditorData): LabelPolygon {
        const labelPolygons: LabelPolygon[] = EditorSelector.getActiveImageData().labelPolygons;
        for (let i = 0; i < labelPolygons.length; i++) {
            const pathOnCanvas: IPoint[] = RenderEngineUtil.transferPolygonFromImageToCanvas(labelPolygons[i].vertices, data);
            const linesOnCanvas: ILine[] = this.mapPointsToLines(pathOnCanvas.concat(pathOnCanvas[0]));

            for (let j = 0; j < linesOnCanvas.length; j++) {
                if (this.isMouseOverLine(data.mousePositionOnCanvas, linesOnCanvas[j]))
                    return labelPolygons[i];
            }
            for (let j = 0; j < pathOnCanvas.length; j ++) {
                if (this.isMouseOverAnchor(data.mousePositionOnCanvas, pathOnCanvas[j]))
                    return labelPolygons[i];
            }
        }
        return null;
    }

    private getAnchorUnderMouse(data: EditorData): IPoint {
        const labelPolygons: LabelPolygon[] = EditorSelector.getActiveImageData().labelPolygons;
        for (let i = 0; i < labelPolygons.length; i++) {
            const pathOnCanvas: IPoint[] = RenderEngineUtil.transferPolygonFromImageToCanvas(labelPolygons[i].vertices, data);
            for (let j = 0; j < pathOnCanvas.length; j ++) {
                if (this.isMouseOverAnchor(data.mousePositionOnCanvas, pathOnCanvas[j]))
                    return pathOnCanvas[j];
            }
        }
        return null;
    }
}