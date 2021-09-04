import {INotification} from '../store/notifications/types';
import {v4 as uuidv4} from 'uuid';
import {NotificationType} from '../data/enums/NotificationType';
import {NotificationContent} from "../data/info/NotificationsData";

export class NotificationUtil {
    public static createErrorNotification(content: NotificationContent): INotification {
        return {
            id: uuidv4(),
            type: NotificationType.ERROR,
            header: content.header,
            description: content.description
        }
    }

    public static createMessageNotification(content: NotificationContent): INotification {
        return {
            id: uuidv4(),
            type: NotificationType.MESSAGE,
            header: content.header,
            description: content.description
        }
    }

    public static createWarningNotification(content: NotificationContent): INotification {
        return {
            id: uuidv4(),
            type: NotificationType.WARNING,
            header: content.header,
            description: content.description
        }
    }
}
