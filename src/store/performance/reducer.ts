import {Action} from 'store/Actions';
import {PerformanceActionTypes, PerformanceState} from './types';

const initialState: PerformanceState = {
    taskStatus: {
        averageTPD: 0,
        currentAverageTPD: 0,
        highestRanker: {
            displayName: '',
            tpd: 0
        },
        me: {
            displayName: '',
            tpd: 0
        }
    },
    tasks: [],
    commonSummary: {
        images: {
            total: 0,
            labeled: 0,
            unchecked: 0,
            waitingQC: 0,
            passed: 0,
            rejected: 0
        }
    }
};

export function performanceReducer(
    state = initialState,
    action: PerformanceActionTypes
): PerformanceState {
    switch (action.type) {
        case Action.UPDATE_TASK_STATUS_DATA: {
            return {
                ...state,
                taskStatus: action.payload.taskStatus
            };
        }
        case Action.UPDATE_TASKS_DATA: {
            return {
                ...state,
                tasks: action.payload.tasks
            };
        }
        case Action.UPDATE_COMMON_SUMMARY_DATA: {
            return {
                ...state,
                commonSummary: action.payload.commonSummary
            };
        }
        default:
            return state;
    }
}
