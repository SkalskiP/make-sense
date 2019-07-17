import React from 'react';
import './MobileMainView.scss';
import Scrollbars from 'react-custom-scrollbars';
import {ISize} from "../../interfaces/ISize";
import {AppState} from "../../store";
import {connect} from "react-redux";

interface IProps {
    size: ISize;
}

const MobileMainView: React.FC<IProps> = ({size}) => {

    const topNavigationBar = <div className="MobileTopNavigationBar">
        <div className="NavigationBarGroupWrapper">
            <div className="Header">
                <img alt={"make-sense"} src={"/make-sense-ico-transparent.png"}/>
                Make Sense
            </div>
        </div>
        <div className="TriangleHorizontal Bottom">
            <div className="TriangleHorizontalContent"/>
        </div>
    </div>;

    const firstStage = <div className="FirstStage"/>;
    const secondStage = <div className="SecondStage"/>;
    const thirdStage = <div className="ThirdStage">
        <div className="TriangleHorizontal Top">
            <div className="TriangleHorizontalContent"/>
        </div>
        <div className="TriangleHorizontal Bottom">
            <div className="TriangleHorizontalContent"/>
        </div>
    </div>;
    const fourthStage = <div className="FourthStage"/>;

    return(<div className="MobileMainView">
        {topNavigationBar}
        <Scrollbars>
            <div
                className="MobileMainViewContent"
                style={{width: size.width}}
            >
                {/*{firstStage}*/}
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