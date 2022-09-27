import React, {useState} from 'react';
import {PopupActions} from '../../../logic/actions/PopupActions';
import {GenericYesNoPopup} from '../GenericYesNoPopup/GenericYesNoPopup';
import {ObjectDetector} from '../../../ai/ObjectDetector';
import './LoadModelPopup.scss'
import {ClipLoader} from 'react-spinners';
import {AIModel} from '../../../data/enums/AIModel';
import {PoseDetector} from '../../../ai/PoseDetector';
import {findLast} from 'lodash';
import {CSSHelper} from '../../../logic/helpers/CSSHelper';
import {updateActivePopupType} from '../../../store/general/actionCreators';
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
        model: AIModel.OBJECT_DETECTION,
        name: 'COCO SSD - local object detection using rectangles',
        flag: false
    },
    {
        model: AIModel.POSE_DETECTION,
        name: 'POSE-NET - local pose estimation using points',
        flag: false
    },
    {
        model: AIModel.ROBOFLOW_JS_OBJECT_DETECTION,
        name: 'roboflow.js - local object detection using roboflow',
        flag: false
    }
];

interface IProps {
    updateActivePopupTypeAction: (activePopupType: PopupWindowType) => GeneralActionTypes;
}

const LoadModelPopup: React.FC<IProps> = ({ updateActivePopupTypeAction }) => {
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
            case AIModel.OBJECT_DETECTION:
                ObjectDetector.loadModel(() => {
                    PopupActions.close();
                });
                break;
            case AIModel.ROBOFLOW_JS_OBJECT_DETECTION:
                updateActivePopupTypeAction(PopupWindowType.LOAD_ROBOFLOW_JS_MODEL)
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
                To speed up your work, you can use our AI, which will try to mark objects on your images. Don't worry,
                your photos are still safe. To take care of your privacy, we decided not to send your images to the
                server, but instead send our AI to you. When accepting, make sure that you have a fast and stable
                connection - it may take a few minutes to load the model.
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
            rejectLabel={'Cancel'}
            onReject={onReject}
            disableRejectButton={modelIsLoadingStatus}
        />
    );
};

const mapDispatchToProps = {
    updateActivePopupTypeAction: updateActivePopupType,
};

const mapStateToProps = (state: AppState) => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoadModelPopup);
