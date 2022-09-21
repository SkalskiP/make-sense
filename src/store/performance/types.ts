import {Action} from '../Actions';

export type PerformanceState = {
    taskStatus: TaskStatus;
    tasks: Task[];
};

export type TaskStatus = {
    averageTPD: number;
    currentAverageTPD: number;
    highestRanker: {
        displayName: string;
        tpd: number;
    };
    me: {
        displayName: string;
        tpd: number;
    };
};

export type Task = {
    name: string;
    imagesTPD: number;
    imagesTPH: number;
    averageTimePerImage: number;
    labeledTPD: number;
    labeledTPH: number;
    averageTimePerLabeled: number;
    note?: string;
};

interface UpdateTaskStatusData {
    type: typeof Action.UPDATE_TASK_STATUS_DATA;
    payload: {
        taskStatus: TaskStatus;
    };
}

interface UpdateTasksData {
    type: typeof Action.UPDATE_TASKS_DATA;
    payload: {
        tasks: Task[];
    };
}

export type PerformanceActionTypes = UpdateTaskStatusData | UpdateTasksData;
