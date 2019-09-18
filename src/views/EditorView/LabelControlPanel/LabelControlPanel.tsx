import React from 'react';
import './LabelControlPanel.scss';
import {updatePreventCustomCursorStatus} from "../../../store/general/actionCreators";
import {AppState} from "../../../store";
import {connect} from "react-redux";
import {IPoint} from "../../../interfaces/IPoint";

interface IProps {
    position: IPoint;
    updatePreventCustomCursorStatus: (preventCustomCursor: boolean) => any;
}

const LabelControlPanel: React.FC<IProps> = ({position, updatePreventCustomCursorStatus}) => {
    const onMouseEnter = () => {
        updatePreventCustomCursorStatus(true);
    };

    const onMouseLeave = () => {
        updatePreventCustomCursorStatus(false);
    };

    return <div
        className="LabelControlPanel"
        style={{top: position.y, left: position.x}}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
    ></div>
};

const mapDispatchToProps = {
    updatePreventCustomCursorStatus
};

const mapStateToProps = (state: AppState) => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LabelControlPanel);