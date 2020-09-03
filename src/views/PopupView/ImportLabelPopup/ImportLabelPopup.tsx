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
import {ImageData, LabelName} from "../../../store/labels/types";
import {COCOImporter} from "../../../logic/import/polygon/COCOImporter";
import {updateActiveLabelType, updateImageData, updateLabelNames} from "../../../store/labels/actionCreators";

interface IProps {
    updateImageData: (imageData: ImageData[]) => any,
    updateLabelNames: (labels: LabelName[]) => any,
    updateActiveLabelType: (activeLabelType: LabelType) => any
}

const ImportLabelPopup: React.FC<IProps> = (
    {
        updateImageData,
        updateLabelNames,
        updateActiveLabelType
    }) => {
    const [labelType, setLabelType] = useState(LabelType.POLYGON);
    const [loadedLabelNames, setLoadedLabelNames] = useState([]);
    const [loadedImageData, setLoadedImageData] = useState([]);
    const [annotationsLoadedError, setAnnotationsLoadedError] = useState(null);

    const {getRootProps, getInputProps} = useDropzone({
        accept: AcceptedFileType.JSON,
        multiple: true,
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length === 1 && labelType === LabelType.POLYGON) {
                COCOImporter.import(acceptedFiles[0], onAnnotationLoadSuccess, onAnnotationsLoadFailure, [LabelType.POLYGON, LabelType.RECT]);
            }
        }
    });

    const onLabelTypeChange = (labelType: LabelType) => {
        setLabelType(labelType);
        setLoadedLabelNames([]);
        setLoadedImageData([]);
        setAnnotationsLoadedError(null);
    }

    const onAnnotationLoadSuccess = (imagesData: ImageData[], labelNames: LabelName[]) => {
        setLoadedLabelNames(labelNames);
        setLoadedImageData(imagesData);
        setAnnotationsLoadedError(null);
    }

    const onAnnotationsLoadFailure = (error?:Error) => {
        setLoadedLabelNames([]);
        setLoadedImageData([]);
        setAnnotationsLoadedError(error);
    };

    const onAccept = (labelType: LabelType) => {
        updateImageData(loadedImageData);
        updateLabelNames(loadedLabelNames);
        updateActiveLabelType(labelType);
        PopupActions.close();
    };

    const onReject = (labelType: LabelType) => {
        PopupActions.close();
    };

    const getDropZoneContent = () => {
        if (!!annotationsLoadedError) {
            return <>
                <input {...getInputProps()} />
                <img
                    draggable={false}
                    alt={"upload"}
                    src={"img/box-opened.png"}
                />
                <p className="extraBold">Annotation import was unsuccessful</p>
                {annotationsLoadedError.message}
                <p className="extraBold">Try again</p>
            </>;
        } else if (loadedImageData.length !== 0 && loadedLabelNames.length !== 0) {
            return <>
                <img
                    draggable={false}
                    alt={"uploaded"}
                    src={"img/box-closed.png"}
                />
                <p className="extraBold">Annotation ready for import</p>
                After import you will lose
                all your current annotations
            </>;
        } else {
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
        }
    };

    const renderInternalContent = (labelType: LabelType) => {
        const importFormatData = ImportFormatData[labelType];
        return importFormatData.length === 0 ?
            <FeatureInProgress/> :
            <div {...getRootProps({className: 'DropZone'})}>
                {getDropZoneContent()}
            </div>
    }

    return(
        <GenericLabelTypePopup
            activeLabelType={labelType}
            title={`Import ${labelType.toLowerCase()} annotations`}
            onLabelTypeChange={onLabelTypeChange}
            acceptLabel={"Import"}
            onAccept={onAccept}
            skipAcceptButton={ImportFormatData[labelType].length === 0}
            disableAcceptButton={loadedImageData.length === 0 || loadedLabelNames.length === 0 || !!annotationsLoadedError}
            rejectLabel={"Cancel"}
            onReject={onReject}
            renderInternalContent={renderInternalContent}
        />
    )
};

const mapDispatchToProps = {
    updateImageData,
    updateLabelNames,
    updateActiveLabelType
};

const mapStateToProps = (state: AppState) => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ImportLabelPopup);