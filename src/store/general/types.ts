import {ISize} from "../../interfaces/ISize";
import {Action} from "../Actions";
import {PopupWindowType} from "../../data/PopupWindowType";

export type GeneralState = {
    windowSize: ISize;
    activePopupType: PopupWindowType;
    imageScrollListPosition: number;
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

interface UpdateImageListScrollPosition {
    type: typeof Action.UPDATE_IMAGE_LIST_SCROLL_POSITION;
    payload: {
        imageScrollListPosition: number;
    }
}

export type GeneralActionTypes = UpdateWindowSize
    | UpdateActivePopupType
    | UpdateImageListScrollPosition