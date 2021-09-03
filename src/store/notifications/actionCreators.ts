import {INotification, NotificationsActionType} from './types';
import {Action} from '../Actions';

export function submitNewNotification(notification: INotification): NotificationsActionType {
    return {
        type: Action.SUBMIT_NEW_NOTIFICATION,
        payload: {
            notification,
        },
    };
}


export function deleteNotificationById(id: string): NotificationsActionType {
    return {
        type: Action.DELETE_NOTIFICATION_BY_ID,
        payload: {
            id,
        },
    };
}
