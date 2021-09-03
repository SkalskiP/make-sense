import {NotificationType} from '../../data/enums/NotificationType';
import {Action} from '../Actions';

export interface INotification {
    id: string,
    type: NotificationType,
    header: string,
    description: string
}

export type NotificationsState = {
    queue: INotification[]
}

interface SubmitNewNotification {
    type: typeof Action.SUBMIT_NEW_NOTIFICATION;
    payload: {
        notification: INotification;
    }
}

interface DeleteNotificationById {
    type: typeof Action.DELETE_NOTIFICATION_BY_ID;
    payload: {
        id: string;
    }
}

export type NotificationsActionType = SubmitNewNotification | DeleteNotificationById
