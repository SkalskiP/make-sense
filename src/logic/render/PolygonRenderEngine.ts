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
            this.updateActivelyCreatedLabel(data);
        }
    }

    public mouseUpHandler(data: EditorData): void {}

    public mouseMoveHandler(data: EditorData): void {}

    // =================================================================================================================
    // RENDERING
    // =================================================================================================================

    public render(data: EditorData): void {
        this.drawActivelyCreatedLabel(data);
        this.updateCursorStyle(data);
    }

    private updateCursorStyle(data: EditorData) {
        if (!!this.canvas && !!data.mousePositionOnCanvas) {
            if (RectUtil.isPointInside(data.activeImageRectOnCanvas, data.mousePositionOnCanvas)) {
                store.dispatch(updateCustomcursorStyle(CustomCursorStyle.DEFAULT));
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

        DrawUtil.drawPolygon(this.canvas, path, DrawUtil.hexToRGB(this.config.lineActiveColor, 0.2));

        lines.forEach((line: ILine) => {
            DrawUtil.drawLine(this.canvas, line.start, line.end, this.config.lineActiveColor, this.config.lineThickness);
        });

        this.mapPoinsToAnchors(standardizedPoints).forEach((handleRect: IRect) => {
            DrawUtil.drawRectWithFill(this.canvas, handleRect, this.config.activeAnchorColor);
        })
    }

    // private drawPolygon(polygon: IPoint[], isActive: boolean) {
    //     const color: string = isActive ? this.config.lineActiveColor : this.config.lineInactiveColor;
    //     const standardizedPoints: IPoint[] = polygon.map((point: IPoint) => DrawUtil.setPointBetweenPixels(point));
    //     const standardizedLines: ILine[] = this.mapPointsToLines(standardizedPoints);
    //     standardizedLines.forEach((line: ILine) => {
    //         DrawUtil.drawLine(this.canvas, line.start, line.end, color, this.config.lineThickness);
    //     });
    // }

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

    private addLabelAndFinishCreation(point: IPoint, data: EditorData) {
        this.activePath = [];
    }

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

    private mapPoinsToAnchors(points: IPoint[]): IRect[] {
        return points.map((point: IPoint) => RectUtil.getRectWithCenterAndSize(point, this.config.anchorSize));
    }
}