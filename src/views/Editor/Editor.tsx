import React from 'react';
import './Editor.scss';
import {TopNavigationBar} from "./TopNavigationBar/TopNavigationBar";

const Editor: React.FC = () => {
    return (
        <div className="Editor">
            <TopNavigationBar/>
        </div>
    );
};

export default Editor;