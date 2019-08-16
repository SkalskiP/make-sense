import {BaseRenderEngine} from "./BaseRenderEngine";

export abstract class BaseSupportRenderEngine extends BaseRenderEngine{
    public constructor(canvas: HTMLCanvasElement) {
        super(canvas);
    }

    abstract isInProgress(): boolean;
}