import {AnchorType} from "./AnchorType";

export const AnchorTypeToCursorStyleMapping = new Map<string, string>([
    [AnchorType.TOP, "ns-resize"],
    [AnchorType.BOTTOM, "ns-resize"],
    [AnchorType.LEFT, "ew-resize"],
    [AnchorType.RIGHT, "ew-resize"],
    [AnchorType.TOP_LEFT, "nwse-resize"],
    [AnchorType.BOTTOM_RIGHT, "nwse-resize"],
    [AnchorType.TOP_RIGHT, "nesw-resize"],
    [AnchorType.BOTTOM_LEFT, "nesw-resize"],
    [AnchorType.CENTER, "move"]
]);