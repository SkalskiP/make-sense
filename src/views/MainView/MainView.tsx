import React, {useState} from 'react';
import './MainView.scss';
import {TextButton} from "../Common/TextButton/TextButton";
import classNames from 'classnames';
import {ISize} from "../../interfaces/ISize";
import {ImageButton} from "../Common/ImageButton/ImageButton";
import {ISocialMedia, SocialMediaData} from "../../data/SocialMediaData";
import {EditorFeatureData, IEditorFeature} from "../../data/EditorFeatureData";

const MainView: React.FC = () => {
    const [projectInProgress, setProjectInProgress] = useState(false);

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
        })
    }

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
                <div className="SocialMediaWrapper">
                    {getSocialMediaButtons({width: 30, height: 30})}
                </div>
                {!projectInProgress && <TextButton
                    label={"Get Started"}
                    onClick={startProject}
                />}
            </div>
        </div>
    );
};

export default MainView;