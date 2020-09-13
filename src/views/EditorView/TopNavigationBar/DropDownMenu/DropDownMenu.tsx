import React, {useState} from "react";
import classNames from 'classnames'
import './DropDownMenu.scss';
import {DropDownMenuData, DropDownMenuNode} from "../../../../data/info/DropDownMenuData";
import {EventType} from "../../../../data/enums/EventType";

export const DropDownMenu: React.FC = () => {
    const [activeTabIdx, setActiveTabIdx] = useState(null);

    const onTabClick = (tabIdx: number) => {
        if (activeTabIdx === null) {
            window.addEventListener(EventType.MOUSE_DOWN, onMouseDownBeyondDropDown);
        }

        if (activeTabIdx === tabIdx) {
            setActiveTabIdx(null);
        } else {
            setActiveTabIdx(tabIdx);
        }
    }

    const onMouseDownBeyondDropDown = (event: MouseEvent) => {
        setActiveTabIdx(null);
        window.removeEventListener(EventType.MOUSE_DOWN, onMouseDownBeyondDropDown);
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
            onClick={() => onTabClick(index)}
        >
            <img
                draggable={false}
                src={data.imageSrc}
                alt={data.imageAlt}
            />
            {data.name}
        </div>
    }

    return(<div className="DropDownMenuWrapper">
        {getDropDownContent()}
    </div>)
}