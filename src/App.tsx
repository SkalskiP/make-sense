import React from 'react';
import './App.scss';
import EditorView from './views/EditorView/EditorView';
import MainView from './views/MainView/MainView';
import {ProjectType} from './data/enums/ProjectType';
import {AppState} from './store';
import {connect} from 'react-redux';
import PopupView from './views/PopupView/PopupView';
import MobileMainView from './views/MobileMainView/MobileMainView';
import {ISize} from './interfaces/ISize';
import {Settings} from './settings/Settings';
import {SizeItUpView} from './views/SizeItUpView/SizeItUpView';
import {PlatformModel} from './staticModels/PlatformModel';
import classNames from 'classnames';
import NotificationsView from './views/NotificationsView/NotificationsView';

interface IProps {
    projectType: ProjectType;
    windowSize: ISize;
    objectDetectorLoaded: boolean;
    poseDetectionLoaded: boolean;
    roboflowJSObjectDetectorLoaded: boolean;
}

const App: React.FC<IProps> = (
    {projectType, windowSize, objectDetectorLoaded, poseDetectionLoaded, roboflowJSObjectDetectorLoaded}
) => {
    const selectRoute = () => {
        if (!!PlatformModel.mobileDeviceData.manufacturer && !!PlatformModel.mobileDeviceData.os)
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

    const isAILoaded = objectDetectorLoaded || poseDetectionLoaded || roboflowJSObjectDetectorLoaded

      return (
        <div className={classNames('App', {'AI': isAILoaded})}
            draggable={false}
        >
            {selectRoute()}
            <PopupView/>
            <NotificationsView/>
        </div>
      );
};

const mapStateToProps = (state: AppState) => ({
    projectType: state.general.projectData.type,
    windowSize: state.general.windowSize,
    objectDetectorLoaded: state.ai.isObjectDetectorLoaded,
    poseDetectionLoaded: state.ai.isPoseDetectorLoaded,
    roboflowJSObjectDetectorLoaded: state.ai.isRoboflowJSObjectDetectorLoaded
});

export default connect(
    mapStateToProps
)(App);
