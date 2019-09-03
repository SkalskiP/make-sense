import {IRect} from "../../interfaces/IRect";
import {BaseRenderEngine} from "./BaseRenderEngine";
import {EditorData} from "../../data/EditorData";
import {EditorModel} from "../../model/EditorModel";
import {RectUtil} from "../../utils/RectUtil";

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

    public render(data: EditorData): void {
        if (!data.viewPortRectOnRenderImage || !data.realImageToRenderImageScale)
            return;

        const rectOnImage = RectUtil.scaleRect(data.viewPortRectOnRenderImage, data.realImageToRenderImageScale);
        this.drawImage(EditorModel.image, rectOnImage, EditorModel.viewPortRectOnCanvas);
    }

    public drawImage(image: HTMLImageElement, rectOnImage: IRect, rectOnCanvas: IRect) {
        if (!!image && !!this.canvas) {
            const ctx = this.canvas.getContext("2d");
            ctx.drawImage(image, rectOnImage.x, rectOnImage.y, rectOnImage.width, rectOnImage.height,
                rectOnCanvas.x, rectOnCanvas.y, rectOnCanvas.width, rectOnCanvas.height);
        }
    }

    isInProgress(): boolean {
        return false;
    }
}