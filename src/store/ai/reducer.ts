import { AIActionTypes, AIState } from './types';
import { Action } from '../Actions';

const initialState: AIState = {
    suggestedLabelList: [],
    rejectedSuggestedLabelList: [],
    isSSDObjectDetectorLoaded: false,
    isYOLOV5ObjectDetectorLoaded: false,
    isPoseDetectorLoaded: false,
    roboflowAPIDetails: {
        status: false,
        model: '',
        key: ''
    },
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
        case Action.UPDATE_SSD_OBJECT_DETECTOR_STATUS: {
            return {
                ...state,
                isSSDObjectDetectorLoaded: action.payload.isSSDObjectDetectorLoaded
            }
        }
        case Action.UPDATE_YOLO_V5_OBJECT_DETECTOR_STATUS: {
            return {
                ...state,
                isYOLOV5ObjectDetectorLoaded: action.payload.isYOLOV5ObjectDetectorLoaded
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
        case Action.UPDATE_ROBOFLOW_API_DETAILS: {
            return {
                ...state,
                roboflowAPIDetails: action.payload.roboflowAPIDetails
            }
        }
        default:
            return state;
    }
}
