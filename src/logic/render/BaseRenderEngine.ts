import {EditorData} from "../../data/EditorData";
import {MouseEventUtil} from "../../utils/MouseEventUtil";
import {MouseEventType} from "../../data/MouseEventType";

export abstract class BaseRenderEngine {
    protected readonly canvas: HTMLCanvasElement;

    protected constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
    }

    public update(data: EditorData): void {
        if (!!data.event) {
            switch (MouseEventUtil.getEventType(data.event)) {
                case MouseEventType.MOVE:
                    this.mouseMoveHandler(data);
                    break;
                case MouseEventType.UP:
                    this.mouseUpHandler(data);
                    break;
                case MouseEventType.DOWN:
                    this.mouseDownHandler(data);
                    break;
                default:
                    break;
            }
        }
    }

    protected abstract mouseDownHandler(data: EditorData): void;
    protected abstract mouseMoveHandler(data: EditorData): void;
    protected abstract mouseUpHandler(data: EditorData): void;

    abstract render(data: EditorData): void;

    abstract isInProgress(): boolean;
}