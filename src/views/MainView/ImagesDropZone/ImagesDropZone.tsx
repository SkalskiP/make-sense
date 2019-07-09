import React from "react";
import './ImagesDropZone.scss';
import {useDropzone} from "react-dropzone";
import {TextButton} from "../../Common/TextButton/TextButton";
import {ImageData} from "../../../store/editor/types";
import {connect} from "react-redux";
import {addImageData, updateActiveImageIndex, updateProjectType} from "../../../store/editor/actionCreators";
import {AppState} from "../../../store";
import {ProjectType} from "../../../data/ProjectType";
import {FileUtils} from "../../../utils/FileUtils";
import {PopupWindowType} from "../../../data/PopupWindowType";
import {updateActivePopupType} from "../../../store/general/actionCreators";

interface IProps {
    updateActiveImageIndex: (activeImageIndex: number) => any;
    addImageData: (imageData: ImageData[]) => any;
    updateProjectType: (projectType: ProjectType) => any;
    updateActivePopupType: (activePopupType: PopupWindowType) => any;
}

const ImagesDropZone: React.FC<IProps> = ({updateActiveImageIndex, addImageData, updateProjectType, updateActivePopupType}) => {
    const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
        accept: 'image/jpeg, image/png'
    });

    const startEditor = (projectType: ProjectType) => {
        if (acceptedFiles.length > 0) {
            updateProjectType(projectType);
            updateActiveImageIndex(0);
            addImageData(acceptedFiles.map((fileData:File) => FileUtils.mapFileDataToImageData(fileData)));
            updateActivePopupType(PopupWindowType.LOAD_LABELS);
        }
    };

    const getDropZoneContent = () => {
        if (acceptedFiles.length === 0)
            return <>
                <input {...getInputProps()} />
                <img alt={"upload"} src={"img/box-opened.png"}/>
                <p className="extraBold">Drop some images</p>
                <p>or</p>
                <p className="extraBold">Click here to select them</p>
            </>;
        else if (acceptedFiles.length === 1)
            return <>
                <img alt={"uploaded"} src={"img/box-closed.png"}/>
                <p className="extraBold">1 image loaded</p>
            </>;
        else
            return <>
                <img key={1} alt={"uploaded"} src={"img/box-closed.png"}/>
                <p key={2} className="extraBold">{acceptedFiles.length} images loaded</p>
            </>;
    };

    return(
        <div className="ImagesDropZone">
            <div {...getRootProps({className: 'DropZone'})}>
                {getDropZoneContent()}
            </div>
            <div className="DropZoneButtons">
                <TextButton
                    label={"Image recognition"}
                    isDisabled={!acceptedFiles.length}
                    onClick={() => startEditor(ProjectType.IMAGE_RECOGNITION)}
                />
                <TextButton
                    label={"Object Detection"}
                    isDisabled={!acceptedFiles.length}
                    onClick={() => startEditor(ProjectType.OBJECT_DETECTION)}
                />
            </div>
        </div>
    )
};

const mapDispatchToProps = {
    updateActiveImageIndex,
    addImageData,
    updateProjectType,
    updateActivePopupType
};

const mapStateToProps = (state: AppState) => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ImagesDropZone);