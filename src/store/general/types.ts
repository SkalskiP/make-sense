import {ISize} from "../../interfaces/ISize";
import {Action} from "../Actions";
import {PopupWindowType} from "../../data/enums/PopupWindowType";
import {CustomCursorStyle} from "../../data/enums/CustomCursorStyle";
import {ContextType} from "../../data/enums/ContextType";

export type GeneralState = {
    windowSize: ISize;
    activePopupType: PopupWindowType;
    customCursorStyle: CustomCursorStyle;
    activeContext: ContextType;
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

interface UpdateCustomCursorStyle {
    type: typeof Action.UPDATE_CUSTOM_CURSOR_STYLE;
    payload: {
        customCursorStyle: CustomCursorStyle;
    }
}

interface UpdateActiveContext {
    type: typeof Action.UPDATE_CONTEXT;
    payload: {
        activeContext: ContextType;
    }
}

export type GeneralActionTypes = UpdateWindowSize
    | UpdateActivePopupType
    | UpdateCustomCursorStyle
    | UpdateActiveContext