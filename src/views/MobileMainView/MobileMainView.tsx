import React, {useState} from 'react';
import './MobileMainView.scss';
import Scrollbars from 'react-custom-scrollbars-2';
import {ISize} from "../../interfaces/ISize";
import {AppState} from "../../store";
import {connect} from "react-redux";
import classNames from 'classnames'
import {EditorFeatureData, IEditorFeature} from "../../data/info/EditorFeatureData";
import {ISocialMedia, SocialMediaData} from "../../data/info/SocialMediaData";
import {ImageButton} from "../Common/ImageButton/ImageButton";

interface IProps {
    size: ISize;
}

const MobileMainView: React.FC<IProps> = ({size}) => {
    const scrollPositionThreshold: number = 350;
    const [scrollPosition, setScrollPosition] = useState(0);

    const getClassName = () => {
        return classNames('MobileTopNavigationBar', {
            Hide: scrollPosition < scrollPositionThreshold,
            Show: scrollPosition >= scrollPositionThreshold,
        })
    };

    const onScroll = (value) => {
        setScrollPosition(value.scrollTop);
    };

    const getEditorFeatureTiles = (features: IEditorFeature[]) => {
        return features.map((data:IEditorFeature) => {
            return <div
                className="EditorFeaturesTiles"
                key={data.displayText}
            >
                <div
                    className="EditorFeaturesTilesWrapper"
                >
                    <img
                        draggable={false}
                        alt={data.imageAlt}
                        src={data.imageSrc}
                    />
                    <div className="EditorFeatureLabel">
                        {data.displayText}
                    </div>
                </div>
            </div>
        });
    };

    const getSocialMediaButtons = (mediaSize:ISize) => {
        return SocialMediaData.map((data:ISocialMedia, index: number) => {
            return <ImageButton
                key={index}
                buttonSize={mediaSize}
                image={data.imageSrc}
                imageAlt={data.imageAlt}
                href={data.href}
            />
        });
    };

    const topNavigationBar = <div className={getClassName()}>
        <div className="NavigationBarGroupWrapper">
            <div className="Header">
                <img
                    draggable={false}
                    alt={"make-sense"}
                    src={"/make-sense-ico-transparent.png"}
                />
                Make Sense
            </div>
        </div>
        <div className="TriangleHorizontal Bottom">
            <div className="TriangleHorizontalContent"/>
        </div>
    </div>;

    const firstStage = <div className="FirstStage">
        <img
            draggable={false}
            alt={"main-logo"}
            src={"ico/main-image-color.png"}
        />
        <div className="TriangleHorizontal Bottom">
            <div className="TriangleHorizontalContent"/>
        </div>
    </div>;

    const secondStage = <div className="SecondStage">
        {getEditorFeatureTiles(EditorFeatureData.slice(0, 3))}
    </div>;

    const thirdStage = <div className="ThirdStage">
        {getEditorFeatureTiles(EditorFeatureData.slice(3, 6))}
        <div className="TriangleHorizontal Top">
            <div className="TriangleHorizontalContent"/>
        </div>
        <div className="TriangleHorizontal Bottom">
            <div className="TriangleHorizontalContent"/>
        </div>
    </div>;

    const fourthStage = <div className="FourthStage">
        <div className="Message">
            Due to the small size of the screen we do not support our editor on mobile devices. Check what you missed and visit us from a desktop.
        </div>
        <div className="SocialMediaWrapper">
            {getSocialMediaButtons({width: 40, height: 40})}
        </div>
    </div>;

    return(<div className="MobileMainView">
        {topNavigationBar}
        <Scrollbars
            onScrollFrame={onScroll}
        >
            <div
                className="MobileMainViewContent"
                style={{width: size.width}}
            >
                {firstStage}
                {secondStage}
                {thirdStage}
                {fourthStage}
            </div>
        </Scrollbars>
    </div>)
};

const mapDispatchToProps = {};

const mapStateToProps = (state: AppState) => ({
    size: state.general.windowSize
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MobileMainView);