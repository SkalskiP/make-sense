import React, {useState} from 'react'
import './ExportLabelPopup.scss'
import {ImageData} from "../../../store/editor/types";
import {GenericYesNoPopup} from "../GenericYesNoPopup/GenericYesNoPopup";
import {AppState} from "../../../store";
import {connect} from "react-redux";
import {PopupWindowType} from "../../../data/PopupWindowType";
import {updateActivePopupType} from "../../../store/general/actionCreators";
import {ExportFormatType} from "../../../data/ExportFormatType";
import {RectLabelsExporter} from "../../../logic/export/RectLabelsExporter";
import {LabelType} from "../../../data/LabelType";
import {ImageButton} from "../../Common/ImageButton/ImageButton";
import {IExportFormat} from "../../../interfaces/IExportFormat";
import {RectExportFormatData} from "../../../data/RectExportFormatData";
import {PointExportFormatData} from "../../../data/PointExportFormatData";
import {PointLabelsExporter} from "../../../logic/export/PointLabelsExport";

interface IProps {
    imagesData: ImageData[],
    updateActivePopupType: (activePopupType: PopupWindowType) => any;
}

const ExportLabelPopup: React.FC<IProps> = ({imagesData, updateActivePopupType}) => {
    const [exportLabelType, setExportLabelType] = useState(LabelType.RECTANGLE);
    const [exportFormatType, setExportFormatType] = useState(null);

    const onAccept = () => {
        if (exportFormatType) {
            if (exportLabelType === LabelType.RECTANGLE) {
                RectLabelsExporter.export(exportFormatType);
            } else if (exportLabelType === LabelType.POINT) {
                PointLabelsExporter.export(exportFormatType);
            }
            updateActivePopupType(null);
        }
    };

    const onReject = () => {
        updateActivePopupType(null);
    };

    const onSelect = (exportFormatType: ExportFormatType) => {
        setExportFormatType(exportFormatType);
    };

    const getRectOptions = () => {
        return RectExportFormatData.map((entry: IExportFormat) => {
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

    const getPointOptions = () => {
        return PointExportFormatData.map((entry: IExportFormat) => {
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
            <div className="LeftContainer">
                <ImageButton
                    image={"ico/rectangle.png"}
                    imageAlt={"rectangle"}
                    size={{width: 40, height: 40}}
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
                    size={{width: 40, height:40}}
                    padding={20}
                    onClick={() => {
                        setExportLabelType(LabelType.POINT);
                        setExportFormatType(null);
                    }}
                    isActive={exportLabelType === LabelType.POINT}
                />
            </div>
            <div className="RightContainer">
                <div className="Message">
                    Select label type and the file format you would like to use for exporting labels.
                </div>
                <div className="Options">
                    {exportLabelType === LabelType.RECTANGLE && getRectOptions()}
                    {exportLabelType === LabelType.POINT && getPointOptions()}
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

const mapDispatchToProps = {
    updateActivePopupType,
};

const mapStateToProps = (state: AppState) => ({
    imagesData: state.editor.imagesData
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ExportLabelPopup);