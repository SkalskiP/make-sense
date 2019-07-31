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
import {ISize} from "./interfaces/ISize";
import {Settings} from "./settings/Settings";
import {SizeItUpView} from "./views/SizeItUpView/SizeItUpView";

interface IProps {
    projectType: ProjectType;
    mobileDeviceData: MobileDeviceData;
    windowSize: ISize;
}

const App: React.FC<IProps> = ({projectType, mobileDeviceData, windowSize}) => {
    const selectRoute = () => {
        if (!!mobileDeviceData.manufacturer && !!mobileDeviceData.os)
            return <MobileMainView/>;
        if (!projectType)
            return <MainView/>;
        else {
            if (windowSize.height < Settings.EDITOR_MIN_HEIGHT || windowSize.width < Settings.EDITOR_MIN_WIDTH) {
                return <SizeItUpView/>;
            } else {
                return <EditorView/>;
            }
        }
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
    mobileDeviceData: state.general.mobileDeviceData,
    windowSize: state.general.windowSize
});

export default connect(
    mapStateToProps
)(App);
