import {IRect} from "../../interfaces/IRect";
import {store} from "../../index";
import {ImageData} from "../../store/editor/types";
import {ImageRepository} from "../imageRepository/ImageRepository";

export abstract class BaseRenderEngine {
    protected readonly canvas: HTMLCanvasElement;
    protected imageRectOnCanvas: IRect;

    public constructor(canvas: HTMLCanvasElement, imageRect: IRect) {
        this.canvas = canvas;
        this.imageRectOnCanvas = imageRect;
    }

    protected getActiveImageScale(): number {
        const activeImageIndex = store.getState().editor.activeImageIndex;
        const imageData: ImageData = store.getState().editor.imagesData[activeImageIndex];
        const image: HTMLImageElement = ImageRepository.getById(imageData.id);
        return image.width / this.imageRectOnCanvas.width;
    }

    protected getActiveImage(): ImageData {
        const activeImageIndex: number | null = store.getState().editor.activeImageIndex;
        return store.getState().editor.imagesData[activeImageIndex];
    }

    abstract mouseDownHandler(event: MouseEvent): void;
    abstract mouseMoveHandler(event: MouseEvent): void;
    abstract mouseUpHandler(event: MouseEvent): void;
    abstract updateImageRect(imageRect: IRect): void;
    abstract render(): void;
}