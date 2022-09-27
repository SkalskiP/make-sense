import React, {useState} from 'react';
import './LoadRoboflowModelPopup.scss';
import {GenericYesNoPopup} from '../GenericYesNoPopup/GenericYesNoPopup';
import {PopupActions} from '../../../logic/actions/PopupActions';
import {AppState} from '../../../store';
import {connect} from 'react-redux';
import {TextField} from '@mui/material';
import {styled} from '@mui/system';
import {Settings} from '../../../settings/Settings';
import {RoboflowObjectDetector} from '../../../ai/RoboflowObjectDetector';
import {updateActiveLabelType} from '../../../store/labels/actionCreators';
import {LabelsActionTypes} from '../../../store/labels/types';
import {LabelType} from '../../../data/enums/LabelType';
import {updateRoboflowJSObjectDetectorStatus} from '../../../store/ai/actionCreators';
import {AIActionTypes} from '../../../store/ai/types';
import {LabelsSelector} from '../../../store/selectors/LabelsSelector';
import {AIObjectDetectionActions} from '../../../logic/actions/AIObjectDetectionActions';

const StyledTextField = styled(TextField)({
    '& .MuiInputBase-root': {
        color: 'white',
    },
    '& label': {
        color: 'white',
    },
    '& .MuiInput-underline:before': {
        borderBottomColor: 'white',
    },
    '& .MuiInput-underline:hover:before': {
        borderBottomColor: 'white',
    },
    '& label.Mui-focused': {
        color: Settings.SECONDARY_COLOR,
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: Settings.SECONDARY_COLOR,
    }
});


interface IProps {
    updateActiveLabelTypeAction: (activeLabelType: LabelType) => LabelsActionTypes,
    updateRoboflowJSObjectDetectorStatusAction: (isRoboflowJSObjectDetectorLoaded: boolean) => AIActionTypes
}

const LoadRoboflowModelPopup: React.FC<IProps> = ({
        updateActiveLabelTypeAction, updateRoboflowJSObjectDetectorStatusAction
    }) => {
    const [publishableKey, setPublishableKey] = useState('');
    const [modelId, setModelId] = useState('');
    const [modelVersion, setModelVersion] = useState(1);

    const onModelLoadSuccess = () => {
        updateRoboflowJSObjectDetectorStatusAction(true)
        updateActiveLabelTypeAction(LabelType.RECT)
        const activeLabelType: LabelType = LabelsSelector.getActiveLabelType();
        if (activeLabelType === LabelType.RECT) {
            AIObjectDetectionActions.detectRectsForActiveImage();
        }
        PopupActions.close();
    }

    const onModelLoadError = (error: Error) => {
        // tslint:disable-next-line:no-console
        console.log(error)
    }

    const onAccept = () => {
        RoboflowObjectDetector.loadModel(publishableKey, modelId, modelVersion, onModelLoadSuccess, onModelLoadError);
    }

    const onReject = () => {
        PopupActions.close();
    }

    const renderContent = () => {
        return <div className='load-roboflow-model-popup'>
            <div className='message'>
                <a href={'https://roboflow.com/'} target='_blank' rel='noopener noreferrer'>
                    <img
                        draggable={false}
                        alt={'upload'}
                        src={'ico/roboflow-logo.png'}
                    />
                </a>
                <p>Use your pretrained object detection models to speed up annotation.</p>
            </div>

            <StyledTextField
                variant='standard'
                id={'publishable-key'}
                autoComplete={'off'}
                autoFocus={true}
                type={'password'}
                margin={'dense'}
                label={'Publishable key'}
                value={publishableKey}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPublishableKey(event.target.value)}
                style={{ width: 280 }}
                InputLabelProps={{
                    shrink: true
                }}
            />

            <StyledTextField
                variant='standard'
                id={'model-id'}
                autoComplete={'off'}
                autoFocus={false}
                type={'text'}
                margin={'dense'}
                label={'Model id'}
                value={modelId}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setModelId(event.target.value)}
                style={{ width: 280 }}
                InputLabelProps={{
                    shrink: true
                }}
            />

        </div>
    }

    return (
        <GenericYesNoPopup
            title={'Load roboflow.js model'}
            renderContent={renderContent}
            acceptLabel={'Use model!'}
            onAccept={onAccept}
            disableAcceptButton={false}
            rejectLabel={'Cancel'}
            onReject={onReject}
        />
    );
}

const mapDispatchToProps = {
    updateRoboflowJSObjectDetectorStatusAction: updateRoboflowJSObjectDetectorStatus,
    updateActiveLabelTypeAction: updateActiveLabelType,
};

const mapStateToProps = (state: AppState) => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoadRoboflowModelPopup);
