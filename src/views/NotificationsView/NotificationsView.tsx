import React, {useState} from 'react';
import './NotificationsView.scss';
import {AppState} from '../../store';
import {connect} from 'react-redux';
import classNames from 'classnames';
import {deleteNotificationById} from '../../store/notifications/actionCreators';
import {INotification} from '../../store/notifications/types';
import {NotificationType} from '../../data/enums/NotificationType';

interface IProps {
    deleteNotificationByIdAction: (id: string) => void
    queue: INotification[]
}

enum NotificationState {
    IN = 'IN',
    DISPLAY = 'DISPLAY',
    OUT = 'OUT',
    IDLE = 'IDLE'
}

enum Animation {
    IN = 'animation-in',
    DISPLAY = 'animation-display',
    OUT = 'animation-out'
}

const NotificationsView: React.FC<IProps> = (props) => {
    const [ notificationState, setNotificationState ] = useState(NotificationState.IDLE);

    if (props.queue.length > 0 && notificationState === NotificationState.IDLE) {
        setNotificationState(NotificationState.IN)
    }

    const notification: INotification | undefined = props.queue[0]

    const onClose = () => {
        setNotificationState(NotificationState.OUT)
    }

    const onAnimationEnd = (event: React.AnimationEvent<HTMLDivElement>) => {
        switch (event.animationName) {
            case Animation.IN:
                setNotificationState(NotificationState.DISPLAY)
                break
            case Animation.DISPLAY:
                setNotificationState(NotificationState.OUT)
                break
            case Animation.OUT:
                props.deleteNotificationByIdAction(notification.id)
                setNotificationState(NotificationState.IDLE)
                break
        }
    }

    const getNotificationWrapperClassName = () => {
        return classNames('notification-wrapper', {
            'in': notificationState === NotificationState.IN,
            'display': notificationState === NotificationState.DISPLAY,
            'out': notificationState === NotificationState.OUT
        })
    }

    const getNotificationClassName = () => {
        return classNames('notification', {
            'error': notification.type === NotificationType.ERROR,
            'success': notification.type === NotificationType.SUCCESS,
            'message': notification.type === NotificationType.MESSAGE,
            'warning': notification.type === NotificationType.WARNING
        })
    }

    const renderNotification = () => {
        return(
            notification && <div
                className={getNotificationWrapperClassName()}
                key={notification.id}
                onAnimationEnd={onAnimationEnd}
                onClick={onClose}
            >
                <div className={getNotificationClassName()}>
                    <div className='header'>
                        {notification.header}
                    </div>
                    <div className='content'>
                        {notification.description}
                    </div>
                    <div className='loader'/>
                </div>
            </div>
        )
    }

    return(notificationState !== NotificationState.IDLE ? renderNotification() : null)
}

const mapDispatchToProps = {
    deleteNotificationByIdAction: deleteNotificationById
};

const mapStateToProps = (state: AppState) => ({
    queue: state.notifications.queue
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NotificationsView);
