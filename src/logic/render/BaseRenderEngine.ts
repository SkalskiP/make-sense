import {EditorData} from "../../data/EditorData";
import {MouseEventUtil} from "../../utils/MouseEventUtil";
import {MouseEventType} from "../../data/MouseEventType";

export abstract class BaseRenderEngine {
    protected readonly canvas: HTMLCanvasElement;

    public constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
    }

    public update(data: EditorData): void {
        if (!!data.event) {
            switch (MouseEventUtil.getEventType(data.event)) {
                case MouseEventType.MOVE:
                    return this.mouseMoveHandler(data);
                case MouseEventType.UP:
                    return this.mouseUpHandler(data);
                case MouseEventType.DOWN:
                    return this.mouseDownHandler(data);
                default:
                    return null;
            }
        }
    }

    protected abstract mouseDownHandler(data: EditorData): void;
    protected abstract mouseMoveHandler(data: EditorData): void;
    protected abstract mouseUpHandler(data: EditorData): void;
    abstract render(data: EditorData): void;
}