import React from 'react'
import './ExitProjectPopup.scss'
import {GenericYesNoPopup} from "../GenericYesNoPopup/GenericYesNoPopup";
import {
    updateActiveImageIndex,
    updateActiveLabelNameIndex,
    updateFirstLabelCreatedFlag,
    updateImageData,
    updateLabelNamesList,
    updateProjectType
} from "../../../store/editor/actionCreators";
import {AppState} from "../../../store";
import {connect} from "react-redux";
import {ProjectType} from "../../../data/enums/ProjectType";
import {ImageData} from "../../../store/editor/types";
import {PopupActions} from "../../../logic/actions/PopupActions";

interface IProps {
    updateActiveImageIndex: (activeImageIndex: number) => any;
    updateProjectType: (projectType: ProjectType) => any;
    updateActiveLabelNameIndex: (activeLabelIndex: number) => any;
    updateLabelNamesList: (labelNames: string[]) => any;
    updateImageData: (imageData: ImageData[]) => any;
    updateFirstLabelCreatedFlag: (firstLabelCreatedFlag: boolean) => any;
}

const ExitProjectPopup: React.FC<IProps> = (props) => {
    const {
        updateActiveLabelNameIndex,
        updateLabelNamesList,
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
        updateImageData([]);
        updateFirstLabelCreatedFlag(false);
        PopupActions.close();
    };

    const onReject = () => {
        PopupActions.close();
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