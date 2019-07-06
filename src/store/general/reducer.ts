import {GeneralActionTypes, GeneralState} from "./types";
import {Action} from "../Actions";

const initialState: GeneralState = {
    windowSize: null,
    activePopupType: null,
    imageScrollListPosition: 0
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
        case Action.UPDATE_IMAGE_LIST_SCROLL_POSITION: {
            return {
                ...state,
                imageScrollListPosition: action.payload.imageScrollListPosition
            }
        }
        default:
            return state;
    }
}