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

export class RectSecondaryRenderEngine extends BaseRenderEngine {
    private canvas: HTMLCanvasElement;
    private labelingInProgress: boolean = false;
    private resizeInProgress: boolean = false;
    private boundingBoxColor: string = Settings.SECONDARY_COLOR;
    private boundingBoxInactiveColor: string = Settings.BOUNDING_BOX_INACTIVE_COLOR;
    private boundingBoxThickness: number = Settings.BOUNDING_BOX_THICKNESS_PX;
    private mousePosition: IPoint;
    private imageRect: IRect;
    private startPoint: IPoint;

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
        if (this.labelingInProgress) {
            const activeRect: IRect = {
                x: this.startPoint.x,
                y: this.startPoint.y,
                width: this.mousePosition.x - this.startPoint.x,
                height: this.mousePosition.y - this.startPoint.y
            };
            const activeRectBetweenPixels = DrawUtil.setRectBetweenPixels(activeRect);
            DrawUtil.drawRect(this.canvas, activeRectBetweenPixels, this.boundingBoxColor, this.boundingBoxThickness);
        }
    }

    private drawInactiveRect(labelRect: LabelRect) {
        const highlightedLabelId: string = store.getState().editor.highlightedLabelId;
        const rect: IRect = this.calculateRectDimensionsRelativeToActiveImage(labelRect.rect);
        const color: string = labelRect.id === highlightedLabelId ? this.boundingBoxColor : this.boundingBoxInactiveColor;
        const rectBetweenPixels = DrawUtil
            .setRectBetweenPixels({...rect, x: rect.x + this.imageRect.x, y: rect.y + this.imageRect.y});
        DrawUtil.drawRect(this.canvas, rectBetweenPixels, color, this.boundingBoxThickness);
    }

    private drawActiveRect(labelRect: LabelRect) {
        const rect: IRect = this.calculateRectDimensionsRelativeToActiveImage(labelRect.rect);
        const rectBetweenPixels = DrawUtil
            .setRectBetweenPixels({...rect, x: rect.x + this.imageRect.x, y: rect.y + this.imageRect.y});
        DrawUtil.drawRect(this.canvas, rectBetweenPixels, this.boundingBoxColor, this.boundingBoxThickness);

        const handleCenters: IPoint[] = RectUtil.getRectVertices(rect);
        handleCenters.forEach((center: IPoint) => {
            const handleDimension: number = Settings.RESIZE_HANDLE_DIMENSION_PX;
            const handleRect: IRect = {
                x: center.x - 0.5 * handleDimension,
                y: center.y - 0.5 * handleDimension,
                width: handleDimension,
                height: handleDimension
            };
            const handleRectBetweenPixels: IRect = DrawUtil
                .setRectBetweenPixels({...handleRect, x: handleRect.x + this.imageRect.x, y: handleRect.y + this.imageRect.y});
            DrawUtil.drawRectWithFill(this.canvas, handleRectBetweenPixels, Settings.RESIZE_HANDLE_COLOR);
        })
    }

    private setCursorStyle(labelRect: LabelRect) {
        if (this.canvas) {
            if (this.resizeInProgress) {

            }
            // else {
            //     const rect: IRect = this.calculateRectDimensionsRelativeToActiveImage(labelRect.rect);
            //     // const nwseResize: IPoint
            // }
        }
    }

    // =================================================================================================================
    // LOGIC
    // =================================================================================================================

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

    public mouseDownHandler = (event: MouseEvent) => {
        const mousePosition: IPoint = this.getMousePositionOnCanvasFromEvent(event);
        const isOverImage: boolean = RectUtil.isPointInside(this.imageRect, mousePosition);
        store.dispatch(updateActiveLabelId(null));

        if (isOverImage) {
            this.startPoint = mousePosition;
            this.mousePosition = mousePosition;
            this.labelingInProgress = true;
        }
    };

    public mouseUpHandler = (event: MouseEvent) => {
        if (!!this.imageRect) {
            const mousePosition: IPoint = this.getMousePositionOnCanvasFromEvent(event);
            const isOverImage: boolean = RectUtil.isPointInside(this.imageRect, mousePosition);

            if (isOverImage && this.labelingInProgress && !PointUtil.equals(this.startPoint, this.mousePosition)) {
                const scale = this.getActiveImageScale();

                const minX: number = Math.min(this.startPoint.x, this.mousePosition.x);
                const minY: number = Math.min(this.startPoint.y, this.mousePosition.y);
                const maxX: number = Math.max(this.startPoint.x, this.mousePosition.x);
                const maxY: number = Math.max(this.startPoint.y, this.mousePosition.y);

                const rect: IRect = {
                    x: (minX - this.imageRect.x) * scale,
                    y: (minY - this.imageRect.y) * scale,
                    width: (maxX - minX) * scale,
                    height: (maxY - minY) * scale
                };
                this.addRectLabel(rect);
            }
        }

        this.startPoint = null;
        this.mousePosition = null;
        this.labelingInProgress = false;
    };

    public mouseMoveHandler = (event: MouseEvent) => {
        this.mousePosition = this.getMousePositionOnCanvasFromEvent(event);
    };

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
}