import React from "react";
import './ImagesDropZone.scss';
import {useDropzone} from "react-dropzone";
import {TextButton} from "../../Common/TextButton/TextButton";
import {ImageData} from "../../../store/labels/types";
import {connect} from "react-redux";
import {addImageData, updateActiveImageIndex} from "../../../store/labels/actionCreators";
import {AppState} from "../../../store";
import {ProjectType} from "../../../data/enums/ProjectType";
import {FileUtil} from "../../../utils/FileUtil";
import {PopupWindowType} from "../../../data/enums/PopupWindowType";
import {updateActivePopupType, updateProjectData} from "../../../store/general/actionCreators";
import {AcceptedFileType} from "../../../data/enums/AcceptedFileType";
import {ProjectData} from "../../../store/general/types";

interface IProps {
    updateActiveImageIndex: (activeImageIndex: number) => any;
    addImageData: (imageData: ImageData[]) => any;
    updateProjectData: (projectData: ProjectData) => any;
    updateActivePopupType: (activePopupType: PopupWindowType) => any;
    projectData: ProjectData;
}

const ImagesDropZone: React.FC<IProps> = ({updateActiveImageIndex, addImageData, updateProjectData, updateActivePopupType, projectData}) => {
    const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
        accept: AcceptedFileType.IMAGE
    });

    const startEditor = (projectType: ProjectType) => {
        if (acceptedFiles.length > 0) {
            updateProjectData({
                ...projectData,
                type: projectType
            });
            updateActiveImageIndex(0);
            addImageData(acceptedFiles.map((fileData:File) => FileUtil.mapFileDataToImageData(fileData)));
            updateActivePopupType(PopupWindowType.INSERT_LABEL_NAMES);
        }
    };

    const getDropZoneContent = () => {
        if (acceptedFiles.length === 0)
            return <>
                <input {...getInputProps()} />
                <img
                    draggable={false}
                    alt={"upload"}
                    src={"img/box-opened.png"}
                />
                <p className="extraBold">Drop some images</p>
                <p>or</p>
                <p className="extraBold">Click here to select them</p>
            </>;
        else if (acceptedFiles.length === 1)
            return <>
                <img
                    draggable={false}
                    alt={"uploaded"}
                    src={"img/box-closed.png"}
                />
                <p className="extraBold">1 image loaded</p>
            </>;
        else
            return <>
                <input {...getInputProps()} />
                <img
                    draggable={false}
                    key={1}
                    alt={"uploaded"}
                    src={"img/box-closed.png"}
                />
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
                    isDisabled={true}
                    onClick={() => {}}
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
    updateProjectData,
    updateActivePopupType
};

const mapStateToProps = (state: AppState) => ({
    projectData: state.general.projectData
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ImagesDropZone);