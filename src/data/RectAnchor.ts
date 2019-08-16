import {AnchorType} from "./AnchorType";
import {IPoint} from "../interfaces/IPoint";

export interface RectAnchor {
    type: AnchorType,
    position: IPoint
}