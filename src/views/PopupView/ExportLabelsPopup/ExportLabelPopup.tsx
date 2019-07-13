import React, {useState} from 'react'
import './ExportLabelPopup.scss'
import {ImageData} from "../../../store/editor/types";
import {GenericYesNoPopup} from "../GenericYesNoPopup/GenericYesNoPopup";
import {AppState} from "../../../store";
import {connect} from "react-redux";
import {PopupWindowType} from "../../../data/PopupWindowType";
import {updateActivePopupType} from "../../../store/general/actionCreators";
import {ExportFormatType} from "../../../data/ExportFormatType";
import {ExportFormatData, IExportFormat} from "../../../data/ExportFormatData";

interface IProps {
    imagesData: ImageData[],
    updateActivePopupType: (activePopupType: PopupWindowType) => any;
}

const ExportLabelPopup: React.FC<IProps> = ({imagesData, updateActivePopupType}) => {
    const [exportFormatType, setExportFormatType] = useState(null);

    const onReject = () => {
        updateActivePopupType(null);
    };

    const onSelect = (exportFormatType: ExportFormatType) => {
        setExportFormatType(exportFormatType);
    };

    const getOptions = () => {
        return ExportFormatData.map((entry: IExportFormat) => {
            return <div
                className="OptionsItem"
                onClick={() => onSelect(entry.type)}
                key={entry.type}
            >
                {entry.type === exportFormatType ?
                <img src={"ico/checkbox-checked.png"} alt={"checked"}/> :
                <img src={"ico/checkbox-unchecked.png"} alt={"unchecked"}/>}
                {entry.label}
            </div>
        })
    };

    const renderContent = () => {
        return(<div className="ExportLabelPopupContent">
            <div className="Message">
                Select the file format you would like to use for exporting labels.
            </div>
            <div className="Options">
                {getOptions()}
            </div>
        </div>);
    };

    return(
        <GenericYesNoPopup
            title={"Export your labels"}
            renderContent={renderContent}
            acceptLabel={"Export"}
            onAccept={() => null}
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