import React, {useState} from 'react';
import {PopupActions} from '../../../logic/actions/PopupActions';
import {GenericYesNoPopup} from '../GenericYesNoPopup/GenericYesNoPopup';
import {SSDObjectDetector} from '../../../ai/SSDObjectDetector';
import './LoadModelPopup.scss'
import {ClipLoader} from 'react-spinners';
import {AIModel} from '../../../data/enums/AIModel';
import {PoseDetector} from '../../../ai/PoseDetector';
import {findLast} from 'lodash';
import {CSSHelper} from '../../../logic/helpers/CSSHelper';
import {updateActivePopupType as storeUpdateActivePopupType} from '../../../store/general/actionCreators';
import {AppState} from '../../../store';
import {connect} from 'react-redux';
import {PopupWindowType} from '../../../data/enums/PopupWindowType';
import {GeneralActionTypes} from '../../../store/general/types';

interface SelectableModel {
    model: AIModel,
    name: string,
    flag: boolean
}

const models: SelectableModel[] = [
    {
        model: AIModel.YOLO_V5_OBJECT_DETECTION,
        name: 'YOLOv5 - object detection using rectangles',
        flag: false
    },
    {
        model: AIModel.SSD_OBJECT_DETECTION,
        name: 'COCO SSD - object detection using rectangles',
        flag: false
    },
    {
        model: AIModel.POSE_DETECTION,
        name: 'POSE-NET - pose estimation using points',
        flag: false
    }
];

interface IProps {
    updateActivePopupType: (activePopupType: PopupWindowType) => GeneralActionTypes;
}

const LoadModelPopup: React.FC<IProps> = ({ updateActivePopupType }) => {
    const [modelIsLoadingStatus, setModelIsLoadingStatus] = useState(false);
    const [selectedModelToLoad, updateSelectedModelToLoad] = useState(models);

    const extractSelectedModel = (): AIModel => {
        const model: SelectableModel = findLast(selectedModelToLoad, { flag: true });
        if (!!model) {
            return model.model
        } else {
            return null;
        }
    };

    const onAccept = () => {
        setModelIsLoadingStatus(true);
        switch (extractSelectedModel()) {
            case AIModel.POSE_DETECTION:
                PoseDetector.loadModel(() => {
                    PopupActions.close();
                });
                break;
            case AIModel.SSD_OBJECT_DETECTION:
                SSDObjectDetector.loadModel(() => {
                    PopupActions.close();
                });
                break;
            case AIModel.YOLO_V5_OBJECT_DETECTION:
                updateActivePopupType(PopupWindowType.LOAD_YOLO_V5_MODEL);
                break;
        }
    };

    const onSelect = (selectedModel: AIModel) => {
        const nextSelectedModelToLoad: SelectableModel[] = selectedModelToLoad.map((model: SelectableModel) => {
            if (model.model === selectedModel)
                return {
                    ...model,
                    flag: !model.flag
                };
            else
                return {
                    ...model,
                    flag: false
                };
        });
        updateSelectedModelToLoad(nextSelectedModelToLoad);
    };

    const getOptions = () => {
        return selectedModelToLoad.map((entry: SelectableModel) => {
            return <div
                className='OptionsItem'
                onClick={() => onSelect(entry.model)}
                key={entry.model}
            >
                {entry.flag ?
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
                {entry.name}
            </div>
        })
    };

    const onReject = () => {
        PopupActions.close();
    };

    const renderContent = () => {
        return <div className='LoadModelPopupContent'>
            <div className='Message'>
                Speed up your annotation process using AI. Don't worry, your photos are still safe. To take care of
                your privacy, we decided not to send your images to the server, but instead bring AI to you. Make sure
                that you have a fast and stable connection - it may take a while to load the model.
            </div>
            <div className='Companion'>
                {modelIsLoadingStatus ?
                    <ClipLoader
                        size={40}
                        color={CSSHelper.getLeadingColor()}
                        loading={true}
                    /> :
                    <div className='Options'>
                        {getOptions()}
                    </div>
                }
            </div>
        </div>
    };

    return (
        <GenericYesNoPopup
            title={'Say hello to AI'}
            renderContent={renderContent}
            acceptLabel={'Use model!'}
            onAccept={onAccept}
            disableAcceptButton={modelIsLoadingStatus || !extractSelectedModel()}
            rejectLabel={"I'm going on my own"}
            onReject={onReject}
            disableRejectButton={modelIsLoadingStatus}
        />
    );
};

const mapDispatchToProps = {
    updateActivePopupType: storeUpdateActivePopupType
};

const mapStateToProps = (state: AppState) => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoadModelPopup);
