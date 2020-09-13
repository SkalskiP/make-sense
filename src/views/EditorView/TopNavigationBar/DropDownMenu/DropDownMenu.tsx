import React, {useState} from "react";
import './DropDownMenu.scss';

export const DropDownMenu: React.FC = () => {
    const [activeTabIdx, setActiveTabIdx] = useState(null);

    const onTabClick = (tabIdx: number) => {
        if (activeTabIdx === tabIdx) {
            setActiveTabIdx(null);
        } else {
            setActiveTabIdx(tabIdx);
        }
    }

    return(<div className="DropDownMenuWrapper"/>)
}