import React, {useState} from 'react'
import './ExitProjectPopup.scss'
import {PopupWindowType} from "../../../data/PopupWindowType";
import {GenericYesNoPopup} from "../GenericYesNoPopup/GenericYesNoPopup";
import {
    updateActiveImageIndex,
    updateActiveLabelNameIndex, updateFirstLabelCreatedFlag, updateImageData,
    updateLabelNamesList,
    updateProjectType
} from "../../../store/editor/actionCreators";
import {updateActivePopupType} from "../../../store/general/actionCreators";
import {AppState} from "../../../store";
import {connect} from "react-redux";
import {ProjectType} from "../../../data/ProjectType";
import {ImageData} from "../../../store/editor/types";

interface IProps {
    updateActiveImageIndex: (activeImageIndex: number) => any;
    updateProjectType: (projectType: ProjectType) => any;
    updateActiveLabelNameIndex: (activeLabelIndex: number) => any;
    updateLabelNamesList: (labelNames: string[]) => any;
    updateActivePopupType: (activePopupType: PopupWindowType) => any;
    updateImageData: (imageData: ImageData[]) => any;
    updateFirstLabelCreatedFlag: (firstLabelCreatedFlag: boolean) => any;
}

const ExitProjectPopup: React.FC<IProps> = (props) => {
    const {
        updateActiveLabelNameIndex,
        updateLabelNamesList,
        updateActivePopupType,
        updateProjectType,
        updateActiveImageIndex,
        updateImageData,
        updateFirstLabelCreatedFlag
    } = props;

    const renderContent = () => {
        return(
            <div className="ExitProjectPopupContent">
                <div className="Message">
                    Are you sure you want to leave the editor? You will permanently lose all your progress.
                </div>
            </div>
        )
    };

    const onAccept = () => {
        updateActiveLabelNameIndex(null);
        updateLabelNamesList([]);
        updateProjectType(null);
        updateActiveImageIndex(null);
        updateActivePopupType(null);
        updateImageData([]);
        updateFirstLabelCreatedFlag(false);
    };

    const onReject = () => {
        updateActivePopupType(null);
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
    updateProjectType,
    updateActiveImageIndex,
    updateImageData,
    updateFirstLabelCreatedFlag
};

const mapStateToProps = (state: AppState) => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ExitProjectPopup);