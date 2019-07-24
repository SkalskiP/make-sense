import {RectAnchorType} from "./RectAnchorType";

export const AnchorTypeToCursorStyleMapping = new Map<string, string>([
    [RectAnchorType.TOP, "ns-resize"],
    [RectAnchorType.BOTTOM, "ns-resize"],
    [RectAnchorType.LEFT, "ew-resize"],
    [RectAnchorType.RIGHT, "ew-resize"],
    [RectAnchorType.TOP_LEFT, "nwse-resize"],
    [RectAnchorType.BOTTOM_RIGHT, "nwse-resize"],
    [RectAnchorType.TOP_RIGHT, "nesw-resize"],
    [RectAnchorType.BOTTOM_LEFT, "nesw-resize"],
]);