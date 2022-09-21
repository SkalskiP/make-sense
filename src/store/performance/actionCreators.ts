import {Action} from '../Actions';
import {Task, TaskStatus} from './types';

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
