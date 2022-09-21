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
    tasks: []
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
        default:
            return state;
    }
}
