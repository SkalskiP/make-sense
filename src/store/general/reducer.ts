import {GeneralActionTypes, GeneralState} from "./types";
import {Action} from "../Actions";
import {CustomCursorStyle} from "../../data/enums/CustomCursorStyle";

const initialState: GeneralState = {
    windowSize: null,
    activePopupType: null,
    customCursorStyle: CustomCursorStyle.DEFAULT,
    activeContext: null,
    preventCustomCursor: false,
    imageDragMode: false
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
        case Action.UPDATE_PREVENT_CUSTOM_CURSOR_STATUS: {
            return {
                ...state,
                preventCustomCursor: action.payload.preventCustomCursor
            }
        }
        case Action.UPDATE_IMAGE_DRAG_MODE_STATUS: {
            return {
                ...state,
                imageDragMode: action.payload.imageDragMode
            }
        }
        default:
            return state;
    }
}