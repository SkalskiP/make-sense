import {PopupWindowType} from '../../../data/enums/PopupWindowType';
import React from 'react';
import {AppState} from '../../../store';
import {connect} from 'react-redux';
import { updateActivePopupType as storeUpdateActivePopupType } from '../../../store/general/actionCreators';
import {GenericYesNoPopup} from '../GenericYesNoPopup/GenericYesNoPopup';

interface IProps {
    updateActivePopupTypeAction: (activePopupType: PopupWindowType) => void;
}

const LabelCountsStatisticsPopup: React.FC<IProps> = ({ updateActivePopupTypeAction }) => {

    const onReject = () => {
        updateActivePopupTypeAction(null);
    };

    return (
        <GenericYesNoPopup
            title={'Insights'}
            renderContent={() => null}
            skipAcceptButton={true}
            onReject={onReject}
        />
    );
}

const mapDispatchToProps = {
    updateActivePopupTypeAction: storeUpdateActivePopupType
};

const mapStateToProps = (state: AppState) => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LabelCountsStatisticsPopup);
