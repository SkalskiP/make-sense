import React from "react";
import {IPoint} from "../interfaces/IPoint";

export class CanvasUtil {
    public static getMousePositionOnCanvasFromEvent(event: React.MouseEvent<HTMLCanvasElement, MouseEvent> | MouseEvent, canvas: HTMLCanvasElement): IPoint {
        if (!!canvas) {
            const canvasRect: ClientRect | DOMRect = canvas.getBoundingClientRect();
            return {
                x: event.clientX - canvasRect.left,
                y: event.clientY - canvasRect.top
            }
        }
        return null;
    }
}