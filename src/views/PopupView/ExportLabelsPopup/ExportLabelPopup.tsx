import React, {useState} from 'react'
import './ExportLabelPopup.scss'
import {GenericYesNoPopup} from "../GenericYesNoPopup/GenericYesNoPopup";
import {AppState} from "../../../store";
import {connect} from "react-redux";
import {ExportFormatType} from "../../../data/enums/ExportFormatType";
import {RectLabelsExporter} from "../../../logic/export/RectLabelsExporter";
import {LabelType} from "../../../data/enums/LabelType";
import {ImageButton} from "../../Common/ImageButton/ImageButton";
import {IExportFormat} from "../../../interfaces/IExportFormat";
import {RectExportFormatData} from "../../../data/export/RectExportFormatData";
import {PointExportFormatData} from "../../../data/export/PointExportFormatData";
import {PointLabelsExporter} from "../../../logic/export/PointLabelsExport";
import {PolygonExportFormatData} from "../../../data/export/PolygonExportFormatData";
import {PolygonLabelsExporter} from "../../../logic/export/PolygonLabelsExporter";
import {PopupActions} from "../../../logic/actions/PopupActions";
import {LineExportFormatData} from "../../../data/export/LineExportFormatData";
import {LineLabelsExporter} from "../../../logic/export/LineLabelExport";
import {TagExportFormatData} from "../../../data/export/TagExportFormatData";
import {TagLabelsExporter} from "../../../logic/export/TagLabelsExport";

interface IProps {
    activeLabelType: LabelType
}

const ExportLabelPopup: React.FC<IProps> = ({activeLabelType}) => {
    const [exportLabelType, setExportLabelType] = useState(activeLabelType);
    const [exportFormatType, setExportFormatType] = useState(null);

    const onAccept = () => {
        if (!exportFormatType) return;
        switch (exportLabelType) {
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

    const onReject = () => {
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

    const renderContent = () => {
        return(<div className="ExportLabelPopupContent">
            {activeLabelType !== LabelType.NAME && <div className="LeftContainer">
                <ImageButton
                    image={"ico/rectangle.png"}
                    imageAlt={"rectangle"}
                    buttonSize={{width: 40, height: 40}}
                    padding={20}
                    onClick={() => {
                        setExportLabelType(LabelType.RECTANGLE);
                        setExportFormatType(null);
                    }}
                    isActive={exportLabelType === LabelType.RECTANGLE}
                />
                <ImageButton
                    image={"ico/point.png"}
                    imageAlt={"point"}
                    buttonSize={{width: 40, height:40}}
                    padding={20}
                    onClick={() => {
                        setExportLabelType(LabelType.POINT);
                        setExportFormatType(null);
                    }}
                    isActive={exportLabelType === LabelType.POINT}
                />
                <ImageButton
                    image={"ico/line.png"}
                    imageAlt={"line"}
                    buttonSize={{width: 40, height:40}}
                    padding={20}
                    onClick={() => {
                        setExportLabelType(LabelType.LINE);
                        setExportFormatType(null);
                    }}
                    isActive={exportLabelType === LabelType.LINE}
                />
                <ImageButton
                    image={"ico/polygon.png"}
                    imageAlt={"polygon"}
                    buttonSize={{width: 40, height:40}}
                    padding={20}
                    onClick={() => {
                        setExportLabelType(LabelType.POLYGON);
                        setExportFormatType(null);
                    }}
                    isActive={exportLabelType === LabelType.POLYGON}
                />
            </div>}
            <div className="RightContainer">
                <div className="Message">
                    Select label type and the file format you would like to use for exporting labels.
                </div>
                <div className="Options">
                    {exportLabelType === LabelType.RECTANGLE && getOptions(RectExportFormatData)}
                    {exportLabelType === LabelType.POINT && getOptions(PointExportFormatData)}
                    {exportLabelType === LabelType.LINE && getOptions(LineExportFormatData)}
                    {exportLabelType === LabelType.POLYGON && getOptions(PolygonExportFormatData)}
                    {exportLabelType === LabelType.NAME && getOptions(TagExportFormatData)}
                </div>
            </div>
        </div>);
    };

    return(
        <GenericYesNoPopup
            title={"Export your labels"}
            renderContent={renderContent}
            acceptLabel={"Export"}
            onAccept={onAccept}
            rejectLabel={"I'm not ready yet"}
            onReject={onReject}
        />
    );
};

const mapDispatchToProps = {};

const mapStateToProps = (state: AppState) => ({
    activeLabelType: state.labels.activeLabelType
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ExportLabelPopup);