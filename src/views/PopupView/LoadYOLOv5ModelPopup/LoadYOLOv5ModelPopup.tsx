import React, {useState} from 'react';
import './LoadYOLOv5ModelPopup.scss'
import {GenericYesNoPopup} from '../GenericYesNoPopup/GenericYesNoPopup';
import {PopupActions} from '../../../logic/actions/PopupActions';
import {ImageButton} from '../../Common/ImageButton/ImageButton';
import {
    ModelConfig,
    YOLO_V5_M_COCO_MODEL_CONFIG,
    YOLO_V5_N_COCO_MODEL_CONFIG,
    YOLO_V5_S_COCO_MODEL_CONFIG
} from 'yolov5js'
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
import {useDropzone} from 'react-dropzone';
import {YOLOUtils} from '../../../logic/import/yolo/YOLOUtils';
import {LabelName} from '../../../store/labels/types';
import {LabelNamesNotUniqueError} from '../../../logic/import/yolo/YOLOErrors';

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

    // BUSINESS LOGIC

    const [modelSource, setModelSource] = useState(ModelSource.UPLOAD);
    const [selectedPretrainedModel, setSelectedPretrainedModel] = useState(PretrainedModel.YOLO_V5_N_COCO);
    const [isLoading, setIsLoading] = useState(false);
    const [modelFiles, setModeFiles] = useState([]);
    const [classNames, setClassNames] = useState([]);

    const onDrop = (accepted: File[]) => {
        const jsonFiles = accepted.filter((file: File) => file.name.endsWith('json'));
        const binFiles = accepted.filter((file: File) => file.name.endsWith('bin'));
        const txtFiles = accepted.filter((file: File) => file.name.endsWith('txt'));

        if (txtFiles.length === 0) {
            submitNewNotificationAction(NotificationUtil.createErrorNotification(
                NotificationsDataMap[Notification.LABELS_FILE_UPLOAD_ERROR]))
        }

        if (jsonFiles.length === 1 && txtFiles.length === 1 && binFiles.length > 0) {
            const onSuccess = (labels: LabelName[]) => {
                setClassNames(labels)
                setModeFiles([...jsonFiles, ...binFiles])
            }
            const onFailure = (error) => {
                if (error instanceof LabelNamesNotUniqueError) {
                    submitNewNotificationAction(NotificationUtil
                        .createErrorNotification(NotificationsDataMap[Notification.NON_UNIQUE_LABEL_NAMES_ERROR]));
                }
            }
            YOLOUtils.loadLabelsList(txtFiles[0], onSuccess, onFailure)
        }
    }

    const {acceptedFiles, getRootProps, getInputProps} = useDropzone({ onDrop });

    const onAccept = () => {
        const onSuccess = () => {
            PopupActions.close();
        }
        const onFailure = () => {
            setIsLoading(false)
            const notification = modelSource === ModelSource.UPLOAD ?
                Notification.MODEL_LOAD_ERROR : Notification.MODEL_DOWNLOAD_ERROR
            submitNewNotificationAction(NotificationUtil.createErrorNotification(NotificationsDataMap[notification]
            ))
        }
        setIsLoading(true)
        if (modelSource === ModelSource.DOWNLOAD) {
            YOLOV5ObjectDetector.loadModel(PretrainedModelDataMap[selectedPretrainedModel].config, onSuccess, onFailure)
        } else {
            const config = { source: modelFiles, classNames: classNames.map((className: LabelName) => className.name) }
            YOLOV5ObjectDetector.loadModel(config, onSuccess, onFailure)
        }
    }

    const onReject = () => {
        updateActivePopupTypeAction(PopupWindowType.LOAD_AI_MODEL);
    }

    const changeModelSource = (source: ModelSource) => {
        setModelSource(source)
        setModeFiles([])
        setClassNames([])
    }

    // RENDER

    const renderMenu = () => {
        return(<div className='left-container'>
            <ImageButton
                image={'ico/upload.png'}
                imageAlt={'upload model weights'}
                buttonSize={{ width: 40, height: 40 }}
                padding={15}
                onClick={() => changeModelSource(ModelSource.UPLOAD)}
                externalClassName={'monochrome'}
                isActive={modelSource === ModelSource.UPLOAD}
            />
            <ImageButton
                image={'ico/download.png'}
                imageAlt={'download model weights'}
                buttonSize={{ width: 40, height: 40 }}
                padding={15}
                onClick={() => changeModelSource(ModelSource.DOWNLOAD)}
                externalClassName={'monochrome'}
                isActive={modelSource === ModelSource.DOWNLOAD}
            />
        </div>)
    }

    const getOptionsContent = () => {
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
            {getOptionsContent()}
        </div>)
    }

    const renderMessage = () => {
        const uploadMessage: string = 'Drag and drop your own YOLOv5 model converted to tensorflow.js format and ' +
            'speed up annotation process. Make sure to upload all required files: model.json, model shards as well ' +
            'as .txt containing list of detected classes names.'
        const downloadMessage: string = 'Use one of ours pretrained YOLOv5 models to speed up annotation process.'
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

    const getDropZoneContent = () => {
        if (modelFiles.length === 0 && classNames.length === 0) {
            return <>
                <input {...getInputProps()} />
                <img
                    draggable={false}
                    alt={'upload'}
                    src={'ico/box-opened.png'}
                />
                <p className='extraBold'>Drop model files</p>
                <p>or</p>
                <p className='extraBold'>Click here to select them</p>
            </>;
        } else {
            return <>
                <input {...getInputProps()} />
                <img
                    draggable={false}
                    alt={'uploaded'}
                    src={'ico/box-closed.png'}
                />
                <p className='extraBold'>{modelFiles.length} model files</p>
                <p className='extraBold'>{classNames.length} class names</p>
            </>;
        }

    }

    const renderDropZone = () => {
        return(<div {...getRootProps({ className: 'drop-zone' })}>
            {getDropZoneContent()}
        </div>)
    }

    const renderContent = () => {
        const shouldRenderDropZone = !isLoading && modelSource === ModelSource.UPLOAD
        const shouldRenderOptions = !isLoading && modelSource === ModelSource.DOWNLOAD
        return (<div className='load-yolo-v5-model-popup'>
            {renderMenu()}
            <div className='right-container'>
                {isLoading && renderLoader()}
                {!isLoading && renderMessage()}
                {shouldRenderOptions && renderOptions()}
                {shouldRenderDropZone && renderDropZone()}
            </div>
        </div>);
    }

    const disableAcceptButton = modelSource === ModelSource.UPLOAD &&
        (modelFiles.length === 0 || classNames.length === 0)

    return (
        <GenericYesNoPopup
            title={'Load YOLOv5 model'}
            renderContent={renderContent}
            disableAcceptButton={disableAcceptButton}
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
