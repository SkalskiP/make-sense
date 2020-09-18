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
            document.addEventListener(EventType.MOUSE_DOWN, onMouseDownBeyondDropDown);
        }

        if (activeTabIdx === tabIdx) {
            setActiveTabIdx(null);
            setDropDownAnchor(null);
        } else {
            setActiveTabIdx(tabIdx);
            setDropDownAnchor({x: event.target.offsetLeft, y: topAnchor});
        }
    }

    const onMouseEnterWindow = (event) => {
        console.log("Enter");
    }

    const onMouseLeaveWindow = (event) => {
        console.log("Leave");
    }

    const onMouseDownBeyondDropDown = (event) => {
        if (event.target.classList.contains("DropDownMenuTab")) {
            return;
        }
        setActiveTabIdx(null);
        document.removeEventListener(EventType.MOUSE_DOWN, onMouseDownBeyondDropDown);
    }

    const onMouseEnterTab = (tabIdx: number, event) => {
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
            onClick={(event) => onTabClick(index, event)}
            onMouseEnter={(event) => onMouseEnterTab(index, event)}
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
            const style: React.CSSProperties = {
                top: 35,
                left: activeDropDownAnchor.x,
                height: 40 * data.children.length + 10
            }
            return <div
                className={"DropDownMenuContent"}
                style={style}
                onMouseEnter={onMouseEnterWindow}
                onMouseLeave={onMouseLeaveWindow}
            >
                {data.children.map((i:DropDownMenuNode) => <div className="DropDownMenuContentOption">
                    <div className="Marker"/>
                    <img src={i.imageSrc} alt={i.imageAlt}/>
                    {i.name}
                </div>)}
            </div>
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