import React from 'react';
import './App.scss';
import EditorView from "./views/EditorView/EditorView";
import MainView from "./views/MainView/MainView";
import {ProjectType} from "./data/ProjectType";
import {AppState} from "./store";
import {connect} from "react-redux";
import PopupView from "./views/PopupView/PopupView";
import {MobileDeviceData} from "./data/MobileDeviceData";
import MobileMainView from "./views/MobileMainView/MobileMainView";

interface IProps {
    projectType: ProjectType;
    mobileDeviceData: MobileDeviceData;
}

const App: React.FC<IProps> = ({projectType, mobileDeviceData}) => {
    const selectRoute = () => {
        if (!!mobileDeviceData.manufacturer && !!mobileDeviceData.os)
            return <MobileMainView/>;
        if (!projectType)
            return <MainView/>;
        else
            return <EditorView/>;
    };

      return (
        <div className="App">
            {selectRoute()}
            <PopupView/>
        </div>
      );
};

const mapStateToProps = (state: AppState) => ({
    projectType: state.editor.projectType,
    mobileDeviceData: state.general.mobileDeviceData
});

export default connect(
    mapStateToProps
)(App);
