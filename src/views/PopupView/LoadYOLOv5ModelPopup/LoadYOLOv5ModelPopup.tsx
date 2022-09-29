import React, {useState} from 'react';
import './LoadYOLOv5ModelPopup.scss'
import {GenericYesNoPopup} from '../GenericYesNoPopup/GenericYesNoPopup';
import {PopupActions} from '../../../logic/actions/PopupActions';
import {ImageButton} from '../../Common/ImageButton/ImageButton';
import {ModelConfig, YOLO_V5_N_COCO_MODEL_CONFIG, YOLO_V5_S_COCO_MODEL_CONFIG, YOLO_V5_M_COCO_MODEL_CONFIG} from 'yolov5js'
import {AppState} from '../../../store';
import {connect} from 'react-redux';
import {PopupWindowType} from '../../../data/enums/PopupWindowType';
import {GeneralActionTypes} from '../../../store/general/types';
import {YOLOV5ObjectDetector} from '../../../ai/YOLOV5ObjectDetector';
import {updateActivePopupType} from '../../../store/general/actionCreators';
import {submitNewNotification} from '../../../store/notifications/actionCreators';
import {INotification, NotificationsActionType} from '../../../store/notifications/types';
import {NotificationUtil} from '../../../utils/NotificationUtil';
import {NotificationsDataMap} from '../../../data/info/NotificationsData';
import {Notification} from '../../../data/enums/Notification';
import {CSSHelper} from '../../../logic/helpers/CSSHelper';
import {ClipLoader} from 'react-spinners';

enum ModelSource {
    DOWNLOAD = 'DOWNLOAD',
    UPLOAD = 'UPLOAD'
}

enum PretrainedModel {
    YOLO_V5_N_COCO = 'YOLO_V5_N_COCO',
    YOLO_V5_S_COCO = 'YOLO_V5_S_COCO',
    YOLO_V5_M_COCO = 'YOLO_V5_M_COCO'
}

interface IPretrainedModelSpecification {
    config: ModelConfig,
    name: string
}

const PretrainedModelDataMap: Record<PretrainedModel, IPretrainedModelSpecification> = {
    [PretrainedModel.YOLO_V5_N_COCO]: {
        config: YOLO_V5_N_COCO_MODEL_CONFIG,
        name: 'YOLOv5n / COCO'
    },
    [PretrainedModel.YOLO_V5_S_COCO]: {
        config: YOLO_V5_S_COCO_MODEL_CONFIG,
        name: 'YOLOv5s / COCO'
    },
    [PretrainedModel.YOLO_V5_M_COCO]: {
        config: YOLO_V5_M_COCO_MODEL_CONFIG,
        name: 'YOLOv5m / COCO'
    }
}

interface IProps {
    updateActivePopupTypeAction: (activePopupType: PopupWindowType) => GeneralActionTypes;
    submitNewNotificationAction: (notification: INotification) => NotificationsActionType;
}

const LoadYOLOv5ModelPopup: React.FC<IProps> = ({ updateActivePopupTypeAction, submitNewNotificationAction }) => {
    const [modelSource, setModelSource] = useState(ModelSource.UPLOAD);
    const [selectedPretrainedModel, setSelectedPretrainedModel] = useState(PretrainedModel.YOLO_V5_N_COCO);
    const [isLoading, setIsLoading] = useState(false);

    const onAccept = () => {
        if (modelSource === ModelSource.DOWNLOAD) {
            const onSuccess = () => {
                PopupActions.close();
            }
            const onFailure = () => {
                setIsLoading(false)
                submitNewNotificationAction(NotificationUtil.createErrorNotification(
                    NotificationsDataMap[Notification.MODEL_LOADING_ERROR]
                ))
            }
            setIsLoading(true)
            YOLOV5ObjectDetector.loadModel(PretrainedModelDataMap[selectedPretrainedModel].config, onSuccess, onFailure)
        } else {
            PopupActions.close();
        }
    }

    const onReject = () => {
        updateActivePopupTypeAction(PopupWindowType.LOAD_AI_MODEL);
    }

    const renderMenu = () => {
        return(<div className='left-container'>
            <ImageButton
                image={'ico/upload.png'}
                imageAlt={'upload model weights'}
                buttonSize={{ width: 40, height: 40 }}
                padding={15}
                onClick={() => setModelSource(ModelSource.UPLOAD)}
                externalClassName={'monochrome'}
                isActive={modelSource === ModelSource.UPLOAD}
            />
            <ImageButton
                image={'ico/download.png'}
                imageAlt={'download model weights'}
                buttonSize={{ width: 40, height: 40 }}
                padding={15}
                onClick={() => setModelSource(ModelSource.DOWNLOAD)}
                externalClassName={'monochrome'}
                isActive={modelSource === ModelSource.DOWNLOAD}
            />
        </div>)
    }

    const mapOptions = () => {
        return Object.entries(PretrainedModelDataMap).map(([key, value]) => {
            return <div
                className='options-item'
                onClick={() => setSelectedPretrainedModel(key as PretrainedModel)}
                key={key}
            >
                {key === selectedPretrainedModel ?
                    <img
                        draggable={false}
                        src={'ico/checkbox-checked.png'}
                        alt={'checked'}
                    /> :
                    <img
                        draggable={false}
                        src={'ico/checkbox-unchecked.png'}
                        alt={'unchecked'}
                    />}
                {value.name}
            </div>
        })
    }

    const renderOptions = () => {
        return(<div className='options'>
            {mapOptions()}
        </div>)
    }

    const renderMessage = () => {
        const uploadMessage: string = 'Drag and drop your own YOLOv5 model to speed up your annotation process.'
        const downloadMessage: string = 'Use one of ours pretrained YOLOv5 models to speed up your annotation process.'
        return(<div className='message'>
            {modelSource === ModelSource.DOWNLOAD ? downloadMessage : uploadMessage}
        </div>)
    }

    const renderLoader = () => {
        return(<div className='loader'>
            <ClipLoader
                size={40}
                color={CSSHelper.getLeadingColor()}
                loading={true}
            />
        </div>)
    }

    const renderContent = () => {
        const shouldRenderOptions = !isLoading && modelSource === ModelSource.DOWNLOAD
        return (<div className='load-yolo-v5-model-popup'>
            {renderMenu()}
            <div className='right-container'>
                {isLoading && renderLoader()}
                {!isLoading && renderMessage()}
                {shouldRenderOptions && renderOptions()}
            </div>
        </div>);
    }

    return (
        <GenericYesNoPopup
            title={'Load YOLOv5 model'}
            renderContent={renderContent}
            acceptLabel={'Use model!'}
            onAccept={onAccept}
            rejectLabel={'Back'}
            onReject={onReject}
        />
    );
}

const mapDispatchToProps = {
    updateActivePopupTypeAction: updateActivePopupType,
    submitNewNotificationAction: submitNewNotification
};

const mapStateToProps = (state: AppState) => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoadYOLOv5ModelPopup);
