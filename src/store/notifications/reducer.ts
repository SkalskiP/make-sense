import {INotification, NotificationsActionType, NotificationsState} from './types';
import {Action} from '../Actions';

const initialState: NotificationsState = {
    queue: []
}

export function notificationsReducer(
    state = initialState,
    action: NotificationsActionType
): NotificationsState {
    switch (action.type) {
        case Action.SUBMIT_NEW_NOTIFICATION: {
            return {
                ...state,
                queue: [...state.queue, action.payload.notification]
            }
        }
        case Action.DELETE_NOTIFICATION_BY_ID: {
            return {
                ...state,
                queue: state.queue
                    .filter((message: INotification) => message.id !== action.payload.id)
            }
        }
        default:
            return state;
    }
}
