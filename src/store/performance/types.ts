import {Action} from '../Actions';

export type PerformanceState = {
    taskStatus: TaskStatus;
    tasks: Task[];
    commonSummary: CommonSummary;
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

export type CommonSummary = {
    images: {
        total: number;
        labeled: number;
        unchecked: number;
        waitingQC: number;
        passed: number;
        rejected: number;
    };
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

interface UpdateCommonSummaryData {
    type: typeof Action.UPDATE_COMMON_SUMMARY_DATA;
    payload: {
        commonSummary: CommonSummary;
    };
}

export type PerformanceActionTypes =
    | UpdateTaskStatusData
    | UpdateTasksData
    | UpdateCommonSummaryData;
