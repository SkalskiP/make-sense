import React from 'react';
import './PopupView.scss';
import {PopupWindowType} from "../../data/PopupWindowType";
import {AppState} from "../../store";
import {connect} from "react-redux";
import LoadLabelsPopup from "./LoadLabelNamesPopup/LoadLabelNamesPopup";
import ExportLabelPopup from "./ExportLabelsPopup/ExportLabelPopup";
import InsertLabelNamesPopup from "./InsertLabelNamesPopup/InsertLabelNamesPopup";
import ExitProjectPopup from "./ExitProjectPopup/ExitProjectPopup";
import LoadMoreImagesPopup from "./LoadMoreImagesPopup/LoadMoreImagesPopup";

interface IProps {
    activePopupType: PopupWindowType;
}

const PopupView: React.FC<IProps> = ({activePopupType}) => {

    const selectPopup = () => {
        switch (activePopupType) {
            case PopupWindowType.LOAD_LABEL_NAMES:
                return <LoadLabelsPopup/>;
            case PopupWindowType.EXPORT_LABELS:
                return <ExportLabelPopup/>;
            case PopupWindowType.INSERT_LABEL_NAMES:
                return <InsertLabelNamesPopup/>;
            case PopupWindowType.EXIT_PROJECT:
                return <ExitProjectPopup/>;
            case PopupWindowType.LOAD_IMAGES:
                return <LoadMoreImagesPopup/>;
            default:
                return null;
        }
    };

    return (
        activePopupType && <div className="PopupView">
            {selectPopup()}
        </div>
    );
};

const mapStateToProps = (state: AppState) => ({
    activePopupType: state.general.activePopupType
});

export default connect(
    mapStateToProps
)(PopupView);