import {Action} from '../Actions';
import {AIActionTypes} from './types';

export function updateSuggestedLabelList(labelList: string[]): AIActionTypes {
    return {
        type: Action.UPDATE_SUGGESTED_LABEL_LIST,
        payload: {
            labelList,
        }
    }
}

export function updateRejectedSuggestedLabelList(labelList: string[]): AIActionTypes {
    return {
        type: Action.UPDATE_REJECTED_SUGGESTED_LABEL_LIST,
        payload: {
            labelList,
        }
    }
}

export function updateObjectDetectorStatus(isObjectDetectorLoaded: boolean): AIActionTypes {
    return {
        type: Action.UPDATE_OBJECT_DETECTOR_STATUS,
        payload: {
            isObjectDetectorLoaded,
        }
    }
}

export function updatePoseDetectorStatus(isPoseDetectorLoaded: boolean): AIActionTypes {
    return {
        type: Action.UPDATE_POSE_DETECTOR_STATUS,
        payload: {
            isPoseDetectorLoaded,
        }
    }
}

export function updateDisabledAIFlag(isAIDisabled: boolean): AIActionTypes {
    return {
        type: Action.UPDATE_DISABLED_AI_FLAG,
        payload: {
            isAIDisabled,
        }
    }
}