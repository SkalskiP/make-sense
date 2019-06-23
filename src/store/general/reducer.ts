import {GeneralActionTypes, GeneralState} from "./types";
import {Action} from "../Actions";

const initialState: GeneralState = {
    windowSize: null
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
        default:
            return state;
    }
}