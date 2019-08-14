import {IRect} from "../../interfaces/IRect";
import {BaseRenderEngine} from "./BaseRenderEngine";

export abstract class BaseSuportRenderEngine extends BaseRenderEngine{
    public constructor(canvas: HTMLCanvasElement, imageRect: IRect) {
        super(canvas, imageRect);
    }

    abstract isInProgress(): boolean;
}