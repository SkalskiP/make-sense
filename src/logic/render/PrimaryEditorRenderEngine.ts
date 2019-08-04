import {IPoint} from "../../interfaces/IPoint";
import {DrawUtil} from "../../utils/DrawUtil";
import {Settings} from "../../settings/Settings";
import {IRect} from "../../interfaces/IRect";
import {BaseRenderEngine} from "./BaseRenderEngine";
import {RectUtil} from "../../utils/RectUtil";
import {CanvasUtil} from "../../utils/CanvasUtil";

export class PrimaryEditorRenderEngine extends BaseRenderEngine {
    private crossHairColor: string = Settings.CROSS_HAIR_COLOR;
    private crossHairThickness: number = Settings.CROSS_HAIR_THICKNESS_PX;

    // =================================================================================================================
    // STATE
    // =================================================================================================================

    private mousePosition: IPoint;

    public constructor(canvas: HTMLCanvasElement, imageRect: IRect) {
        super(canvas, imageRect);
    }

    // =================================================================================================================
    // EVENT HANDLERS
    // =================================================================================================================

    public mouseMoveHandler(event: MouseEvent): void {
        this.mousePosition = CanvasUtil.getMousePositionOnCanvasFromEvent(event, this.canvas);
    }

    public mouseDownHandler(event: MouseEvent): void {
        this.mousePosition = CanvasUtil.getMousePositionOnCanvasFromEvent(event, this.canvas);
    }

    public mouseUpHandler(event: MouseEvent): void {
        this.mousePosition = CanvasUtil.getMousePositionOnCanvasFromEvent(event, this.canvas);
    }

    // =================================================================================================================
    // RENDERING
    // =================================================================================================================

    public render(): void {
        // this.drawCrossHair();
    }

    public drawCrossHair(): void {
        if (!this.mousePosition || !this.canvas || !RectUtil.isPointInside(this.imageRectOnCanvas, this.mousePosition))
            return;

        const horizontalLineStart: IPoint = DrawUtil.setPointBetweenPixels({x: 0, y: this.mousePosition.y});
        const horizontalLineEnd: IPoint = DrawUtil.setPointBetweenPixels({x: this.canvas.width, y: this.mousePosition.y});
        DrawUtil.drawLine(this.canvas, horizontalLineStart, horizontalLineEnd, this.crossHairColor, this.crossHairThickness);

        const verticalLineStart: IPoint = DrawUtil.setPointBetweenPixels({x: this.mousePosition.x, y: 0});
        const verticalLineEnd: IPoint = DrawUtil.setPointBetweenPixels({x: this.mousePosition.x, y: this.canvas.height});
        DrawUtil.drawLine(this.canvas, verticalLineStart, verticalLineEnd, this.crossHairColor, this.crossHairThickness)
    }

    public drawImage(image: HTMLImageElement) {
        if (!!image && !!this.canvas) {
            const ctx = this.canvas.getContext("2d");
            ctx.drawImage(image, this.imageRectOnCanvas.x, this.imageRectOnCanvas.y, this.imageRectOnCanvas.width, this.imageRectOnCanvas.height);
        }
    }

    // =================================================================================================================
    // HELPERS
    // =================================================================================================================

    public updateImageRect(imageRect: IRect): void {
        this.imageRectOnCanvas = imageRect;
    }
}