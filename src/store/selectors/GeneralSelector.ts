import {store} from "../..";
import {PopupWindowType} from "../../data/PopupWindowType";

export class GeneralSelector {
    public static getActivePopupType(): PopupWindowType {
        return store.getState().general.activePopupType;
    }
}