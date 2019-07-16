import {ISize} from "../../interfaces/ISize";
import {Action} from "../Actions";
import {PopupWindowType} from "../../data/PopupWindowType";
import {MobileDeviceData} from "../../data/MobileDeviceData";

export type GeneralState = {
    windowSize: ISize;
    mobileDeviceData: MobileDeviceData;
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

interface UpdateMobileDeviceData {
    type: typeof Action.UPDATE_MOBILE_DEVICE_DATA;
    payload: {
        mobileDeviceData: MobileDeviceData;
    }
}

export type GeneralActionTypes = UpdateWindowSize
    | UpdateActivePopupType
    | UpdateMobileDeviceData