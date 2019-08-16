import {IRect} from "../../interfaces/IRect";
import {ImageData} from "../../store/editor/types";
import {ImageRepository} from "../imageRepository/ImageRepository";
import {EditorSelector} from "../../store/selectors/EditorSelector";

export abstract class BaseRenderEngine {
    protected readonly canvas: HTMLCanvasElement;
    protected imageRectOnCanvas: IRect;

    public constructor(canvas: HTMLCanvasElement, imageRect: IRect) {
        this.canvas = canvas;
        this.imageRectOnCanvas = imageRect;
    }

    protected getActiveImageScale(): number {
        const imageData: ImageData = EditorSelector.getActiveImageData();
        const image: HTMLImageElement = ImageRepository.getById(imageData.id);
        return image.width / this.imageRectOnCanvas.width;
    }

    abstract mouseDownHandler(event: MouseEvent): void;
    abstract mouseMoveHandler(event: MouseEvent): void;
    abstract mouseUpHandler(event: MouseEvent): void;
    abstract updateImageRect(imageRect: IRect): void;
    abstract render(): void;
}