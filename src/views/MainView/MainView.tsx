import React, {useState} from 'react';
import './MainView.scss';
import {TextButton} from '../Common/TextButton/TextButton';
import classNames from 'classnames';
import {ISize} from '../../interfaces/ISize';
import {ImageButton} from '../Common/ImageButton/ImageButton';
import {ISocialMedia, SocialMediaData} from '../../data/info/SocialMediaData';
import {
    EditorFeatureData,
    IEditorFeature
} from '../../data/info/EditorFeatureData';
import {Tooltip} from '@material-ui/core';
import Fade from '@material-ui/core/Fade';
import withStyles from '@material-ui/core/styles/withStyles';
import ImagesDropZone from './ImagesDropZone/ImagesDropZone';
import ImagesFetcher from './ImagesFetcher/ImagesFetcher';
import {connect, RootStateOrAny, useSelector} from 'react-redux';
import {updateActivePopupType} from '../../store/general/actionCreators';
import {PopupWindowType} from '../../data/enums/PopupWindowType';
import {AppState} from '../../store';
import {AuthData} from '../../store/auth/types';

interface IProps {
    authData: AuthData;
    updateActivePopupTypeAction: (type: PopupWindowType) => void;
}

const MainView: React.FC<IProps> = ({
    authData,
    updateActivePopupTypeAction
}) => {
    const [projectInProgress, setProjectInProgress] = useState(false);
    const [projectCanceled, setProjectCanceled] = useState(false);

    const startProject = () => {
        setProjectInProgress(true);
    };

    const logout = () => {
        updateActivePopupTypeAction(PopupWindowType.LOGOUT);
    };

    const endProject = () => {
        setProjectInProgress(false);
        setProjectCanceled(true);
    };

    const getClassName = () => {
        return classNames('MainView', {
            InProgress: projectInProgress,
            Canceled: !projectInProgress && projectCanceled
        });
    };

    const DarkTooltip = withStyles((theme) => ({
        tooltip: {
            backgroundColor: '#171717',
            color: '#ffffff',
            boxShadow: theme.shadows[1],
            fontSize: 11,
            maxWidth: 120
        }
    }))(Tooltip);

    const getSocialMediaButtons = (size: ISize) => {
        return SocialMediaData.map((data: ISocialMedia, index: number) => {
            return (
                <DarkTooltip
                    key={index}
                    disableFocusListener={true}
                    title={data.tooltipMessage}
                    TransitionComponent={Fade}
                    TransitionProps={{timeout: 600}}
                    placement="left">
                    <div>
                        <ImageButton
                            buttonSize={size}
                            image={data.imageSrc}
                            imageAlt={data.imageAlt}
                            href={data.href}
                        />
                    </div>
                </DarkTooltip>
            );
        });
    };

    const getEditorFeatureTiles = () => {
        return EditorFeatureData.map((data: IEditorFeature) => {
            return (
                <div className="EditorFeaturesTiles" key={data.displayText}>
                    <div className="EditorFeaturesTilesWrapper">
                        <img
                            draggable={false}
                            alt={data.imageAlt}
                            src={data.imageSrc}
                        />
                        <div className="EditorFeatureLabel">
                            {data.displayText}
                        </div>
                    </div>
                </div>
            );
        });
    };

    return (
        <div className={getClassName()}>
            <div className="Slider" id="lower">
                <div className="TriangleVertical">
                    <div className="TriangleVerticalContent" />
                </div>
            </div>

            <div className="Slider" id="upper">
                <div className="TriangleVertical">
                    <div className="TriangleVerticalContent" />
                </div>
            </div>

            <div className="LeftColumn">
                <div className={'LogoWrapper'}>
                    <img
                        draggable={false}
                        alt={'main-logo'}
                        src={'ico/main-image-color.png'}
                    />
                </div>
                <div className="EditorFeaturesWrapper">
                    {getEditorFeatureTiles()}
                </div>
                <div className="TriangleVertical">
                    <div className="TriangleVerticalContent" />
                </div>
                {projectInProgress && (
                    <TextButton label={'Go Back'} onClick={endProject} />
                )}
            </div>
            <div className="RightColumn">
                <div />
                {/* <ImagesDropZone/> */}
                <ImagesFetcher />
                <div className="SocialMediaWrapper">
                    {getSocialMediaButtons({width: 30, height: 30})}
                </div>
                {!projectInProgress && (
                    <TextButton
                        label={'Get Started'}
                        onClick={startProject}
                        externalClassName={'get-started-button'}
                    />
                )}
                {!projectInProgress && authData.authToken && (
                    <TextButton
                        style={{bottom: 80}}
                        label={'Log out'}
                        onClick={logout}
                        externalClassName={'get-started-button'}
                    />
                )}
            </div>
        </div>
    );
};
const mapDispatchToProps = {
    updateActivePopupTypeAction: updateActivePopupType
};
const mapStateToProps = (state: AppState) => ({
    authData: state.auth.authData
});

export default connect(mapStateToProps, mapDispatchToProps)(MainView);
