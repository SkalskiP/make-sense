import {IRect} from "../../interfaces/IRect";
import {BaseRenderEngine} from "./BaseRenderEngine";
import {EditorData} from "../../data/EditorData";

export class PrimaryEditorRenderEngine extends BaseRenderEngine {

    public constructor(canvas: HTMLCanvasElement) {
        super(canvas);
    }

    // =================================================================================================================
    // EVENT HANDLERS
    // =================================================================================================================

    public mouseMoveHandler(data: EditorData): void {}

    public mouseDownHandler(data: EditorData): void {}

    public mouseUpHandler(data: EditorData): void {}

    // =================================================================================================================
    // RENDERING
    // =================================================================================================================

    public render(data: EditorData): void {}

    public drawImage(image: HTMLImageElement, imageRect: IRect) {
        if (!!image && !!this.canvas) {
            const ctx = this.canvas.getContext("2d");
            ctx.drawImage(image, imageRect.x, imageRect.y, imageRect.width, imageRect.height);
        }
    }
}