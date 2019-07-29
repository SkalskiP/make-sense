import {BaseRenderEngine} from "./BaseRenderEngine";
import {IRect} from "../../interfaces/IRect";
import {RenderEngineConfig} from "../../settings/RenderEngineConfig";
import {IPoint} from "../../interfaces/IPoint";
import {CanvasUtil} from "../../utils/CanvasUtil";

export class PointRenderEngine extends BaseRenderEngine {
    private readonly canvas: HTMLCanvasElement;
    private config: RenderEngineConfig = new RenderEngineConfig();

    // =================================================================================================================
    // STATE
    // =================================================================================================================

    private mousePosition: IPoint;
    private imageRectOnCanvas: IRect;

    public constructor(canvas: HTMLCanvasElement, imageRect: IRect) {
        super();
        this.canvas = canvas;
        this.imageRectOnCanvas = imageRect;
    }

    // =================================================================================================================
    // RENDERING
    // =================================================================================================================

    public render(): void {

    }

    // =================================================================================================================
    // EVENT HANDLERS
    // =================================================================================================================


    public mouseUpHandler(event: MouseEvent): void {

    }

    public mouseDownHandler(event: MouseEvent): void {

    }

    public mouseMoveHandler(event: MouseEvent): void {
        this.mousePosition = CanvasUtil.getMousePositionOnCanvasFromEvent(event, this.canvas);
    }

    public updateImageRect(imageRect: IRect): void {
        this.imageRectOnCanvas = imageRect;
    }
}