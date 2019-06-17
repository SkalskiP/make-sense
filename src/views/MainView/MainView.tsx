import React, {useState} from 'react';
import './MainView.scss';
import {TextButton} from "../Common/TextButton/TextButton";
import classNames from 'classnames';
import {ISize} from "../../interfaces/ISize";
import {ImageButton} from "../Common/ImageButton/ImageButton";
import {ISocialMedia, SocialMediaData} from "../../data/SocialMediaData";
import {EditorFeatureData, IEditorFeature} from "../../data/EditorFeatureData";
import {useDropzone} from 'react-dropzone';

const MainView: React.FC = () => {
    const [projectInProgress, setProjectInProgress] = useState(false);
    const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
        onDrop: files => console.log(files),
        accept: 'image/jpeg, image/png'
    });

    const startProject = () => {
        setProjectInProgress(true);
    };

    const getClassName = () => {
        return classNames(
            "MainView", {
                "InProgress": projectInProgress,
            }
        );
    };

    const getSocialMediaButtons = (size:ISize) => {
        return SocialMediaData.map((data:ISocialMedia) => {
            return <ImageButton
                key={data.displayName}
                size={size}
                image={data.imageSrc}
                imageAlt={data.imageAlt}
                href={data.href}
            />
        });
    };

    const getEditorFeatureTiles = () => {
        return EditorFeatureData.map((data:IEditorFeature) => {
            return <div className="EditorFeaturesTiles">
                <img
                    alt={data.imageAlt}
                    src={data.imageSrc}
                />
                <div className="EditorFeatureLabel">
                    {data.displayText}
                </div>
            </div>
        });
    };

    const getDropZoneContent = () => {
        if (acceptedFiles.length === 0)
            return [
                <input {...getInputProps()} />,
                <img alt={"upload"} src={"img/upload.png"}/>,
                <p>Drag 'n' drop some images here, or click to select images</p>
            ];
        else if (acceptedFiles.length === 1)
            return <p>1 image loaded</p>;
        else
            return <p>{acceptedFiles.length} images loaded</p>;
    };

    return (
        <div className={getClassName()}>
            <div className="LeftColumn">
                <div className={"LogoWrapper"}>
                    <img alt={"main-logo"} src={"img/main-image-color.png"}/>
                </div>
                <div className="EditorFeaturesWrapper">
                    {getEditorFeatureTiles()}
                </div>
                <div className="Triangle">
                    <div className="TriangleContent"/>
                </div>
            </div>
            <div className="RightColumn">
                <div/>
                <div className="DropZoneWrapper">
                    <div {...getRootProps({className: 'DropZone'})}>
                        {getDropZoneContent()}
                    </div>
                    <div className="DropZoneButtons">
                        <TextButton
                            label={"Image recognition"}
                            onClick={() => {}}
                        />
                        <TextButton
                            label={"Object Detection"}
                            onClick={() => {}}
                        />
                    </div>
                </div>
                <div className="SocialMediaWrapper">
                    {getSocialMediaButtons({width: 30, height: 30})}
                </div>
                {!projectInProgress && <TextButton
                    label={"Get Started"}
                    onClick={startProject}
                    style={{
                        position: "absolute",
                        right: 20,
                        bottom: 20
                    }}
                />}
            </div>
        </div>
    );
};

export default MainView;