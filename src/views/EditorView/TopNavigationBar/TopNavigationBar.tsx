import React from 'react';
import './TopNavigationBar.scss';
import StateBar from "../StateBar/StateBar";

export const TopNavigationBar: React.FC = () => {
    return (
        <div className="TopNavigationBar">
            <StateBar/>
            <div className="TopNavigationBarWrapper">
                <img alt={"make-sense"} src={"/make-sense-ico-transparent.png"}/>
                <div className="Header">
                    Make Sense
                </div>
            </div>
        </div>
    );
};