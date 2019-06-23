import React from 'react';
import classNames from 'classnames';
import './SideNavigationBar.scss';
import {Direction} from "../../../data/Direction";

interface IProps {
    direction: Direction
    isOpen: boolean;
}

export const SideNavigationBar: React.FC<IProps> = (props) => {
    const {direction, isOpen} = props;

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
                {props.children}
            </div>
            {isOpen && <div className="NavigationBarContentWrapper">
            </div>}
        </div>
    );
};