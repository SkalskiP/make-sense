import React, {useState} from 'react'
import './ImportLabelPopup.scss'
import {LabelType} from "../../../data/enums/LabelType";
import {PopupActions} from "../../../logic/actions/PopupActions";
import GenericLabelTypePopup from "../GenericLabelTypePopup/GenericLabelTypePopup";
import {ImportFormatData} from "../../../data/ImportFormatData";
import {FeatureInProgress} from "../../EditorView/FeatureInProgress/FeatureInProgress";
import {AppState} from "../../../store";
import {connect} from "react-redux";
import {useDropzone} from "react-dropzone";
import {AcceptedFileType} from "../../../data/enums/AcceptedFileType";

interface IProps {
    activeLabelType: LabelType,
}

const ImportLabelPopup: React.FC<IProps> = ({activeLabelType}) => {
    const [labelType, setLabelType] = useState(activeLabelType);
    const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
        accept: AcceptedFileType.TEXT,
        multiple: true,
        onDrop: (acceptedFiles) => {
            console.log(acceptedFiles)
        }
    });

    const onAccept = (labelType: LabelType) => {
        PopupActions.close();
    };

    const onReject = (labelType: LabelType) => {
        PopupActions.close();
    };

    const getDropZoneContent = () => {
        return <>
            <input {...getInputProps()} />
            <img
                draggable={false}
                alt={"upload"}
                src={"img/box-opened.png"}
            />
            <p className="extraBold">Drop COCO annotation file</p>
            <p>or</p>
            <p className="extraBold">Click here to select it</p>
        </>;
    };

    const renderInternalContent = (labelType: LabelType) => {
        const importFormatData = ImportFormatData[labelType];
        return importFormatData.length === 0 ?
            <FeatureInProgress/> :
            <div {...getRootProps({className: 'DropZone'})}>
                {getDropZoneContent()}
            </div>
    }

    const onLabelTypeChange = (labelType: LabelType) => {
        setLabelType(labelType);
    }

    return(
        <GenericLabelTypePopup
            title={`Import ${labelType.toLowerCase()} annotations`}
            onLabelTypeChange={onLabelTypeChange}
            acceptLabel={"Import"}
            onAccept={onAccept}
            skipAcceptButton={ImportFormatData[labelType].length === 0}
            rejectLabel={"Cancel"}
            onReject={onReject}
            renderInternalContent={renderInternalContent}
        />
    )
};

const mapDispatchToProps = {};

const mapStateToProps = (state: AppState) => ({
    activeLabelType: state.labels.activeLabelType,
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ImportLabelPopup);