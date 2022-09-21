import {Action} from '../Actions';
import {CommonSummary, Task, TaskStatus} from './types';

export function updateTaskStatus(taskStatus: TaskStatus) {
    return {
        type: Action.UPDATE_TASK_STATUS_DATA,
        payload: {
            taskStatus
        }
    };
}

export function updateTasks(tasks: Task[]) {
    return {
        type: Action.UPDATE_TASKS_DATA,
        payload: {
            tasks
        }
    };
}

export function updateCommonSummary(commonSummary: CommonSummary) {
    return {
        type: Action.UPDATE_COMMON_SUMMARY_DATA,
        payload: {
            commonSummary
        }
    };
}
