import React, {useState} from 'react';
import './LabelInfoPopup.scss';
import {AppState} from '../../../store';
import {connect} from 'react-redux';
import {ImageButton} from '../../Common/ImageButton/ImageButton';
import {ImageData} from '../../../store/labels/types';
import {GenericYesNoPopup} from '../GenericYesNoPopup/GenericYesNoPopup';
import {updateActivePopupType} from '../../../store/general/actionCreators';
import {PopupWindowType} from '../../../data/enums/PopupWindowType';

interface IProps {
    labelRectId: string;
    imageData: ImageData;
    updateActivePopupTypeAction: (popupType: PopupWindowType) => any;
}

const LabelInfoPopup: React.FC<IProps> = ({
    labelRectId,
    imageData,
    updateActivePopupTypeAction
}) => {
    const renderContent = () => {
        return <div className="LabelInfoPopupContent">{labelRectId}</div>;
    };

    return (
        <GenericYesNoPopup
            title={'Label Info'}
            renderContent={renderContent}
            acceptLabel={'Save'}
            onAccept={() => updateActivePopupTypeAction(null)}
            rejectLabel={'Cancel'}
            onReject={() => updateActivePopupTypeAction(null)}
        />
    );
};

const mapDispatchToProps = {
    updateActivePopupTypeAction: updateActivePopupType
};

const mapStateToProps = (state: AppState) => ({
    imageData: state.labels.imagesData[state.labels.activeImageIndex],
    labelRectId: state.labels.activeLabelId
});

export default connect(mapStateToProps, mapDispatchToProps)(LabelInfoPopup);
