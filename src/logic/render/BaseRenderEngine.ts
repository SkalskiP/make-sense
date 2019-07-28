export abstract class BaseRenderEngine {
    abstract mouseDownHandler(event: MouseEvent): void;
    abstract mouseMoveHandler(event: MouseEvent): void;
    abstract mouseUpHandler(event: MouseEvent): void;
    abstract render(): void;
}