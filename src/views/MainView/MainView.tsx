import React, {useState} from 'react';
import './MainView.scss';
import {TextButton} from "../Common/TextButton/TextButton";
import classNames from 'classnames';

const MainView: React.FC = () => {
    const [projectInProgress, setProjectInProgress] = useState(false);

    const startProject = () => {
        setProjectInProgress(true);
    };

    const getClassName = () => {
        return classNames(
            "MainView",
            {
                "InProgress": projectInProgress,
            }
        );
    };

    return (
        <div className={getClassName()}>
            <div className="LeftColumn">
                <img alt={"main-logo"} src={"img/main-image-color.png"}/>
                <div className="Triangle">
                    <div className="TriangleContent"/>
                </div>
            </div>
            <div className="RightColumn">
                {!projectInProgress && <TextButton
                    label={"Get Started"}
                    onClick={startProject}
                />}
            </div>
        </div>
    );
};

export default MainView;