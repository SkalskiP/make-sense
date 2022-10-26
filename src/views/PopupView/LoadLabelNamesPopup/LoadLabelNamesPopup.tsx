import React, { useState } from 'react';
import './LoadLabelNamesPopup.scss';
import { AppState } from '../../../store';
import { connect } from 'react-redux';
import { updateLabelNames } from '../../../store/labels/actionCreators';
import { GenericYesNoPopup } from '../GenericYesNoPopup/GenericYesNoPopup';
import { PopupWindowType } from '../../../data/enums/PopupWindowType';
import { updateActivePopupType } from '../../../store/general/actionCreators';
import { useDropzone } from 'react-dropzone';
import { LabelName } from '../../../store/labels/types';
import { YOLOUtils } from '../../../logic/import/yolo/YOLOUtils';
import {LabelNamesNotUniqueError} from '../../../logic/import/yolo/YOLOErrors';
import {NotificationUtil} from '../../../utils/NotificationUtil';
import {NotificationsDataMap} from '../../../data/info/NotificationsData';
import {Notification} from '../../../data/enums/Notification';
import {submitNewNotification} from '../../../store/notifications/actionCreators';
import {INotification} from '../../../store/notifications/types';

interface IProps {
    updateActivePopupTypeAction: (activePopupType: PopupWindowType) => any;
    updateLabelNamesAction: (labels: LabelName[]) => any;
    submitNewNotificationAction: (notification: INotification) => any;
}

const LoadLabelNamesPopup: React.FC<IProps> = (
    { updateActivePopupTypeAction, updateLabelNamesAction, submitNewNotificationAction }
) => {
    const [labelsList, setLabelsList] = useState([]);
    const [invalidFileLoadedStatus, setInvalidFileLoadedStatus] = useState(false);

    const onSuccess = (labels: LabelName[]) => {
        setLabelsList(labels);
        setInvalidFileLoadedStatus(false);
    };

    const onFailure = (error: Error) => {
        setInvalidFileLoadedStatus(true);
        if (error instanceof LabelNamesNotUniqueError) {
            submitNewNotificationAction(NotificationUtil
                .createErrorNotification(NotificationsDataMap[Notification.NON_UNIQUE_LABEL_NAMES_ERROR]));
        }
    };

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        accept: { 'text/plain': ['.txt'] },
        multiple: false,
        onDrop: (accepted) => {
            if (accepted.length === 1) {
                YOLOUtils.loadLabelsList(accepted[0], onSuccess, onFailure);
            }
        }
    });


    const onAccept = () => {
        if (labelsList.length > 0) {
            updateLabelNamesAction(labelsList);
            updateActivePopupTypeAction(null);
        }
    };

    const onReject = () => {
        updateActivePopupTypeAction(PopupWindowType.INSERT_LABEL_NAMES);
    };

    const getDropZoneContent = () => {
        if (invalidFileLoadedStatus)
            return <>
                <input {...getInputProps()} />
                <img
                    draggable={false}
                    alt={'upload'}
                    src={'ico/box-opened.png'}
                />
                <p className='extraBold'>Loading of labels file was unsuccessful</p>
                <p className='extraBold'>Try again</p>
            </>;
        else if (acceptedFiles.length === 0)
            return <>
                <input {...getInputProps()} />
                <img
                    draggable={false}
                    alt={'upload'}
                    src={'ico/box-opened.png'}
                />
                <p className='extraBold'>Drop labels file</p>
                <p>or</p>
                <p className='extraBold'>Click here to select it</p>
            </>;
        else if (labelsList.length === 1)
            return <>
                <img
                    draggable={false}
                    alt={'uploaded'}
                    src={'ico/box-closed.png'}
                />
                <p className='extraBold'>only 1 label found</p>
            </>;
        else
            return <>
                <img
                    draggable={false}
                    alt={'uploaded'}
                    src={'ico/box-closed.png'}
                />
                <p className='extraBold'>{labelsList.length} labels found</p>
            </>;
    };

    const renderContent = () => {
        return (<div className='LoadLabelsPopupContent'>
            <div className='Message'>
                Load a text file with a list of labels you are planning to use. The names of
                each label should be separated by new line. If you don&apos;t have a prepared file, no problem. You can
                create your own list now.
            </div>
            <div {...getRootProps({ className: 'DropZone' })}>
                {getDropZoneContent()}
            </div>
        </div>);
    };

    return (
        <GenericYesNoPopup
            title={'Load file with labels description'}
            renderContent={renderContent}
            acceptLabel={'Start project'}
            onAccept={onAccept}
            disableAcceptButton={labelsList.length === 0}
            rejectLabel={'Back'}
            onReject={onReject}
        />
    );
};

const mapDispatchToProps = {
    updateActivePopupTypeAction: updateActivePopupType,
    updateLabelNamesAction: updateLabelNames,
    submitNewNotificationAction: submitNewNotification
};

const mapStateToProps = (state: AppState) => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoadLabelNamesPopup);
