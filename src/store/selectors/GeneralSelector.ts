import {store} from "../..";
import {PopupWindowType} from "../../data/PopupWindowType";
import {ContextType} from "../../data/ContextType";

export class GeneralSelector {
    public static getActivePopupType(): PopupWindowType {
        return store.getState().general.activePopupType;
    }

    public static getActiveContext(): ContextType {
        return store.getState().general.activeContext;
    }
}