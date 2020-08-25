import React, {useState} from 'react'
import './ImportLabelPopup.scss'
import {LabelFormatType} from "../../../data/enums/LabelFormatType";
import {LabelType} from "../../../data/enums/LabelType";
import {ILabelFormatData} from "../../../interfaces/ILabelFormatData";
import {PopupActions} from "../../../logic/actions/PopupActions";
import GenericLabelTypePopup from "../GenericLabelTypePopup/GenericLabelTypePopup";
import {ImportFormatData} from "../../../data/ImportFormatData";
import {FeatureInProgress} from "../../EditorView/FeatureInProgress/FeatureInProgress";


export const ImportLabelPopup: React.FC = () => {
    const [importFormatType, setImportFormatType] = useState(null);

    const onAccept = (labelType: LabelType) => {
        if (!importFormatType) return;
        PopupActions.close();
    };

    const onReject = (labelType: LabelType) => {
        PopupActions.close();
    };

    const onSelect = (importFormatType: LabelFormatType) => {
        setImportFormatType(importFormatType);
    };

    const getOptions = (importFormatData: ILabelFormatData[]) => {
        return importFormatData.map((entry: ILabelFormatData) => {
            return <div
                className="OptionsItem"
                onClick={() => onSelect(entry.type)}
                key={entry.type}
            >
                {entry.type === importFormatType ?
                    <img
                        draggable={false}
                        src={"ico/checkbox-checked.png"}
                        alt={"checked"}
                    /> :
                    <img
                        draggable={false}
                        src={"ico/checkbox-unchecked.png"}
                        alt={"unchecked"}
                    />}
                {entry.label}
            </div>
        })
    };

    const renderInternalContent = (labelType: LabelType) => {
        const importFormatData = ImportFormatData[labelType];
        return importFormatData.length === 0 ? [
            <FeatureInProgress/>
        ] : [
            <div className="Message">
                Select file format you would like to use to import labels.
            </div>,
            <div className="Options">
                {getOptions(importFormatData)}
            </div>
        ]
    }

    const onLabelTypeChange = (labelType: LabelType) => {
        setImportFormatType(null);
    }

    return(
        <GenericLabelTypePopup
            title={"Import annotations"}
            onLabelTypeChange={onLabelTypeChange}
            acceptLabel={"Import"}
            onAccept={onAccept}
            rejectLabel={"Cancel"}
            onReject={onReject}
            renderInternalContent={renderInternalContent}
        />
    )
};