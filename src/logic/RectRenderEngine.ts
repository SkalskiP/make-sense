import {IPoint} from "../interfaces/IPoint";
import React from "react";
import {IRect} from "../interfaces/IRect";
import {RectUtil} from "../utils/RectUtil";
import {Settings} from "../settings/Settings";
import {DrawUtil} from "../utils/DrawUtil";
import {BaseRenderEngine} from "./BaseRenderEngine";
import {store} from "../index";
import {ImageData, LabelRect} from "../store/editor/types";
import uuidv1 from 'uuid/v1';
import {updateActiveLabelId, updateImageDataById} from "../store/editor/actionCreators";
import {ImageRepository} from "./ImageRepository";
import {PointUtil} from "../utils/PointUtil";
import {RectAnchor} from "../data/RectAnchor";
import {RectAnchorType} from "../data/RectAnchorType";
import {AnchorTypeToCursorStyleMapping} from "../data/AnchorTypeToCursorStyleMapping";
import {ISize} from "../interfaces/ISize";
import _ from "lodash";
import {RectRenderEngineConfig} from "../settings/RectRenderEngineConfig";

export class RectRenderEngine extends BaseRenderEngine {
    private canvas: HTMLCanvasElement;
    private config: RectRenderEngineConfig = new RectRenderEngineConfig();

    // =================================================================================================================
    // STATE
    // =================================================================================================================

    private createRectInProgress: boolean = false;
    private resizeRectInProgress: boolean = false;
    private startCreateRectPoint: IPoint;
    private startResizeRectAnchor: RectAnchor;
    private mousePosition: IPoint;
    private imageRect: IRect;


    public constructor(canvas: HTMLCanvasElement, imageRect: IRect) {
        super();
        this.canvas = canvas;
        this.imageRect = imageRect;
    }

    // =================================================================================================================
    // RENDERING
    // =================================================================================================================

    public render() {
        const activeLabelId: string = store.getState().editor.activeLabelId;
        const activeImageIndex: number | null = store.getState().editor.activeImageIndex;
        const imageData: ImageData = store.getState().editor.imagesData[activeImageIndex];

        if (imageData) {
            this.drawActivelyCreatedRect();

            imageData.labelRects.forEach((labelRect: LabelRect) => {
                if (labelRect.id === activeLabelId) {
                    this.drawActiveRect(labelRect);
                    this.setCursorStyle(labelRect);
                }
                else
                    this.drawInactiveRect(labelRect);
            })
        }
    }

    private drawActivelyCreatedRect() {
        if (this.createRectInProgress) {
            const activeRect: IRect = {
                x: this.startCreateRectPoint.x,
                y: this.startCreateRectPoint.y,
                width: this.mousePosition.x - this.startCreateRectPoint.x,
                height: this.mousePosition.y - this.startCreateRectPoint.y
            };
            const activeRectBetweenPixels = DrawUtil.setRectBetweenPixels(activeRect);
            DrawUtil.drawRect(this.canvas, activeRectBetweenPixels, this.config.rectActiveColor, this.config.rectThickness);
        }
    }

    private drawInactiveRect(labelRect: LabelRect) {
        const highlightedLabelId: string = store.getState().editor.highlightedLabelId;
        const rect: IRect = this.calculateRectDimensionsRelativeToActiveImage(labelRect.rect);
        const color: string = labelRect.id === highlightedLabelId ? this.config.rectActiveColor : this.config.rectInactiveColor;
        const rectBetweenPixels = DrawUtil
            .setRectBetweenPixels({...rect, x: rect.x + this.imageRect.x, y: rect.y + this.imageRect.y});
        DrawUtil.drawRect(this.canvas, rectBetweenPixels, color, this.config.rectThickness);
    }

    private drawActiveRect(labelRect: LabelRect) {
        let rect: IRect = this.calculateRectDimensionsRelativeToActiveImage(labelRect.rect);
        if (!!this.startResizeRectAnchor) {
            const startAnchorPosition = {
                x: this.startResizeRectAnchor.middlePosition.x + this.imageRect.x,
                y: this.startResizeRectAnchor.middlePosition.y + this.imageRect.y
            };
            const delta = {
                x: this.mousePosition.x - startAnchorPosition.x,
                y: this.mousePosition.y - startAnchorPosition.y
            };

            rect = RectRenderEngine.resizeRect(rect, this.startResizeRectAnchor.type, delta);
        }

        const rectBetweenPixels = DrawUtil
            .setRectBetweenPixels({...rect, x: rect.x + this.imageRect.x, y: rect.y + this.imageRect.y});
        DrawUtil.drawRect(this.canvas, rectBetweenPixels, this.config.rectActiveColor, this.config.rectThickness);

        const handleCenters: IPoint[] = this.mapRectToAnchors(rect).map((rectAnchor: RectAnchor) => rectAnchor.middlePosition);
        handleCenters.forEach((center: IPoint) => {
            const handleSize: ISize = {
                width: Settings.RESIZE_HANDLE_DIMENSION_PX,
                height: Settings.RESIZE_HANDLE_DIMENSION_PX
            };

            const handleRect: IRect = RectUtil.getRectWithCenterAndSize(center, handleSize);
            const handleRectBetweenPixels: IRect = DrawUtil
                .setRectBetweenPixels({...handleRect, x: handleRect.x + this.imageRect.x, y: handleRect.y + this.imageRect.y});
            DrawUtil.drawRectWithFill(this.canvas, handleRectBetweenPixels, Settings.RESIZE_HANDLE_COLOR);
        })
    }

    private setCursorStyle(labelRect: LabelRect) {
        if (!!this.canvas && !!this.mousePosition) {
            if (this.resizeRectInProgress) {

            }
            else {
                const rect: IRect = this.calculateRectDimensionsRelativeToActiveImage(labelRect.rect);
                let cursorStyle: string;

                this.mapRectToAnchors(rect).forEach((rectAnchor: RectAnchor) => {
                    const activationRect = this.mapAnchorToActivationRect(rectAnchor.middlePosition);
                    if (RectUtil.isPointInside(activationRect, this.mousePosition)) {
                        cursorStyle = AnchorTypeToCursorStyleMapping.get(rectAnchor.type);
                    }
                });

                if (!cursorStyle) {
                    cursorStyle = (RectUtil.isPointInside(this.imageRect, this.mousePosition)) ? "crosshair" : "default";
                }

                this.canvas.style.cursor = cursorStyle;
            }
        }
    }

    // =================================================================================================================
    // EVENT HANDLERS
    // =================================================================================================================

    public mouseDownHandler = (event: MouseEvent) => {
        const mousePosition: IPoint = this.getMousePositionOnCanvasFromEvent(event);
        const isOverImage: boolean = RectUtil.isPointInside(this.imageRect, mousePosition);

        if (isOverImage) {
            const activeLabelRect: LabelRect = this.getActiveRectLabel();
            if (!!activeLabelRect) {
                const rect: IRect = this.calculateRectDimensionsRelativeToActiveImage(activeLabelRect.rect);
                const activatedAnchor: RectAnchor = this.mapRectToAnchors(rect)
                    .map((rectAnchor: RectAnchor) => {
                        return {
                            type: rectAnchor.type,
                            middlePosition: rectAnchor.middlePosition,
                            rect: this.mapAnchorToActivationRect(rectAnchor.middlePosition)
                        }
                    })
                    .reduce((foundAnchor: RectAnchor, rectAnchor) => {
                        if (RectUtil.isPointInside(rectAnchor.rect, mousePosition)) {
                            return {
                                type: rectAnchor.type,
                                middlePosition: rectAnchor.middlePosition
                            }
                        } else {
                            return foundAnchor
                        }
                    }, null);
                if(!!activatedAnchor) {
                    this.resizeRectInProgress = true;
                    this.startResizeRectAnchor = activatedAnchor;
                } else {
                    this.startCreateRectPoint = mousePosition;
                    this.mousePosition = mousePosition;
                    this.createRectInProgress = true;
                    store.dispatch(updateActiveLabelId(null));
                }
            } else {
                this.startCreateRectPoint = mousePosition;
                this.mousePosition = mousePosition;
                this.createRectInProgress = true;
                store.dispatch(updateActiveLabelId(null));
            }
        }
    };

    public mouseUpHandler = (event: MouseEvent) => {
        if (!!this.imageRect) {
            const mousePosition: IPoint = this.getMousePositionOnCanvasFromEvent(event);
            const isOverImage: boolean = RectUtil.isPointInside(this.imageRect, mousePosition);

            if (isOverImage && this.createRectInProgress && !PointUtil.equals(this.startCreateRectPoint, this.mousePosition)) {
                const scale = this.getActiveImageScale();

                const minX: number = Math.min(this.startCreateRectPoint.x, this.mousePosition.x);
                const minY: number = Math.min(this.startCreateRectPoint.y, this.mousePosition.y);
                const maxX: number = Math.max(this.startCreateRectPoint.x, this.mousePosition.x);
                const maxY: number = Math.max(this.startCreateRectPoint.y, this.mousePosition.y);

                const rect: IRect = {
                    x: (minX - this.imageRect.x) * scale,
                    y: (minY - this.imageRect.y) * scale,
                    width: (maxX - minX) * scale,
                    height: (maxY - minY) * scale
                };
                this.addRectLabel(rect);
            }

            if (isOverImage && this.resizeRectInProgress) {
                const activeLabelRect: LabelRect = this.getActiveRectLabel();
                const rect: IRect = this.calculateRectDimensionsRelativeToActiveImage(activeLabelRect.rect);
                const startAnchorPosition = {
                    x: this.startResizeRectAnchor.middlePosition.x + this.imageRect.x,
                    y: this.startResizeRectAnchor.middlePosition.y + this.imageRect.y
                };
                const delta = {
                    x: this.mousePosition.x - startAnchorPosition.x,
                    y: this.mousePosition.y - startAnchorPosition.y
                };
                const resizedRect: IRect = RectRenderEngine.resizeRect(rect, this.startResizeRectAnchor.type, delta);
                const scale = this.getActiveImageScale();
                const scaledRect: IRect = RectRenderEngine.scaleRect(resizedRect, scale);

                const imageData = this.getActiveImage();
                imageData.labelRects = imageData.labelRects.map((labelRect: LabelRect) => {
                    if (labelRect.id === activeLabelRect.id) {
                        return {
                            ...labelRect,
                            rect: scaledRect
                        };
                    }
                    return labelRect;
                });
                store.dispatch(updateImageDataById(imageData.id, imageData));
            }
        }

        this.startCreateRectPoint = null;
        this.mousePosition = null;
        this.createRectInProgress = false;
        this.startResizeRectAnchor = null;
        this.resizeRectInProgress = false;
    };

    public mouseMoveHandler = (event: MouseEvent) => {
        this.mousePosition = this.getMousePositionOnCanvasFromEvent(event);
    };

    // =================================================================================================================
    // LOGIC
    // =================================================================================================================

    private static scaleRect(inputRect:IRect, scale: number) {
        return {
            x: inputRect.x * scale,
            y: inputRect.y * scale,
            width: inputRect.width * scale,
            height: inputRect.height * scale
        }
    }

    private static resizeRect(inputRect: IRect, rectAnchor: RectAnchorType, delta): IRect {
        const rect: IRect = {...inputRect};
        switch (rectAnchor) {
            case RectAnchorType.RIGHT:
                rect.width += delta.x;
                break;
            case RectAnchorType.BOTTOM_RIGHT:
                rect.width += delta.x;
                rect.height += delta.y;
                break;
            case RectAnchorType.BOTTOM:
                rect.height += delta.y;
                break;
            case RectAnchorType.TOP_RIGHT:
                rect.width += delta.x;
                rect.y += delta.y;
                rect.height -= delta.y;
                break;
            case RectAnchorType.TOP:
                rect.y += delta.y;
                rect.height -= delta.y;
                break;
            case RectAnchorType.TOP_LEFT:
                rect.x += delta.x;
                rect.width -= delta.x;
                rect.y += delta.y;
                rect.height -= delta.y;
                break;
            case RectAnchorType.LEFT:
                rect.x += delta.x;
                rect.width -= delta.x;
                break;
            case RectAnchorType.BOTTOM_LEFT:
                rect.x += delta.x;
                rect.width -= delta.x;
                rect.height += delta.y;
                break;
        }

        if (rect.width < 0)  {
            rect.x = rect.x + rect.width;
            rect.width = - rect.width;
        }

        if (rect.height < 0)  {
            rect.y = rect.y + rect.height;
            rect.height = - rect.height;
        }

        return rect;
    }

    private mapRectToAnchors(rect: IRect): RectAnchor[] {
        return [
            {type: RectAnchorType.TOP_LEFT, middlePosition: {x: rect.x, y: rect.y}},
            {type: RectAnchorType.TOP, middlePosition: {x: rect.x + 0.5 * rect.width, y: rect.y}},
            {type: RectAnchorType.TOP_RIGHT, middlePosition: {x: rect.x + rect.width, y: rect.y}},
            {type: RectAnchorType.LEFT, middlePosition: {x: rect.x, y: rect.y + 0.5 * rect.height}},
            {type: RectAnchorType.RIGHT, middlePosition: {x: rect.x + rect.width, y: rect.y + 0.5 * rect.height}},
            {type: RectAnchorType.BOTTOM_LEFT, middlePosition: {x: rect.x, y: rect.y + rect.height}},
            {type: RectAnchorType.BOTTOM, middlePosition: {x: rect.x + 0.5 * rect.width, y: rect.y + rect.height}},
            {type: RectAnchorType.BOTTOM_RIGHT, middlePosition: {x: rect.x + rect.width, y: rect.y + rect.height}}
        ]
    }

    private mapAnchorToActivationRect(anchor: IPoint): IRect {
        const anchorCenterClientPosition = {x: anchor.x + this.imageRect.x, y: anchor.y + this.imageRect.y}
        return {
            x: anchorCenterClientPosition.x - 0.5 * Settings.RESIZE_HANDLE_HOVER_DIMENSION_PX,
            y: anchorCenterClientPosition.y - 0.5 * Settings.RESIZE_HANDLE_HOVER_DIMENSION_PX,
            width: Settings.RESIZE_HANDLE_HOVER_DIMENSION_PX,
            height: Settings.RESIZE_HANDLE_HOVER_DIMENSION_PX
        }
    }

    private calculateRectDimensionsRelativeToActiveImage(rect: IRect):IRect {
        const scale = this.getActiveImageScale();
        return {
            x: rect.x / scale,
            y: rect.y / scale,
            width: rect.width / scale,
            height: rect.height / scale
        };
    }

    public updateImageRect(imageRect: IRect): void {
        this.imageRect = imageRect;
    }

    public unmount() {}

    /*
    * real image / render image
    * */
    public getActiveImageScale(): number {
        const activeImageIndex = store.getState().editor.activeImageIndex;
        const imageData: ImageData = store.getState().editor.imagesData[activeImageIndex];
        const image: HTMLImageElement = ImageRepository.getById(imageData.id);
        return image.width / this.imageRect.width;
    }

    public addRectLabel = (rect: IRect) => {
        const activeImageIndex = store.getState().editor.activeImageIndex;
        const activeLabelIndex = store.getState().editor.activeLabelIndex;
        const imageData: ImageData = store.getState().editor.imagesData[activeImageIndex];
        const labelRect: LabelRect = {
            id: uuidv1(),
            labelIndex: activeLabelIndex,
            rect: rect
        };
        imageData.labelRects.push(labelRect);
        store.dispatch(updateImageDataById(imageData.id, imageData));
    };

    private getMousePositionOnCanvasFromEvent(event: React.MouseEvent<HTMLCanvasElement, MouseEvent> | MouseEvent): IPoint {
        if (!!this.canvas) {
            const canvasRect: ClientRect | DOMRect = this.canvas.getBoundingClientRect();
            return {
                x: event.clientX - canvasRect.left,
                y: event.clientY - canvasRect.top
            }
        }
        else {
            return null;
        }
    }

    private getActiveImage(): ImageData {
        const activeImageIndex: number | null = store.getState().editor.activeImageIndex;
        return store.getState().editor.imagesData[activeImageIndex];
    }

    private getActiveRectLabel(): LabelRect | null {
        const activeLabelId: string = store.getState().editor.activeLabelId;
        return _.find(this.getActiveImage().labelRects, {id: activeLabelId});
    }
}