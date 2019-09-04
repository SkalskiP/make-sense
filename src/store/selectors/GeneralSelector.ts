import {store} from "../..";
import {PopupWindowType} from "../../data/enums/PopupWindowType";

export class GeneralSelector {
    public static getActivePopupType(): PopupWindowType {
        return store.getState().general.activePopupType;
    }
}