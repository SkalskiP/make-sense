import React from 'react';
import './MainView.scss';

const MainView: React.FC = () => {
    return (
        <div className="MainView">
            <div className="LeftColumn">
                <img alt={"main-logo"} src={"img/main-image-color.png"}/>
                <div className="Description">
                    Make Sense is an open source photo labeling tool that allows you to easily and quickly prepare your
                    photo collection for computer vision research. Make Sense works online, so there's no need to
                    install any packages or environments locally - all you need is a web browser. The photos you upload
                    are 100% secure and are never saved on our servers.
                </div>
            </div>
            <div className="RightColumn"/>
        </div>
    );
};

export default MainView;