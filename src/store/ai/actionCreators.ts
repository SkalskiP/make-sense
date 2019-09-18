import {Action} from "../Actions";
import {AIActionTypes} from "./types";

export function updateObjectDetectorStatus(isObjectDetectorLoaded: boolean): AIActionTypes {
    return {
        type: Action.UPDATE_OBJECT_DETECTOR_STATUS,
        payload: {
            isObjectDetectorLoaded,
        }
    }
}