import {AIActionTypes, AIState} from "./types";
import {Action} from "../Actions";

const initialState: AIState = {
    isObjectDetectorLoaded: false
};

export function aiReducer(
    state = initialState,
    action: AIActionTypes
): AIState {
    switch (action.type) {
        case Action.UPDATE_OBJECT_DETECTOR_STATUS: {
            return {
                ...state,
                isObjectDetectorLoaded: action.payload.isObjectDetectorLoaded
            }
        }
        default:
            return state;
    }
}