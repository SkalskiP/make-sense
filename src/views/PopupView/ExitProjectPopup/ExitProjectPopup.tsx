import React from 'react';
import './ExitProjectPopup.scss';
import {GenericYesNoPopup} from '../GenericYesNoPopup/GenericYesNoPopup';
import {
    updateActiveImageIndex,
    updateActiveLabelNameId,
    updateFirstLabelCreatedFlag,
    updateImageData,
    updateLabelNames
} from '../../../store/labels/actionCreators';
import {updateActiveContext} from '../../../store/general/actionCreators';

import {AppState} from '../../../store';
import {connect} from 'react-redux';
import {ImageData, LabelName} from '../../../store/labels/types';
import {PopupActions} from '../../../logic/actions/PopupActions';
import {ProjectData} from '../../../store/general/types';
import {updateProjectData} from '../../../store/general/actionCreators';
import {ContextType} from '../../../data/enums/ContextType';
import {ContextManager} from '../../../logic/context/ContextManager';

interface IProps {
    updateActiveImageIndex: (activeImageIndex: number) => any;
    updateActiveLabelNameId: (activeLabelId: string) => any;
    updateLabelNames: (labelNames: LabelName[]) => any;
    updateImageData: (imageData: ImageData[]) => any;
    updateFirstLabelCreatedFlag: (firstLabelCreatedFlag: boolean) => any;
    updateProjectData: (projectData: ProjectData) => any;
    updateActiveContext: (activeContext: ContextType) => any;
}

const ExitProjectPopup: React.FC<IProps> = (props) => {
    const {
        updateActiveLabelNameId,
        updateLabelNames,
        updateActiveImageIndex,
        updateImageData,
        updateFirstLabelCreatedFlag,
        updateProjectData,
        updateActiveContext
    } = props;

    const renderContent = () => {
        return (
            <div className="ExitProjectPopupContent">
                <div className="Message">
                    Are you sure you want to leave the editor? You will
                    permanently lose all your progress.
                </div>
            </div>
        );
    };

    const onAccept = () => {
        updateActiveLabelNameId(null);
        updateLabelNames([]);
        updateProjectData({type: null, name: 'my-project-name'});
        updateActiveImageIndex(null);
        updateImageData([]);
        updateFirstLabelCreatedFlag(false);
        ContextManager.switchCtx(null);
        PopupActions.close();
    };

    const onReject = () => {
        PopupActions.close();
    };

    return (
        <GenericYesNoPopup
            title={'Exit project'}
            renderContent={renderContent}
            acceptLabel={'Exit'}
            onAccept={onAccept}
            rejectLabel={'Back'}
            onReject={onReject}
        />
    );
};

const mapDispatchToProps = {
    updateActiveLabelNameId,
    updateLabelNames,
    updateProjectData,
    updateActiveImageIndex,
    updateImageData,
    updateFirstLabelCreatedFlag,
    updateActiveContext
};

const mapStateToProps = (state: AppState) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ExitProjectPopup);
