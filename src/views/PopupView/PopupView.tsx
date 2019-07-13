import React from 'react';
import './PopupView.scss';
import {PopupWindowType} from "../../data/PopupWindowType";
import {AppState} from "../../store";
import {connect} from "react-redux";
import LoadLabelsPopup from "./LoadLabelsPopup/LoadLabelsPopup";
import ExportLabelPopup from "./ExportLabelsPopup/ExportLabelPopup";

interface IProps {
    activePopupType: PopupWindowType;
}

const PopupView: React.FC<IProps> = ({activePopupType}) => {

    const selectPopup = () => {
        switch (activePopupType) {
            case PopupWindowType.LOAD_LABELS:
                return <LoadLabelsPopup/>;
            case PopupWindowType.EXPORT_LABELS:
                return <ExportLabelPopup/>;
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