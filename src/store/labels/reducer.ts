import {LabelsActionTypes, LabelsState, ImageData} from './types';
import {Action} from '../Actions';
import {LabelModeType} from '../../data/enums/LabelType';
import {
    GENDER,
    ITEM_COLOR,
    ITEM_PATTERN,
    SOURCE
} from '../../data/enums/ItemType';

const initialState: LabelsState = {
    activeImageIndex: null,
    activeLabelNameId: null,
    activeLabelType: null,
    activeLabelId: null,
    highlightedLabelId: null,
    imagesData: [],
    firstLabelCreatedFlag: false,
    labels: [],
    activeLabelMode: LabelModeType.HUMAN,
    activeGender: GENDER.UNKNOWN,
    activeHumanType: SOURCE.UNKNOWN,
    activeColor: ITEM_COLOR.UNKNOWN,
    activePattern: ITEM_PATTERN.UNKNOWN,
    activeStyles: [],
    activeHumanID: null,
    activeMainCategory: -1,
    activeSubCategory: -1
};

export function labelsReducer(
    state = initialState,
    action: LabelsActionTypes
): LabelsState {
    
    switch (action.type) {
        
        case Action.UPDATE_ACTIVE_IMAGE_INDEX: {
            return {
                ...state,
                activeImageIndex: action.payload.activeImageIndex
            };
        }
        case Action.UPDATE_ACTIVE_LABEL_NAME_ID: {
            return {
                ...state,
                activeLabelNameId: action.payload.activeLabelNameId
            };
        }
        case Action.UPDATE_ACTIVE_LABEL_ID: {
            return {
                ...state,
                activeLabelId: action.payload.activeLabelId
            };
        }
        case Action.UPDATE_HIGHLIGHTED_LABEL_ID: {
            return {
                ...state,
                highlightedLabelId: action.payload.highlightedLabelId
            };
        }
        case Action.UPDATE_ACTIVE_LABEL_TYPE: {
            return {
                ...state,
                activeLabelType: action.payload.activeLabelType
            };
        }
        case Action.UPDATE_IMAGE_DATA_BY_ID: {
            
            return {
                ...state,
                imagesData: state.imagesData.map((imageData: ImageData) =>
                    imageData.id === action.payload.id
                        ? action.payload.newImageData
                        : imageData
                )
            };
        }
        case Action.ADD_IMAGES_DATA: {
            return {
                ...state,
                imagesData: state.imagesData.concat(action.payload.imageData)
            };
        }
        case Action.UPDATE_IMAGES_DATA: {
            return {
                ...state,
                imagesData: action.payload.imageData
            };
        }
        case Action.UPDATE_LABEL_NAMES: {
            return {
                ...state,
                labels: action.payload.labels
            };
        }
        case Action.UPDATE_FIRST_LABEL_CREATED_FLAG: {
            return {
                ...state,
                firstLabelCreatedFlag: action.payload.firstLabelCreatedFlag
            };
        }
        case Action.UPDATE_ACTIVE_LABEL_MODE: {
            return {
                ...state,
                activeLabelMode: action.payload.mode
            };
        }
        case Action.UPDATE_ACTIVE_GENDER: {
            return {
                ...state,
                activeGender: action.payload.gender
            };
        }
        case Action.UPDATE_ACTIVE_HUMAN_TYPE: {
            return {
                ...state,
                activeHumanType: action.payload.humanType
            };
        }
        case Action.UPDATE_ACTIVE_STYLES: {
            return {
                ...state,
                activeStyles: action.payload.styles
            };
        }
        case Action.UPDATE_ACTIVE_HUMAN_ID: {
            return {
                ...state,
                activeHumanID: action.payload.humanId
            };
        }
        case Action.UPDATE_ACTIVE_MAIN_CATEGORY: {
            return {
                ...state,
                activeMainCategory: action.payload.mainCategory
            };
        }
        case Action.UPDATE_ACTIVE_SUB_CATEGORY: {
            return {
                ...state,
                activeSubCategory: action.payload.subCategory
            };
        }
        case Action.UPDATE_ACTIVE_COLOR: {
            return {
                ...state,
                activeColor: action.payload.color
            };
        }
        case Action.UPDATE_ACTIVE_PATTERN: {
            return {
                ...state,
                activePattern: action.payload.pattern
            };
        }
        default:
            return state;
    }
}
