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

interface IProps {
    updateActiveImageIndex: (activeImageIndex: number) => any;
    addImageData: (imageData: ImageData[]) => any;
    updateProjectType: (projectType: ProjectType) => any;
}

const ImagesDropZone: React.FC<IProps> = ({updateActiveImageIndex, addImageData, updateProjectType}) => {
    const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
        accept: 'image/jpeg, image/png'
    });

    const startEditor = (projectType: ProjectType) => {
        updateProjectType(projectType);
        updateActiveImageIndex(1);
        addImageData(acceptedFiles.map((fileData:File) => FileUtils.mapFileDataToImageData(fileData)));
    };

    const getDropZoneContent = () => {
        if (acceptedFiles.length === 0)
            return [
                <input {...getInputProps()} />,
                <img alt={"upload"} src={"img/upload.png"}/>,
                <p>Drop some images here or click to select images</p>
            ];
        else if (acceptedFiles.length === 1)
            return <p>1 image loaded</p>;
        else
            return <p>{acceptedFiles.length} images loaded</p>;
    };

    return(
        <div className="ImagesDropZone">
            <div {...getRootProps({className: 'DropZone'})}>
                {getDropZoneContent()}
            </div>
            <div className="DropZoneButtons">
                <TextButton
                    label={"Image recognition"}
                    rout={acceptedFiles.length ? "/editor/" : null}
                    isDisabled={!acceptedFiles.length}
                    onClick={() => startEditor(ProjectType.IMAGE_RECOGNITION)}
                />
                <TextButton
                    label={"Object Detection"}
                    rout={acceptedFiles.length ? "/editor/" : null}
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
    updateProjectType
};

const mapStateToProps = (state: AppState) => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ImagesDropZone);