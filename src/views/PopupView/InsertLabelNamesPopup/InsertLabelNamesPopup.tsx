import React, {useState} from 'react'
import './InsertLabelNamesPopup.scss'
import {GenericYesNoPopup} from "../GenericYesNoPopup/GenericYesNoPopup";
import {PopupWindowType} from "../../../data/enums/PopupWindowType";
import {updateLabelNames} from "../../../store/labels/actionCreators";
import {updateActivePopupType} from "../../../store/general/actionCreators";
import {AppState} from "../../../store";
import {connect} from "react-redux";
import Scrollbars from 'react-custom-scrollbars';
import TextInput from "../../Common/TextInput/TextInput";
import {ImageButton} from "../../Common/ImageButton/ImageButton";
import uuidv1 from 'uuid/v1';
import {LabelName} from "../../../store/labels/types";
import {LabelUtil} from "../../../utils/LabelUtil";
import {LabelsSelector} from "../../../store/selectors/LabelsSelector";
import {LabelActions} from "../../../logic/actions/LabelActions";

interface IProps {
    updateActivePopupType: (activePopupType: PopupWindowType) => any;
    updateLabelNames: (labels: LabelName[]) => any;
    isUpdate: boolean;
}

const InsertLabelNamesPopup: React.FC<IProps> = ({updateActivePopupType, updateLabelNames, isUpdate}) => {
    const initialLabels = LabelUtil.convertLabelNamesListToMap(LabelsSelector.getLabelNames());
    const [labelNames, setLabelNames] = useState(initialLabels);

    const addHandle = () => {
        const newLabelNames = {...labelNames, [uuidv1()]: ""};
        setLabelNames(newLabelNames);
    };

    const deleteHandle = (key: string) => {
        const newLabelNames = {...labelNames};
        delete newLabelNames[key];
        setLabelNames(newLabelNames);
    };

    const labelInputs = Object.keys(labelNames).map((key: string) => {
        return <div className="LabelEntry" key={key}>
                <TextInput
                    key={key}
                    value={labelNames[key]}
                    isPassword={false}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChange(key, event.target.value)}
                    label={"Insert label"}
                />
                <ImageButton
                    image={"ico/trash.png"}
                    imageAlt={"remove_label"}
                    buttonSize={{width: 30, height: 30}}
                    onClick={() => deleteHandle(key)}
                />
            </div>
    });

    const onChange = (key: string, value: string) => {
        const newLabelNames = {...labelNames, [key]: value};
        setLabelNames(newLabelNames);
    };

    const onCreateAccept = () => {
        const labelNamesList: string[] = extractLabelNamesList();
        if (labelNamesList.length > 0) {
            updateLabelNames(LabelUtil.convertMapToLabelNamesList(labelNames));
        }
        updateActivePopupType(PopupWindowType.LOAD_AI_MODEL);
    };

    const onUpdateAccept = () => {
        const labelNamesList: string[] = extractLabelNamesList();
        const updatedLabelNamesList: LabelName[] = LabelUtil.convertMapToLabelNamesList(labelNames);
        const missingIds: string[] = LabelUtil.labelNamesIdsDiff(LabelsSelector.getLabelNames(), updatedLabelNamesList);
        LabelActions.removeLabelNames(missingIds);
        if (labelNamesList.length > 0) {
            updateLabelNames(LabelUtil.convertMapToLabelNamesList(labelNames));
            updateActivePopupType(null);
        }
    };

    const onCreateReject = () => {
        updateActivePopupType(PopupWindowType.LOAD_LABEL_NAMES);
    };

    const onUpdateReject = () => {
        updateActivePopupType(null);
    };


    const extractLabelNamesList = (): string[] => {
        return Object.values(labelNames).filter((value => !!value)) as string[];
    };

    const renderContent = () => {
        return(<div className="InsertLabelNamesPopup">
            <div className="LeftContainer">
                <ImageButton
                    image={"ico/plus.png"}
                    imageAlt={"plus"}
                    buttonSize={{width: 40, height: 40}}
                    padding={25}
                    onClick={addHandle}
                />
            </div>
            <div className="RightContainer">
                <div className="Message">
                    {
                        isUpdate ?
                        "You can now edit the label names you use to describe the objects in the photos. " :
                        "Before you start, you can create a list of labels you would like to use in your project. " +
                            "You can also load labels list from a file or create it along the way."
                    }
                    Use the + button to add a new empty text field.
                </div>
                <div className="LabelsContainer">
                    {Object.keys(labelNames).length !== 0 ? <Scrollbars>
                        <div
                            className="InsertLabelNamesPopupContent"
                        >
                            {labelInputs}
                        </div>
                    </Scrollbars> :
                    <div
                        className="EmptyList"
                        onClick={addHandle}
                    >
                        <img
                            draggable={false}
                            alt={"upload"}
                            src={"img/type-writer.png"}
                        />
                        <p className="extraBold">Your label list is empty</p>
                    </div>}
                </div>
            </div>
        </div>);
    };

    return(
        <GenericYesNoPopup
            title={isUpdate ? "Edit label names list" : "Create label names list"}
            renderContent={renderContent}
            acceptLabel={isUpdate ? "Accept" : "Start project"}
            onAccept={isUpdate ? onUpdateAccept : onCreateAccept}
            rejectLabel={isUpdate ? "Cancel" : "Load labels from file"}
            onReject={isUpdate ? onUpdateReject : onCreateReject}
        />)
};

const mapDispatchToProps = {
    updateActivePopupType,
    updateLabelNames
};

const mapStateToProps = (state: AppState) => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(InsertLabelNamesPopup);
