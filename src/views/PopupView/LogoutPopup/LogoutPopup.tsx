import React from 'react';
import './LogoutPopup.scss';
import {GenericYesNoPopup} from '../GenericYesNoPopup/GenericYesNoPopup';
import {
    updateActiveImageIndex,
    updateActiveLabelNameId,
    updateFirstLabelCreatedFlag,
    updateImageData,
    updateLabelNames
} from '../../../store/labels/actionCreators';
import {AppState} from '../../../store';
import {connect} from 'react-redux';
import {ImageData, LabelName} from '../../../store/labels/types';
import {PopupActions} from '../../../logic/actions/PopupActions';
import {ProjectData} from '../../../store/general/types';
import {
    updateActivePopupType,
    updateProjectData
} from '../../../store/general/actionCreators';
import {updateAuthData} from '../../../store/auth/actionCreators';
import {AuthData} from '../../../store/auth/types';
import {PopupWindowType} from '../../../data/enums/PopupWindowType';

interface IProps {
    updateActiveImageIndex: (activeImageIndex: number) => any;
    updateActiveLabelNameId: (activeLabelId: string) => any;
    updateLabelNames: (labelNames: LabelName[]) => any;
    updateImageData: (imageData: ImageData[]) => any;
    updateFirstLabelCreatedFlag: (firstLabelCreatedFlag: boolean) => any;
    updateProjectData: (projectData: ProjectData) => any;
    updateAuthDataAction: (authData: AuthData) => any;
    updateActivePopupType: (type: PopupWindowType) => any;
}

const LogoutPopup: React.FC<IProps> = (props) => {
    const {
        updateActiveLabelNameId,
        updateLabelNames,
        updateActiveImageIndex,
        updateImageData,
        updateFirstLabelCreatedFlag,
        updateProjectData,
        updateAuthDataAction
    } = props;

    const renderContent = () => {
        return (
            <div className="LogoutPopupContent">
                <div className="Message">
                    Are you sure you want to logout? You will permanently lose
                    all your progress.
                </div>
            </div>
        );
    };

    const onAccept = () => {
        updateAuthDataAction({
            email: null,
            displayName: null,
            authToken: null,
            role: null
        });
        window.localStorage.removeItem('@@auth');
        updateActiveLabelNameId(null);
        updateLabelNames([]);
        updateProjectData({type: null, name: 'my-project-name'});
        updateActiveImageIndex(null);
        updateImageData([]);
        updateFirstLabelCreatedFlag(false);
        PopupActions.close();
    };

    const onReject = () => {
        PopupActions.close();
    };

    return (
        <GenericYesNoPopup
            title={'Logout'}
            renderContent={renderContent}
            acceptLabel={'OK'}
            onAccept={onAccept}
            rejectLabel={'Cancel'}
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
    updateAuthDataAction: updateAuthData,
    updateActivePopupType
};

const mapStateToProps = (state: AppState) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(LogoutPopup);
