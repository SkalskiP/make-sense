import {GeneralActionTypes, GeneralState} from "./types";
import {Action} from "../Actions";
import {CustomCursorStyle} from "../../data/CustomCursorStyle";

const initialState: GeneralState = {
    windowSize: null,
    activePopupType: null,
    mobileDeviceData: null,
    customCursorStyle: CustomCursorStyle.DEFAULT,
    activeContext: null
};

export function generalReducer(
    state = initialState,
    action: GeneralActionTypes
): GeneralState {
    switch (action.type) {
        case Action.UPDATE_WINDOW_SIZE: {
            return {
                ...state,
                windowSize: action.payload.windowSize
            }
        }
        case Action.UPDATE_ACTIVE_POPUP_TYPE: {
            return {
                ...state,
                activePopupType: action.payload.activePopupType
            }
        }
        case Action.UPDATE_MOBILE_DEVICE_DATA: {
            return {
                ...state,
                mobileDeviceData: action.payload.mobileDeviceData
            }
        }
        case Action.UPDATE_CUSTOM_CURSOR_STYLE: {
            return {
                ...state,
                customCursorStyle: action.payload.customCursorStyle
            }
        }
        case Action.UPDATE_CONTEXT: {
            return {
                ...state,
                activeContext: action.payload.activeContext
            }
        }
        default:
            return state;
    }
}