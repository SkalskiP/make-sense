import React, {useState} from 'react'
import './ImportLabelPopup.scss'
import {LabelType} from '../../../data/enums/LabelType';
import {PopupActions} from '../../../logic/actions/PopupActions';
import GenericLabelTypePopup from '../GenericLabelTypePopup/GenericLabelTypePopup';
import {ImportFormatData} from '../../../data/ImportFormatData';
import {FeatureInProgress} from '../../EditorView/FeatureInProgress/FeatureInProgress';
import {AppState} from '../../../store';
import {connect} from 'react-redux';
import {useDropzone} from 'react-dropzone';
import {AcceptedFileType} from '../../../data/enums/AcceptedFileType';
import {ImageData, LabelName} from '../../../store/labels/types';
import {updateActiveLabelType, updateImageData, updateLabelNames} from '../../../store/labels/actionCreators';
import {ImporterSpecData} from '../../../data/ImporterSpecData';
import {AnnotationFormatType} from '../../../data/enums/AnnotationFormatType';
import {ILabelFormatData} from '../../../interfaces/ILabelFormatData';

interface IProps {
    activeLabelType: LabelType,
    updateImageDataAction: (imageData: ImageData[]) => any,
    updateLabelNamesAction: (labels: LabelName[]) => any,
    updateActiveLabelTypeAction: (activeLabelType: LabelType) => any
}

const ImportLabelPopup: React.FC<IProps> = (
    {
        activeLabelType,
        updateImageDataAction,
        updateLabelNamesAction,
        updateActiveLabelTypeAction
    }) => {
    const resolveFormatType = (labelType: LabelType): AnnotationFormatType => {
        const possibleImportFormats = ImportFormatData[labelType]
        return possibleImportFormats.length === 1 ? possibleImportFormats[0].type : null
    }

    const [labelType, setLabelType] = useState(activeLabelType);
    const [formatType, setFormatType] = useState(resolveFormatType(activeLabelType));
    const [loadedLabelNames, setLoadedLabelNames] = useState([]);
    const [loadedImageData, setLoadedImageData] = useState([]);
    const [annotationsLoadedError, setAnnotationsLoadedError] = useState(null);

    const {getRootProps, getInputProps} = useDropzone({
        accept: [AcceptedFileType.JSON, AcceptedFileType.TEXT],
        multiple: true,
        onDrop: (acceptedFiles) => {
            const importer = new (ImporterSpecData[formatType])([labelType])
            importer.import(acceptedFiles, onAnnotationLoadSuccess, onAnnotationsLoadFailure);
        }
    });

    const onLabelTypeChange = (labelType: LabelType) => {
        setLabelType(labelType);
        setFormatType(resolveFormatType(labelType))
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
        if (loadedLabelNames.length !== 0 && loadedImageData.length !== 0) {
            updateImageDataAction(loadedImageData);
            updateLabelNamesAction(loadedLabelNames);
            updateActiveLabelTypeAction(labelType);
            PopupActions.close();
        }
    };

    const onReject = (labelType: LabelType) => {
        PopupActions.close();
    };

    const onAnnotationFormatChange = (format: AnnotationFormatType) => {
        setFormatType(format);
    }

    const getDropZoneContent = () => {
        if (!!annotationsLoadedError) {
            return <>
                <input {...getInputProps()} />
                <img
                    draggable={false}
                    alt={'upload'}
                    src={'ico/box-opened.png'}
                />
                <p className='extraBold'>Annotation import was unsuccessful</p>
                {annotationsLoadedError.message}
                <p className='extraBold'>Try again</p>
            </>;
        } else if (loadedImageData.length !== 0 && loadedLabelNames.length !== 0) {
            return <>
                <img
                    draggable={false}
                    alt={'uploaded'}
                    src={'ico/box-closed.png'}
                />
                <p className='extraBold'>Annotation ready for import</p>
                After import you will lose
                all your current annotations
            </>;
        } else {
            return <>
                <input {...getInputProps()} />
                <img
                    draggable={false}
                    alt={'upload'}
                    src={'ico/box-opened.png'}
                />
                <p className='extraBold'>{`Drop ${formatType} annotations`}</p>
                <p>or</p>
                <p className='extraBold'>Click here to select them</p>
            </>;
        }
    };

    const getOptions = (exportFormatData: ILabelFormatData[]) => {
        return exportFormatData.map((entry: ILabelFormatData) => {
            return <div
                className='OptionsItem'
                onClick={() => onAnnotationFormatChange(entry.type)}
                key={entry.type}
            >
                {entry.type === formatType ?
                    <img
                        draggable={false}
                        src={'ico/checkbox-checked.png'}
                        alt={'checked'}
                    /> :
                    <img
                        draggable={false}
                        src={'ico/checkbox-unchecked.png'}
                        alt={'unchecked'}
                    />}
                {entry.label}
            </div>
        })
    };

    const renderInternalContent = (labelType: LabelType) => {
        if (!formatType && ImportFormatData[labelType].length !== 0) {
            return [
                <div className='Message'>
                    Select file format you would like to use to import labels.
                </div>,
                <div className='Options'>
                    {getOptions(ImportFormatData[labelType])}
                </div>
            ]
        }
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
            acceptLabel={'Import'}
            onAccept={onAccept}
            skipAcceptButton={ImportFormatData[labelType].length === 0}
            disableAcceptButton={loadedImageData.length === 0 || loadedLabelNames.length === 0 || !!annotationsLoadedError}
            rejectLabel={'Cancel'}
            onReject={onReject}
            renderInternalContent={renderInternalContent}
        />
    )
};

const mapDispatchToProps = {
    updateImageDataAction: updateImageData,
    updateLabelNamesAction: updateLabelNames,
    updateActiveLabelTypeAction: updateActiveLabelType
};

const mapStateToProps = (state: AppState) => ({
    activeLabelType: state.labels.activeLabelType,
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ImportLabelPopup);
