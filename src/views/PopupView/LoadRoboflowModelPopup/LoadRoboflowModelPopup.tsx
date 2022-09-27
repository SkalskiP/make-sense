import React from 'react';
import './LoadRoboflowModelPopup.scss';
import {GenericYesNoPopup} from '../GenericYesNoPopup/GenericYesNoPopup';
import {PopupActions} from '../../../logic/actions/PopupActions';
import {updateActivePopupType} from '../../../store/general/actionCreators';
import {AppState} from '../../../store';
import {connect} from 'react-redux';


const LoadRoboflowModelPopup: React.FC = () => {

    const onAccept = () => {
        PopupActions.close();
    }

    const onReject = () => {
        PopupActions.close();
    }

    const renderContent = () => {
        return null;
    }

    return (
        <GenericYesNoPopup
            title={'Say hello to AI'}
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
    updateActivePopupTypeAction: updateActivePopupType,
};

const mapStateToProps = (state: AppState) => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoadRoboflowModelPopup);
