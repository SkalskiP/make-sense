import {ISize} from "../../interfaces/ISize";
import {Action} from "../Actions";
import {PopupWindowType} from "../../data/PopupWindowType";
import {MobileDeviceData} from "../../data/MobileDeviceData";
import {CustomCursorStyle} from "../../data/CustomCursorStyle";
import {ContextType} from "../../data/ContextType";

export type GeneralState = {
    windowSize: ISize;
    mobileDeviceData: MobileDeviceData;
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

interface UpdateMobileDeviceData {
    type: typeof Action.UPDATE_MOBILE_DEVICE_DATA;
    payload: {
        mobileDeviceData: MobileDeviceData;
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
    | UpdateMobileDeviceData
    | UpdateCustomCursorStyle
    | UpdateActiveContext