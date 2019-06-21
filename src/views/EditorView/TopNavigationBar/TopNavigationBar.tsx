import React from 'react';
import './TopNavigationBar.scss';

export const TopNavigationBar: React.FC = () => {
    return (
        <div className="TopNavigationBar">
            <img alt={"make-sense"} src={"/make-sense-ico-transparent.png"}/>
            <div className="Header">
                Make Sense
            </div>
        </div>
    );
};