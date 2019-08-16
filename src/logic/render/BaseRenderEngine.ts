import {IRect} from "../../interfaces/IRect";
import {ImageData} from "../../store/editor/types";
import {ImageRepository} from "../imageRepository/ImageRepository";
import {EditorSelector} from "../../store/selectors/EditorSelector";
import {EditorData} from "../../data/EditorData";
import {MouseEventUtil} from "../../utils/MouseEventUtil";
import {MouseEventType} from "../../data/MouseEventType";

export abstract class BaseRenderEngine {
    protected readonly canvas: HTMLCanvasElement;
    protected imageRectOnCanvas: IRect;

    public constructor(canvas: HTMLCanvasElement, imageRect: IRect) {
        this.canvas = canvas;
        this.imageRectOnCanvas = imageRect;
    }

    protected getActiveImageScale(): number | null {
        const imageData: ImageData = EditorSelector.getActiveImageData();
        const image: HTMLImageElement = ImageRepository.getById(imageData.id);
        if (!image)
            return null;

        return image.width / this.imageRectOnCanvas.width;
    }

    public update(data: EditorData): void {
        if (!!data.event) {
            switch (MouseEventUtil.getEventType(data.event)) {
                case MouseEventType.MOVE:
                    return this.mouseMoveHandler(data.event);
                case MouseEventType.UP:
                    return this.mouseUpHandler(data.event);
                case MouseEventType.DOWN:
                    return this.mouseDownHandler(data.event);
                default:
                    return null;
            }
        }
    }

    protected abstract mouseDownHandler(event: MouseEvent): void;
    protected abstract mouseMoveHandler(event: MouseEvent): void;
    protected abstract mouseUpHandler(event: MouseEvent): void;
    abstract updateImageRect(imageRect: IRect): void;
    abstract render(): void;
}