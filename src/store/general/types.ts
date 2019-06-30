import {ISize} from "../../interfaces/ISize";
import {Action} from "../Actions";
import {PopupWindowType} from "../../data/PopupWindowType";

export type GeneralState = {
    windowSize: ISize;
    activePopupType: PopupWindowType;
}

interface UpdateWindowSize {
    type: typeof Action.UPDATE_WINDOW_SIZE;
    payload: {
        windowSize: ISize;
    }
}

interface UpdateActivePopupType {
    type: typeof Action.UPDATE_ACTIVE_POPUP_TYPE;
    payload: {
        activePopupType: PopupWindowType;
    }
}

export type GeneralActionTypes = UpdateWindowSize |
    UpdateActivePopupType