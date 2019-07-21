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
import {ImageButton} from "../../Common/ImageButton/ImageButton";
import uuidv1 from 'uuid/v1';

interface IProps {
    updateActiveLabelIndex: (activeLabelIndex: number) => any;
    updateLabelNamesList: (labelNames: string[]) => any;
    updateActivePopupType: (activePopupType: PopupWindowType) => any;
}

const InsertLabelNamesPopup: React.FC<IProps> = ({updateActiveLabelIndex, updateLabelNamesList, updateActivePopupType}) => {
    const [labelNames, setLabelNames] = useState({});

    const addHandle = () => {
        const newLabelNames = {...labelNames, [uuidv1()]: ""};
        setLabelNames(newLabelNames);
    };

    const deleteHandle = (key: string) => {
        const newLabelNames = {...labelNames};
        console.log("BEFORE");
        console.log(newLabelNames);
        delete newLabelNames[key];
        console.log("AFTER");
        console.log(newLabelNames);
        setLabelNames(newLabelNames);
    };

    const labelInputs = Object.keys(labelNames).map((key: string) => {
        return <div className="LabelEntry" key={key}>
                <TextInput
                    key={key}
                    isPassword={false}
                    onChange={(value: string) => onChange(key, value)}
                />
                <ImageButton
                    image={"ico/trash.png"}
                    imageAlt={"remove_label"}
                    size={{width: 30, height: 30}}
                    onClick={() => deleteHandle(key)}
                />
            </div>
    });

    const onChange = (key: string, value: string) => {
        const newLabelNames = {...labelNames, [key]: value};
        setLabelNames(newLabelNames);
    };

    const onAccept = () => {
        const labelNamesList: string[] = extractLabelNamesList();
        updateLabelNamesList(labelNamesList);
        updateActivePopupType(null);
    };

    const extractLabelNamesList = (): string[] => {
        return Object.values(labelNames).filter((value => !!value)) as string[];
    };

    const onReject = () => {
        updateActivePopupType(PopupWindowType.LOAD_LABEL_NAMES);
    };

    const renderContent = () => {
        return(<div className="InsertLabelNamesPopup">
            <div className="LeftContainer">
                <ImageButton
                    image={"ico/plus.png"}
                    imageAlt={"plus"}
                    size={{width: 40, height: 40}}
                    onClick={addHandle}
                />
            </div>
            <div className="RightContainer">
                <div className="Message">
                    Enter below the labels names you want to use in your projections. Use + to add another empty text field.
                </div>
                <div className="LabelsContainer">
                    <Scrollbars>
                        <div
                            className="InsertLabelNamesPopupContent"
                        >
                            {labelInputs}
                        </div>
                    </Scrollbars>
                </div>
            </div>
        </div>);
    };

    return(
        <GenericYesNoPopup
            title={"Create label names list"}
            renderContent={renderContent}
            acceptLabel={"Start project"}
            onAccept={onAccept}
            disableAcceptButton={extractLabelNamesList().length === 0}
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