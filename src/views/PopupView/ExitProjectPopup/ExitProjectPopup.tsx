import React, {useState} from 'react'
import './ExitProjectPopup.scss'
import {PopupWindowType} from "../../../data/PopupWindowType";
import {GenericYesNoPopup} from "../GenericYesNoPopup/GenericYesNoPopup";
import {updateActiveLabelNameIndex, updateLabelNamesList} from "../../../store/editor/actionCreators";
import {updateActivePopupType} from "../../../store/general/actionCreators";
import {AppState} from "../../../store";
import {connect} from "react-redux";

interface IProps {
    updateActiveLabelNameIndex: (activeLabelIndex: number) => any;
    updateLabelNamesList: (labelNames: string[]) => any;
    updateActivePopupType: (activePopupType: PopupWindowType) => any;
}

const ExitProjectPopup: React.FC<IProps> = ({updateActiveLabelNameIndex, updateLabelNamesList, updateActivePopupType}) => {
    const renderContent = () => {

    };

    const onAccept = () => {

    };

    const onReject = () => {

    };

    return(
        <GenericYesNoPopup
            title={"Exit project"}
            renderContent={renderContent}
            acceptLabel={"Exit"}
            onAccept={onAccept}
            rejectLabel={"Back"}
            onReject={onReject}
        />)
};

const mapDispatchToProps = {
    updateActiveLabelNameIndex,
    updateLabelNamesList,
    updateActivePopupType,
};

const mapStateToProps = (state: AppState) => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ExitProjectPopup);