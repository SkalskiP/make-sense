import React, {useState} from 'react'
import './InsertLabelNamesPopup.scss'
import {GenericYesNoPopup} from "../GenericYesNoPopup/GenericYesNoPopup";
import {PopupWindowType} from "../../../data/PopupWindowType";
import {updateActiveLabelIndex, updateLabelNamesList} from "../../../store/editor/actionCreators";
import {updateActivePopupType} from "../../../store/general/actionCreators";
import {AppState} from "../../../store";
import {connect} from "react-redux";
import Scrollbars from 'react-custom-scrollbars';
import TextInput from "../../Common/TextInput/TextInput";

interface IProps {
    updateActiveLabelIndex: (activeLabelIndex: number) => any;
    updateLabelNamesList: (labelNames: string[]) => any;
    updateActivePopupType: (activePopupType: PopupWindowType) => any;
}

const InsertLabelNamesPopup: React.FC<IProps> = ({updateActiveLabelIndex, updateLabelNamesList, updateActivePopupType}) => {
    const onAccept = () => {};

    const onReject = () => {
        updateActivePopupType(PopupWindowType.LOAD_LABEL_NAMES);
    };

    const renderContent = () => {
        return(<div className="InsertLabelNamesPopup">
            <Scrollbars>
                <div
                    className="InsertLabelNamesPopupContent"
                >
                    <TextInput
                        key={"1"}
                        isPassword={false}
                        onChange={() => {}}
                    />
                    <TextInput
                        key={"1"}
                        isPassword={false}
                        onChange={() => {}}
                    />
                </div>
            </Scrollbars>
        </div>);
    };

    return(
        <GenericYesNoPopup
            title={"Create label names list"}
            renderContent={renderContent}
            acceptLabel={"Create"}
            onAccept={onAccept}
            rejectLabel={"Back"}
            onReject={onReject}
        />)
};

const mapDispatchToProps = {
    updateActiveLabelIndex,
    updateLabelNamesList,
    updateActivePopupType,
};

const mapStateToProps = (state: AppState) => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(InsertLabelNamesPopup);