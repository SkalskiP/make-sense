import React, {useState} from "react";

interface IProps {
    tabsCount: number;
    tabRender: (index: number, isActive: boolean) => any;
}

export const SimpleAccordion: React.FC = () => {
    const [activeTab, setActiveTab] = useState(true);

    return(
        <div className="SimpleAccordion"/>
    );
};