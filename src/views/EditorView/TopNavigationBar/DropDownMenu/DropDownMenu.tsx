import React, {useState} from "react";
import classNames from 'classnames'
import './DropDownMenu.scss';
import {DropDownMenuData, DropDownMenuNode} from "../../../../data/info/DropDownMenuData";
import {EventType} from "../../../../data/enums/EventType";

export const DropDownMenu: React.FC = () => {
    const topAnchor = 35;

    const [activeTabIdx, setActiveTabIdx] = useState(null);
    const [activeDropDownAnchor, setDropDownAnchor] = useState(null);

    const onTabClick = (tabIdx: number, event) => {
        if (activeTabIdx === null) {
            window.addEventListener(EventType.MOUSE_DOWN, onMouseDownBeyondDropDown);
        }

        if (activeTabIdx === tabIdx) {
            setActiveTabIdx(null);
            setDropDownAnchor(null);
        } else {
            setActiveTabIdx(tabIdx);
            setDropDownAnchor({x: event.target.offsetLeft, y: topAnchor});
        }
    }

    const onMouseDownBeyondDropDown = (event: MouseEvent) => {
        setActiveTabIdx(null);
        window.removeEventListener(EventType.MOUSE_DOWN, onMouseDownBeyondDropDown);
    }

    const onMouseEnter = (tabIdx: number, event) => {
        console.log("onMouseEnter", "activeTabIdx", activeTabIdx, "tabIdx", tabIdx)
        if (activeTabIdx !== null && activeTabIdx !== tabIdx) {
            setActiveTabIdx(tabIdx);
            setDropDownAnchor({x: event.target.offsetLeft, y: topAnchor});
        }
    }

    const getDropDownMenuTabClassName = (tabIdx: number) => {
        return classNames(
            "DropDownMenuTab",
            {"active": tabIdx === activeTabIdx}
        );
    };

    const getDropDownContent = () => {
        return DropDownMenuData.map((data: DropDownMenuNode, index: number) => getDropDownTab(data, index))
    }

    const getDropDownTab = (data: DropDownMenuNode, index: number) => {
        return <div
            className={getDropDownMenuTabClassName(index)}
            key={index}
            onClickCapture={(event) => onTabClick(index, event)}
            onMouseEnter={(event) => onMouseEnter(index, event)}
        >
            <img
                draggable={false}
                src={data.imageSrc}
                alt={data.imageAlt}
            />
            {data.name}
        </div>
    }
    const getDropDownWindow = (data: DropDownMenuNode) => {
        if (activeTabIdx !== null) {
            return <div className={"DropDownMenuContent"} style={{top: 35, left: activeDropDownAnchor.x}}/>
        } else {
            return null;
        }
    }

    return(<div className="DropDownMenuWrapper">
        <>
            {getDropDownContent()}
            {getDropDownWindow(DropDownMenuData[activeTabIdx])}
        </>
    </div>)
}