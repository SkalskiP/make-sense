import {store} from "../..";
import {PopupWindowType} from "../../data/enums/PopupWindowType";
import {ContextType} from "../../data/enums/ContextType";

export class GeneralSelector {
    public static getActivePopupType(): PopupWindowType {
        return store.getState().general.activePopupType;
    }

    public static getActiveContext(): ContextType {
        return store.getState().general.activeContext;
    }

    public static getPreventCustomCursorStatus(): boolean {
        return store.getState().general.preventCustomCursor;
    }
}