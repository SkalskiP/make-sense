import {IPoint} from "../interfaces/IPoint";
import {IRect} from "../interfaces/IRect";
import {ISize} from "../interfaces/ISize";

export interface EditorData {
    mousePositionOnCanvas: IPoint,
    canvasSize: ISize,
    activeImageScale: number,
    viewPortRectOnCanvas: IRect,
    viewPortRectOnRenderImage: IRect,
    event?: Event,
    activeKeyCombo: string[],
    realImageToRenderImageScale: number
}