import React, { useState } from 'react';
import { PopupActions } from '../../../logic/actions/PopupActions';
import { AppState } from '../../../store';
import { connect } from 'react-redux';
import { GenericSideMenuPopup } from '../GenericSideMenuPopup/GenericSideMenuPopup';
import { ImageButton } from '../../Common/ImageButton/ImageButton';
import { InferenceServerDataMap } from '../../../data/info/InferenceServerData';
import { InferenceServerType } from '../../../data/enums/InferenceServerType';
import { INotification, NotificationsActionType } from '../../../store/notifications/types';
import { submitNewNotification } from '../../../store/notifications/actionCreators';
import { NotificationUtil } from '../../../utils/NotificationUtil';
import { NotificationsDataMap } from '../../../data/info/NotificationsData';
import { Notification } from '../../../data/enums/Notification';

interface IProps {
    submitNewNotificationAction: (notification: INotification) => NotificationsActionType;
}

const ConnectInferenceServerPopup: React.FC<IProps> = ({ submitNewNotificationAction}) => {
    const [currentServerType, setCurrentServerType] = useState(InferenceServerType.ROBOFLOW);

    const wrapServerOnClick = (newServerType: InferenceServerType) => {
        return () => {
            if (!InferenceServerDataMap[newServerType].isDisabled) {
                setCurrentServerType(newServerType)
            } else {
                submitNewNotificationAction(NotificationUtil.createMessageNotification(
                    NotificationsDataMap[Notification.UNSUPPORTED_INFERENCE_SERVER_MESSAGE]));
                return;
            }
        }
    }

    const onAccept = () => {
        PopupActions.close();
    };

    const onReject = () => {
        PopupActions.close();
    };

    const renderContent = () => {
        return <div className='load-model-popup-content'>
            null
        </div>
    };

    const renderSideMenuContent = (): JSX.Element[] => {
        return Object.entries(InferenceServerDataMap).map(([serverType, serverData], index: number) => {
            return <ImageButton
                key={index}
                image={serverData.imageSrc}
                imageAlt={serverData.imageAlt}
                buttonSize={{width: 40, height: 40}}
                padding={20}
                onClick={wrapServerOnClick(serverType as InferenceServerType)}
                isActive={currentServerType === serverType}
                isDisabled={serverData.isDisabled}
            />
        })
    }
    return (
        <GenericSideMenuPopup
            title={InferenceServerDataMap[currentServerType].name}
            renderContent={renderContent}
            renderSideMenuContent={renderSideMenuContent}
            acceptLabel={'Connect'}
            onAccept={onAccept}
            rejectLabel={'Back'}
            onReject={onReject}
        />
    );
}

const mapDispatchToProps = {
    submitNewNotificationAction: submitNewNotification
};

const mapStateToProps = (state: AppState) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectInferenceServerPopup);