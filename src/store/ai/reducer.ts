import {AIActionTypes, AIState} from './types';
import {Action} from '../Actions';

const initialState: AIState = {
    suggestedLabelList: [],
    rejectedSuggestedLabelList: [],
    isObjectDetectorLoaded: false,
    isPoseDetectorLoaded: false,
    isAIDisabled: false,
    scoreCriteria: {
        gender: 0.8,
        style: 0.8,
        color: 0.8,
        pattern: 0.8,
        item: 0.8
    }
};

export function aiReducer(
    state = initialState,
    action: AIActionTypes
): AIState {
    switch (action.type) {
        case Action.UPDATE_SCORE_CRITERIA: {
            console.log('Action.UPDATE_SCORE_CRITERIA ', action.payload)
            return {
                ...state,
                scoreCriteria: action.payload.scoreCriteria
            }
        }
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
