import {Action} from "../Actions";

export type AIState = {
    suggestedLabelList: string[];
    rejectedSuggestedLabelList: string[];
    isObjectDetectorLoaded: boolean;
    isAIDisabled: boolean;
}

interface UpdateSuggestedLabelList {
    type: typeof Action.UPDATE_SUGGESTED_LABEL_LIST;
    payload: {
        labelList: string[];
    }
}

interface UpdateRejectedSuggestedLabelList {
    type: typeof Action.UPDATE_REJECTED_SUGGESTED_LABEL_LIST;
    payload: {
        labelList: string[];
    }
}

interface UpdateObjectDetectorStatus {
    type: typeof Action.UPDATE_OBJECT_DETECTOR_STATUS;
    payload: {
        isObjectDetectorLoaded: boolean;
    }
}

interface UpdateDisabledAIFlag {
    type: typeof Action.UPDATE_DISABLED_AI_FLAG;
    payload: {
        isAIDisabled: boolean;
    }
}

export type AIActionTypes = UpdateSuggestedLabelList
    | UpdateRejectedSuggestedLabelList
    | UpdateObjectDetectorStatus
    | UpdateDisabledAIFlag