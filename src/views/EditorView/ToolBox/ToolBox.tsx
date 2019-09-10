import React from 'react';
import './ToolBox.scss';
import classNames from "classnames";
import {ContextType} from "../../../data/enums/ContextType";
import {AppState} from "../../../store";
import {connect} from "react-redux";
import {ImageButton} from "../../Common/ImageButton/ImageButton";

interface IProps {
    activeContext: ContextType;
}

const ToolBox: React.FC<IProps> = ({activeContext}) => {

    const getClassName = () => {
        return classNames(
            "ToolBox",
            {
                "with-context": activeContext === ContextType.EDITOR
            }
        );
    };

    return <div
        className={getClassName()}
    >
        <ImageButton
            image={"ico/zoom-in.png"}
            imageAlt={"zoom-in"}
            size={{width: 40, height: 40}}
            padding={20}
            onClick={() => {}}
        />
        <ImageButton
            image={"ico/hand.png"}
            imageAlt={"hand"}
            size={{width: 40, height:40}}
            padding={20}
            onClick={() => {}}
        />
    </div>
};

const mapDispatchToProps = {};

const mapStateToProps = (state: AppState) => ({
    activeContext: state.general.activeContext
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ToolBox);