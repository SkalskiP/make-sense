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

export class PolygonRenderEngine extends BaseRenderEngine {
    private config: RenderEngineConfig = new RenderEngineConfig();

    // =================================================================================================================
    // STATE
    // =================================================================================================================

    private activePath: IPoint[] = [];

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
            if(this.isInProgress()) {
                const isMouseOverStartAnchor: boolean = this.isMouseOverAnchor(data.mousePositionOnCanvas, this.activePath[0]);
                if (isMouseOverStartAnchor) {
                    this.addLabelAndFinishCreation(data);
                } else  {
                    this.updateActivelyCreatedLabel(data);
                }
            } else {
                this.updateActivelyCreatedLabel(data);
            }
        }
    }

    public mouseUpHandler(data: EditorData): void {}

    public mouseMoveHandler(data: EditorData): void {
        if (!!data.activeImageRectOnCanvas && !!data.mousePositionOnCanvas) {
            const isOverImage: boolean = RectUtil.isPointInside(data.activeImageRectOnCanvas, data.mousePositionOnCanvas);
            if (isOverImage && !this.isInProgress()) {
                const labelPolygon: LabelPolygon = this.getPolygonUnderMouse(data);
                if (!!labelPolygon) {
                    if (store.getState().editor.highlightedLabelId !== labelPolygon.id) {
                        store.dispatch(updateHighlightedLabelId(labelPolygon.id))
                    }
                } else {
                    if (store.getState().editor.highlightedLabelId !== null) {
                        store.dispatch(updateHighlightedLabelId(null))
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
            this.updateCursorStyle(data);
        }
    }

    private updateCursorStyle(data: EditorData) {
        if (!!this.canvas && !!data.mousePositionOnCanvas) {
            const isOverImage: boolean = RectUtil.isPointInside(data.activeImageRectOnCanvas, data.mousePositionOnCanvas);
            if (isOverImage) {
                if (this.isInProgress()) {
                    const isMouseOverStartAnchor: boolean = this.isMouseOverAnchor(data.mousePositionOnCanvas, this.activePath[0]);
                    if (isMouseOverStartAnchor)
                        store.dispatch(updateCustomcursorStyle(CustomCursorStyle.MOVE));
                    else
                        store.dispatch(updateCustomcursorStyle(CustomCursorStyle.DEFAULT));
                } else {
                    const anchorUnderMouse: IPoint = this.getAnchorUnderMouse(data);
                    if (!!anchorUnderMouse)
                        store.dispatch(updateCustomcursorStyle(CustomCursorStyle.MOVE));
                    else
                        store.dispatch(updateCustomcursorStyle(CustomCursorStyle.DEFAULT));
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

    private drawExistingLabels(data: EditorData) {
        const activeLabelId: string = store.getState().editor.activeLabelId;
        const highlightedLabelId: string = store.getState().editor.highlightedLabelId;
        const imageData: ImageData = EditorSelector.getActiveImageData();
        imageData.labelPolygons.forEach((labelPolygon: LabelPolygon) => {
            const isActive: boolean = labelPolygon.id === activeLabelId || labelPolygon.id === highlightedLabelId;
            const polygonOnCanvas: IPoint[] = labelPolygon.vertices.map((point: IPoint) => {
                return PointUtil.add(PointUtil.multiply(point, 1/data.activeImageScale), data.activeImageRectOnCanvas);
            });
            this.drawPolygon(polygonOnCanvas, isActive);
        });
    }

    private drawPolygon(polygon: IPoint[], isActive: boolean) {
        const color: string = isActive ? this.config.lineActiveColor : this.config.lineInactiveColor;
        const standardizedPoints: IPoint[] = polygon.map((point: IPoint) => DrawUtil.setPointBetweenPixels(point));
        DrawUtil.drawPolygon(this.canvas, standardizedPoints, color, this.config.lineThickness);
        if (isActive) {
            this.mapPointsToAnchors(standardizedPoints).forEach((handleRect: IRect) => {
                DrawUtil.drawRectWithFill(this.canvas, handleRect, this.config.activeAnchorColor);
            })
        }
    }

    // =================================================================================================================
    // HELPERS
    // =================================================================================================================

    private updateExistingLabel(data: EditorData) {}

    private updateActivelyCreatedLabel(data: EditorData) {
        if (this.isInProgress()) {
            const mousePositionSnapped: IPoint = RectUtil.snapPointToRect(data.mousePositionOnCanvas, data.activeImageRectOnCanvas);
            this.activePath.push(mousePositionSnapped);
        } else {
            const isMouseOverImage: boolean = RectUtil.isPointInside(data.activeImageRectOnCanvas,
                data.mousePositionOnCanvas);
            if (isMouseOverImage) {
                this.activePath.push(data.mousePositionOnCanvas);
            }
        }
    }

    private addLabelAndFinishCreation(data: EditorData) {
        const polygonOnCanvas: IPoint[] = this.activePath.concat(this.activePath[0]);
        const polygonOnImage: IPoint[] = polygonOnCanvas.map((point: IPoint) => PointUtil.multiply(PointUtil.subtract(
            point, data.activeImageRectOnCanvas), data.activeImageScale));
        this.addPolygonLabel(polygonOnImage);
        this.activePath = [];
    }

    private addPolygonLabel = (polygon: IPoint[]) => {
        const activeLabelIndex = store.getState().editor.activeLabelNameIndex;
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

    private cancelLabelCreation() {
        this.activePath = [];
    }

    public isInProgress(): boolean {
        return this.activePath !== null && this.activePath.length !== 0;
    }

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

    private isMouseOverAnchor(mouse: IPoint, anchor: IPoint): boolean {
        return RectUtil.isPointInside(RectUtil.getRectWithCenterAndSize(anchor, this.config.anchorSize), mouse);
    }

    private isMouseOverLine(mouse: IPoint, l: ILine): boolean {
        const minX: number = Math.min(l.start.x, l.end.x);
        const maxX: number = Math.max(l.start.x, l.end.x);
        const minY: number = Math.min(l.start.y, l.end.y);
        const maxY: number = Math.max(l.start.y, l.end.y);

        return (minX <= mouse.x && maxX >= mouse.x) &&
            (minY <= mouse.y && maxY >= mouse.y) &&
            LineUtil.getDistanceFromLine(l, mouse) < this.config.anchorHoverSize.width / 2;
    }

    private getPolygonUnderMouse(data: EditorData): LabelPolygon {
        const labelPolygons: LabelPolygon[] = EditorSelector.getActiveImageData().labelPolygons;
        for (let i = 0; i < labelPolygons.length; i++) {
            const pathOnCanvas: IPoint[] = labelPolygons[i].vertices.map((point: IPoint) =>
                PointUtil.add(PointUtil.multiply(point, 1/data.activeImageScale), data.activeImageRectOnCanvas));
            const linesOnCanvas: ILine[] = this.mapPointsToLines(pathOnCanvas);

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