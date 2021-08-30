import {AIActionTypes, AIState} from './types';
import {Action} from '../Actions';

const initialState: AIState = {
    suggestedLabelList: [],
    rejectedSuggestedLabelList: [],
    isObjectDetectorLoaded: false,
    isPoseDetectorLoaded: false,
    isAIDisabled: false
};

export function aiReducer(
    state = initialState,
    action: AIActionTypes
): AIState {
    switch (action.type) {
        case Action.UPDATE_SUGGESTED_LABEL_LIST: {
            return {
                ...state,
                suggestedLabelList: action.payload.labelList
            }
        }
        case Action.UPDATE_REJECTED_SUGGESTED_LABEL_LIST: {
            return {
                ...state,
                rejectedSuggestedLabelList: action.payload.labelList
            }
        }
        case Action.UPDATE_OBJECT_DETECTOR_STATUS: {
            return {
                ...state,
                isObjectDetectorLoaded: action.payload.isObjectDetectorLoaded
            }
        }
        case Action.UPDATE_POSE_DETECTOR_STATUS: {
            return {
                ...state,
                isPoseDetectorLoaded: action.payload.isPoseDetectorLoaded
            }
        }
        case Action.UPDATE_DISABLED_AI_FLAG: {
            return {
                ...state,
                isAIDisabled: action.payload.isAIDisabled
            }
        }
        default:
            return state;
    }
}
