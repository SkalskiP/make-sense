import {IPoint} from "../interfaces/IPoint";
import {Direction} from "./enums/Direction";

export interface RectAnchor {
    type: Direction,
    position: IPoint
}