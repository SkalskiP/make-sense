import React from 'react';
import classNames from 'classnames';
import './SideNavigationBar.scss';
import {Direction} from "../../../data/Direction";

interface IProps {
    direction: Direction
    isOpen: boolean;
    renderCompanion?: () => any;
    renderContent?: () => any;
}

export const SideNavigationBar: React.FC<IProps> = (props) => {
    const {direction, isOpen, renderContent, renderCompanion} = props;

    const getClassName = () => {
        return classNames(
            "SideNavigationBar",
            {
                "left": direction === Direction.LEFT,
                "right": direction === Direction.RIGHT,
                "closed": !isOpen
            }
        );
    };

    return (
        <div className={getClassName()}>
            <div className="CompanionBar">
                {renderCompanion && renderCompanion()}
            </div>
            {isOpen && <div className="NavigationBarContentWrapper">
                {renderContent && renderContent()}
            </div>}
        </div>
    );
};