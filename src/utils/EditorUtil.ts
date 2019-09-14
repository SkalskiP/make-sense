import {CustomCursorStyle} from "../data/enums/CustomCursorStyle";
import classNames from "classnames";

export class EditorUtil {
    public static getIndicator = (cursorStyle: CustomCursorStyle): string => {
        switch (cursorStyle) {
            case CustomCursorStyle.ADD:
                return "ico/plus.png";
            case CustomCursorStyle.RESIZE:
                return "ico/resize.png";
            case CustomCursorStyle.CLOSE:
                return "ico/close.png";
            case CustomCursorStyle.MOVE:
                return "ico/move.png";
            case CustomCursorStyle.CANCEL:
                return "ico/cancel.png";
            case CustomCursorStyle.GRAB:
                return "ico/hand-fill.png";
            case CustomCursorStyle.GRABBING:
                return "ico/hand-fill-grab.png";
            default:
                return null;
        }
    };

    public static getCursorStyle = (cursorStyle: CustomCursorStyle) => {
        return classNames(
            "Cursor", {
                "move": cursorStyle === CustomCursorStyle.MOVE,
                "add": cursorStyle === CustomCursorStyle.ADD,
                "resize": cursorStyle === CustomCursorStyle.RESIZE,
                "close": cursorStyle === CustomCursorStyle.CLOSE,
                "cancel": cursorStyle === CustomCursorStyle.CANCEL,
                "grab": cursorStyle === CustomCursorStyle.GRAB,
                "grabbing": cursorStyle === CustomCursorStyle.GRABBING
            }
        );
    };
}