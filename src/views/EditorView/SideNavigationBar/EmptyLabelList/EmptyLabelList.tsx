import React from 'react';
import './EmptyLabelList.scss';
import {AppState} from "../../../../store";
import {connect} from "react-redux";

interface IProps {
    firstLabelCreatedFlag: boolean;
    labelBefore: string;
    labelAfter: string;
}

const EmptyLabelList: React.FC<IProps> = ({firstLabelCreatedFlag, labelBefore, labelAfter}) => {
    const before = <>
        <img
            draggable={false}
            alt={"lets_start"}
            src={"ico/rocket.png"}
        />
        <p className="extraBold">{labelBefore}</p>
    </>;

    const after = <>
        <img
            draggable={false}
            alt={"no_labels"}
            src={"ico/box-opened.png"}
        />
        <p className="extraBold">{labelAfter}</p>
    </>;

    return(<div className="EmptyLabelList">
        {!firstLabelCreatedFlag ? before : after}
    </div>)
};

const mapDispatchToProps = {};

const mapStateToProps = (state: AppState) => ({
    firstLabelCreatedFlag: state.labels.firstLabelCreatedFlag
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EmptyLabelList);