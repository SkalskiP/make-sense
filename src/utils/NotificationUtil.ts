import {INotification} from '../store/notifications/types';
import {v4 as uuidv4} from 'uuid';
import {NotificationType} from '../data/enums/NotificationType';

export class NotificationUtil {
    public static createErrorNotification(header: string, description: string): INotification {
        return {
            id: uuidv4(),
            type: NotificationType.ERROR,
            header,
            description
        }
    }

    public static createMessageNotification(header: string, description: string): INotification {
        return {
            id: uuidv4(),
            type: NotificationType.MESSAGE,
            header,
            description
        }
    }

    public static createWarningNotification(header: string, description: string): INotification {
        return {
            id: uuidv4(),
            type: NotificationType.WARNING,
            header,
            description
        }
    }
}
