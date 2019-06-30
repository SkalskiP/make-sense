import React from 'react';
import './TopNavigationBar.scss';
import StateBar from "../StateBar/StateBar";
import {UnderlineTextButton} from "../../Common/UnderlineTextButton/UnderlineTextButton";

export const TopNavigationBar: React.FC = () => {
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
                    />
                    <UnderlineTextButton
                        label={"LOAD IMAGES"}
                        under={true}
                    />
                </div>
                {/*<div className="NavigationBarGroupWrapper" style={{width: 110}}/>*/}
            </div>
        </div>
    );
};