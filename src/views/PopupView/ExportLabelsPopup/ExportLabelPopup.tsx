import React, {useState} from 'react'
import './ExportLabelPopup.scss'
import {ExportFormatType} from "../../../data/enums/ExportFormatType";
import {RectLabelsExporter} from "../../../logic/export/RectLabelsExporter";
import {LabelType} from "../../../data/enums/LabelType";
import {IExportFormat} from "../../../interfaces/IExportFormat";
import {RectExportFormatData} from "../../../data/export/RectExportFormatData";
import {PointExportFormatData} from "../../../data/export/PointExportFormatData";
import {PointLabelsExporter} from "../../../logic/export/PointLabelsExport";
import {PolygonExportFormatData} from "../../../data/export/PolygonExportFormatData";
import {PolygonLabelsExporter} from "../../../logic/export/polygon/PolygonLabelsExporter";
import {PopupActions} from "../../../logic/actions/PopupActions";
import {LineExportFormatData} from "../../../data/export/LineExportFormatData";
import {LineLabelsExporter} from "../../../logic/export/LineLabelExport";
import {TagExportFormatData} from "../../../data/export/TagExportFormatData";
import {TagLabelsExporter} from "../../../logic/export/TagLabelsExport";
import GenericLabelTypePopup from "../GenericLabelTypePopup/GenericLabelTypePopup";


export const ExportLabelPopup: React.FC = () => {
    const [exportFormatType, setExportFormatType] = useState(null);

    const onAccept = (labelType: LabelType) => {
        if (!exportFormatType) return;
        switch (labelType) {
            case LabelType.RECTANGLE:
                RectLabelsExporter.export(exportFormatType);
                break;
            case LabelType.POINT:
                PointLabelsExporter.export(exportFormatType);
                break;
            case LabelType.LINE:
                LineLabelsExporter.export(exportFormatType);
                break;
            case LabelType.POLYGON:
                PolygonLabelsExporter.export(exportFormatType);
                break;
            case LabelType.NAME:
                TagLabelsExporter.export(exportFormatType);
                break;
        }
        PopupActions.close();
    };

    const onReject = (labelType: LabelType) => {
        PopupActions.close();
    };

    const onSelect = (exportFormatType: ExportFormatType) => {
        setExportFormatType(exportFormatType);
    };

    const getOptions = (exportFormatData: IExportFormat[]) => {
        return exportFormatData.map((entry: IExportFormat) => {
            return <div
                className="OptionsItem"
                onClick={() => onSelect(entry.type)}
                key={entry.type}
            >
                {entry.type === exportFormatType ?
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
        return [
            <div className="Message">
                Select label type and the file format you would like to use for exporting labels.
            </div>,
            <div className="Options">
                {labelType === LabelType.RECTANGLE && getOptions(RectExportFormatData)}
                {labelType === LabelType.POINT && getOptions(PointExportFormatData)}
                {labelType === LabelType.LINE && getOptions(LineExportFormatData)}
                {labelType === LabelType.POLYGON && getOptions(PolygonExportFormatData)}
                {labelType === LabelType.NAME && getOptions(TagExportFormatData)}
            </div>
        ]
    }

    const onLabelTypeChange = (labelType: LabelType) => {
        setExportFormatType(null);
    }

    return(
        <GenericLabelTypePopup
            title={"Export annotations"}
            onLabelTypeChange={onLabelTypeChange}
            acceptLabel={"Export"}
            onAccept={onAccept}
            rejectLabel={"I'm not ready yet"}
            onReject={onReject}
            renderInternalContent={renderInternalContent}
        />
    )
};