export abstract class BaseRenderEngine {
    abstract mouseMoveHandler(event: MouseEvent): void;
    abstract render(): void;
}