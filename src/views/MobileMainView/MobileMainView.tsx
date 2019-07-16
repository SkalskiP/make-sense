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
    return(<div className="MobileMainView">
        <Scrollbars>
            <div
                className="MobileMainViewContent"
                style={{width: size.width}}
            >
                <div className="TopRow">

                </div>
                <div className="BottomRow">

                </div>
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