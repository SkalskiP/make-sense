import {store} from "../../index";
import {RectUtil} from "../../utils/RectUtil";
import {updateCustomcursorStyle} from "../../store/general/actionCreators";
import {CustomCursorStyle} from "../../data/CustomCursorStyle";
import {EditorData} from "../../data/EditorData";
import {BaseRenderEngine} from "./BaseRenderEngine";
import {RenderEngineConfig} from "../../settings/RenderEngineConfig";
import {IPoint} from "../../interfaces/IPoint";
import {CanvasUtil} from "../../utils/CanvasUtil";
import {ILine} from "../../interfaces/ILine";
import {DrawUtil} from "../../utils/DrawUtil";
import {IRect} from "../../interfaces/IRect";
import {PointUtil} from "../../utils/PointUtil";
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
import {RenderEngineUtil} from "../../utils/RenderEngineUtil";

export class PolygonRenderEngine extends BaseRenderEngine {
    private config: RenderEngineConfig = new RenderEngineConfig();

    // =================================================================================================================
    // STATE
    // =================================================================================================================

    private activePath: IPoint[] = [];
    private resizeAnchorIndex: number = null;
    private newAnchorPositionOnCanvas: IPoint = null;
    private newAnchorIndexInPolygon: number = null;

    public constructor(canvas: HTMLCanvasElement) {
        super(canvas);
    }

    // =================================================================================================================
    // EVENT HANDLERS
    // =================================================================================================================

    public mouseDownHandler(data: EditorData): void {
        const isMouseOverCanvas: boolean = RectUtil.isPointInside({x: 0, y: 0, ...CanvasUtil.getSize(this.canvas)},
            data.mousePositionOnCanvas);

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
                            const anchorOnImage: IPoint = PointUtil.add(
                                PointUtil.multiply(anchor, 1/data.activeImageScale), data.activeImageRectOnCanvas);
                            if (this.isMouseOverAnchor(data.mousePositionOnCanvas, anchorOnImage)) {
                                return index;
                            }
                        }
                        return indexUnderMouse;
                    }, null);

                    if (anchorIndex !== null) {
                        this.startExistingLabelResize(data, polygonUnderMouse.id, anchorIndex);
                    } else {
                        const isMouseOverNewAnchor: boolean = this.isMouseOverAnchor(data.mousePositionOnCanvas, this.newAnchorPositionOnCanvas);
                        if (isMouseOverNewAnchor) {
                            store.dispatch(updateActiveLabelId(polygonUnderMouse.id));
                            this.addNewAnchorToExistingPolygon(data);
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
            const isOverImage: boolean = RectUtil.isPointInside(data.activeImageRectOnCanvas, data.mousePositionOnCanvas);
            if (isOverImage && !this.isCreationInProgress()) {
                const labelPolygon: LabelPolygon = this.getPolygonUnderMouse(data);
                if (!!labelPolygon && !this.isResizeInProgress()) {
                    if (EditorSelector.getHighlightedLabelId() !== labelPolygon.id) {
                        store.dispatch(updateHighlightedLabelId(labelPolygon.id))
                    }
                    const pathOnCanvas: IPoint[] = labelPolygon.vertices.map((point: IPoint) =>
                        PointUtil.add(PointUtil.multiply(point, 1/data.activeImageScale), data.activeImageRectOnCanvas));
                    const linesOnCanvas: ILine[] = this.mapPointsToLines(pathOnCanvas.concat(pathOnCanvas[0]));

                    for (let j = 0; j < linesOnCanvas.length; j++) {
                        if (this.isMouseOverLine(data.mousePositionOnCanvas, linesOnCanvas[j])) {
                            this.newAnchorPositionOnCanvas = LineUtil.getCenter(linesOnCanvas[j]);
                            this.newAnchorIndexInPolygon = j + 1;
                            break;
                        }
                    }
                } else {
                    if (EditorSelector.getHighlightedLabelId() !== null) {
                        store.dispatch(updateHighlightedLabelId(null));
                        this.newAnchorPositionOnCanvas = null;
                        this.newAnchorIndexInPolygon = null;
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
            this.drawActivelyResizedLabel(data);
            this.updateCursorStyle(data);
            this.drawPotentialNewAnchor(data);
        }
    }

    private updateCursorStyle(data: EditorData) {
        if (!!this.canvas && !!data.mousePositionOnCanvas) {
            if (RectUtil.isPointInside({x: 0, y: 0, ...CanvasUtil.getSize(this.canvas)}, data.mousePositionOnCanvas)) {
                if (this.isCreationInProgress()) {
                    const isMouseOverStartAnchor: boolean = this.isMouseOverAnchor(data.mousePositionOnCanvas, this.activePath[0]);
                    if (isMouseOverStartAnchor)
                        store.dispatch(updateCustomcursorStyle(CustomCursorStyle.CLOSE));
                    else
                        store.dispatch(updateCustomcursorStyle(CustomCursorStyle.DEFAULT));
                } else {
                    const anchorUnderMouse: IPoint = this.getAnchorUnderMouse(data);
                    const isMouseOverNewAnchor: boolean = this.isMouseOverAnchor(data.mousePositionOnCanvas, this.newAnchorPositionOnCanvas);
                    if (!!isMouseOverNewAnchor) {
                        store.dispatch(updateCustomcursorStyle(CustomCursorStyle.ADD));
                    } else if (this.isResizeInProgress()) {
                        store.dispatch(updateCustomcursorStyle(CustomCursorStyle.MOVE));
                    } else if (!!anchorUnderMouse) {
                        store.dispatch(updateCustomcursorStyle(CustomCursorStyle.MOVE));
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
        const standardizedPoints: IPoint[] = this.activePath.map((point: IPoint) => DrawUtil.setPointBetweenPixels(point));
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

    private drawActivelyResizedLabel(data: EditorData) {
        const activeLabelPolygon: LabelPolygon = EditorSelector.getActivePolygonLabel();
        if (!!activeLabelPolygon && this.isResizeInProgress()) {
            const snappedMousePosition: IPoint = RectUtil.snapPointToRect(data.mousePositionOnCanvas, data.activeImageRectOnCanvas);
            const polygonOnCanvas: IPoint[] = activeLabelPolygon.vertices.map((point: IPoint, index: number) => {
                return index === this.resizeAnchorIndex ? snappedMousePosition :
                    PointUtil.add(PointUtil.multiply(point, 1/data.activeImageScale), data.activeImageRectOnCanvas);
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
            const polygonOnCanvas: IPoint[] = labelPolygon.vertices.map((point: IPoint) => {
                return PointUtil.add(PointUtil.multiply(point, 1/data.activeImageScale), data.activeImageRectOnCanvas);
            });
            if (!(labelPolygon.id === activeLabelId && this.isResizeInProgress())) {
                this.drawPolygon(polygonOnCanvas, isActive);
            }
        });

    }

    private drawPolygon(polygon: IPoint[], isActive: boolean) {
        const color: string = isActive ? this.config.lineActiveColor : this.config.lineInactiveColor;
        const standardizedPoints: IPoint[] = polygon.map((point: IPoint) => DrawUtil.setPointBetweenPixels(point));
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

    private drawPotentialNewAnchor(data: EditorData) {
        if (this.newAnchorPositionOnCanvas) {
            const a = RectUtil.isPointInside(RectUtil.getRectWithCenterAndSize(this.newAnchorPositionOnCanvas, {width: 100, height: 100}), data.mousePositionOnCanvas)
            if (a) {
                const handleRect = RectUtil.getRectWithCenterAndSize(this.newAnchorPositionOnCanvas, this.config.anchorSize);
                DrawUtil.drawRectWithFill(this.canvas, handleRect, this.config.activeAnchorColor);
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
            const isMouseOverImage: boolean = RectUtil.isPointInside(data.activeImageRectOnCanvas,
                data.mousePositionOnCanvas);
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
        const polygonOnImage: IPoint[] = this.activePath.map((point: IPoint) => PointUtil.multiply(PointUtil.subtract(
            point, data.activeImageRectOnCanvas), data.activeImageScale));
        this.addPolygonLabel(polygonOnImage);
        this.finishLabelCreation();
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
    // RESIZE
    // =================================================================================================================

    private startExistingLabelResize(data: EditorData, labelId: string, anchorIndex: number) {
        store.dispatch(updateActiveLabelId(labelId));
        this.resizeAnchorIndex = anchorIndex;
    }

    private endExistingLabelResize(data: EditorData) {
        this.updatePolygonLabel(data);
        this.resizeAnchorIndex = null;
    }

    private updatePolygonLabel(data: EditorData) {
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
                            return PointUtil.multiply(PointUtil.subtract(
                                snappedMousePosition, data.activeImageRectOnCanvas), data.activeImageScale)
                        }
                    })
                }
            }
        });
        store.dispatch(updateImageDataById(imageData.id, imageData));
        store.dispatch(updateActiveLabelId(activeLabel.id));
    }

    // =================================================================================================================
    // UPDATE
    // =================================================================================================================

    private addNewAnchorToExistingPolygon(data: EditorData) {
        const imageData: ImageData = EditorSelector.getActiveImageData();
        const activeLabel: LabelPolygon = EditorSelector.getActivePolygonLabel();

        const newAnchorPositionOnImage: IPoint = PointUtil.multiply(PointUtil.subtract(
            this.newAnchorPositionOnCanvas, data.activeImageRectOnCanvas), data.activeImageScale);

        const insert = (arr, index, newItem) => [...arr.slice(0, index), newItem, ...arr.slice(index)];

        const newImageData = {
            ...imageData,
            labelPolygons: imageData.labelPolygons.map((polygon: LabelPolygon) => {
                if (polygon.id !== activeLabel.id) {
                    return polygon
                } else {
                    return {
                        ...polygon,
                        vertices: insert(polygon.vertices, this.newAnchorIndexInPolygon, newAnchorPositionOnImage)
                    }
                }
            })
        };

        store.dispatch(updateImageDataById(newImageData.id, newImageData));
        this.startExistingLabelResize(data, activeLabel.id, this.newAnchorIndexInPolygon);

        this.newAnchorIndexInPolygon = null;
        this.newAnchorPositionOnCanvas = null;
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
            const pathOnCanvas: IPoint[] = labelPolygons[i].vertices.map((point: IPoint) =>
                PointUtil.add(PointUtil.multiply(point, 1/data.activeImageScale), data.activeImageRectOnCanvas));
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
            const pathOnCanvas: IPoint[] = labelPolygons[i].vertices.map((point: IPoint) =>
                PointUtil.add(PointUtil.multiply(point, 1/data.activeImageScale), data.activeImageRectOnCanvas));

            for (let j = 0; j < pathOnCanvas.length; j ++) {
                if (this.isMouseOverAnchor(data.mousePositionOnCanvas, pathOnCanvas[j]))
                    return pathOnCanvas[j];
            }
        }
        return null;
    }
}