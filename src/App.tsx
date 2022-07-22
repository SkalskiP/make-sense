import React, {useEffect, useState} from 'react';
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
import {updateActivePopupType} from './store/general/actionCreators';
import {PopupWindowType} from './data/enums/PopupWindowType';
import {updateAuthData} from './store/auth/actionCreators';
import {AuthData} from './store/auth/types';

interface IProps {
    projectType: ProjectType;
    windowSize: ISize;
    ObjectDetectorLoaded: boolean;
    PoseDetectionLoaded: boolean;
    updateAuthDataAction: (authData: AuthData) => any;
    updateActivePopupTypeAction: (type: PopupWindowType) => void;
    authData: AuthData;
}

const App: React.FC<IProps> = ({
    projectType,
    windowSize,
    ObjectDetectorLoaded,
    PoseDetectionLoaded,
    updateAuthDataAction,
    updateActivePopupTypeAction,
    authData
}) => {
   
    useEffect(() => {
        const auth: AuthData = JSON.parse(
            window.localStorage.getItem('@@auth')
        );
        // console.log('auth = ', auth);
        if (!auth) {
            updateActivePopupTypeAction(PopupWindowType.LOGIN);
        } else {
            updateAuthDataAction(auth);
        }

        return () => {
            // second
        };
    }, [authData.authToken]);

    const selectRoute = () => {
    
        if (
            !!PlatformModel.mobileDeviceData.manufacturer &&
            !!PlatformModel.mobileDeviceData.os
        )
            return <MobileMainView />;
        if (!projectType) return  <MainView /> ;
        else {
            if (
                windowSize.height < Settings.EDITOR_MIN_HEIGHT ||
                windowSize.width < Settings.EDITOR_MIN_WIDTH
            ) {
                return <SizeItUpView />;
            } else {
                return <EditorView />;
            }
        }
    };

    return (
        <div
            className={classNames('App m-x', {
                AI: ObjectDetectorLoaded || PoseDetectionLoaded
            })}
            draggable={false}>
            {selectRoute()}
            <PopupView />
            <NotificationsView />
        </div>
    );
};

const mapDispatchToProps = {
    updateAuthDataAction: updateAuthData,
    updateActivePopupTypeAction: updateActivePopupType
};

const mapStateToProps = (state: AppState) => ({
    projectType: state.general.projectData.type,
    windowSize: state.general.windowSize,
    ObjectDetectorLoaded: state.ai.isObjectDetectorLoaded,
    PoseDetectionLoaded: state.ai.isPoseDetectorLoaded,
    authData: state.auth.authData
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
