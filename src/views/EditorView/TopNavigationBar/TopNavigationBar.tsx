import React from 'react';
import './TopNavigationBar.scss';
import StateBar from "../StateBar/StateBar";
import {UnderlineTextButton} from "../../Common/UnderlineTextButton/UnderlineTextButton";
import {PopupWindowType} from "../../../data/PopupWindowType";
import {AppState} from "../../../store";
import {connect} from "react-redux";
import {updateActivePopupType} from "../../../store/general/actionCreators";

interface IProps {
    updateActivePopupType: (activePopupType: PopupWindowType) => any;
}

const TopNavigationBar: React.FC<IProps> = ({updateActivePopupType}) => {
    return (
        <div className="TopNavigationBar">
            <StateBar/>
            <div className="TopNavigationBarWrapper">
                <div className="NavigationBarGroupWrapper">
                    <div className="Header">
                        <img alt={"make-sense"} src={"/make-sense-ico-transparent.png"}/>
                        Make Sense
                    </div>
                </div>
                <div className="NavigationBarGroupWrapper">
                    <UnderlineTextButton
                        label={"LOAD LABELS"}
                        under={true}
                        onClick={() => updateActivePopupType(PopupWindowType.LOAD_LABELS)}
                    />
                    <UnderlineTextButton
                        label={"LOAD IMAGES"}
                        under={true}
                        onClick={() => updateActivePopupType(PopupWindowType.LOAD_IMAGES)}
                    />
                    <UnderlineTextButton
                        label={"EXPORT LABELS"}
                        under={true}
                        onClick={() => updateActivePopupType(PopupWindowType.EXPORT_LABELS)}
                    />
                </div>
            </div>
        </div>
    );
};

const mapDispatchToProps = {
    updateActivePopupType
};

const mapStateToProps = (state: AppState) => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TopNavigationBar);