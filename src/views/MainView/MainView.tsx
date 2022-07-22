import React, {useState} from 'react';
import './MainView.scss';
import classNames from 'classnames';
import {ISize} from '../../interfaces/ISize';
import {ImageButton} from '../Common/ImageButton/ImageButton';
import {ISocialMedia, SocialMediaData} from '../../data/info/SocialMediaData';
import {
    EditorFeatureData,
    IEditorFeature
} from '../../data/info/EditorFeatureData';
import {
    updateActiveImageIndex,
    updateActiveLabelNameId,
    updateFirstLabelCreatedFlag,
    updateImageData,
    updateLabelNames
} from '../../store/labels/actionCreators';
import {PopupActions} from '../../logic/actions/PopupActions';
import {Tooltip} from '@material-ui/core';
import Fade from '@material-ui/core/Fade';
import withStyles from '@material-ui/core/styles/withStyles';
import {updateAuthData} from '../../store/auth/actionCreators';
import ImagesFetcher from './ImagesFetcher/ImagesFetcher';
import {connect} from 'react-redux';
import {updateActivePopupType, updateProjectData} from '../../store/general/actionCreators';
import {PopupWindowType} from '../../data/enums/PopupWindowType';
import {AppState} from '../../store';
import {AuthData} from '../../store/auth/types';
import WrapperLogin from "../../components/WrapperLogin/index"

interface IProps {
    authData: AuthData;
    updateActivePopupTypeAction: (type: PopupWindowType) => void;
    updateActiveImageIndex: (activeImageIndex: number) => any;
    updateActiveLabelNameId: (activeLabelId: string) => any;
    //updateImageData: (imageData: ImageData[]) => any;
    updateFirstLabelCreatedFlag: (firstLabelCreatedFlag: boolean) => any;
    updateAuthDataAction: (authData: AuthData) => any;
    
}

const MainView: React.FC<IProps> = ({
    authData,
    updateActivePopupTypeAction,
    updateActiveLabelNameId,
    updateActiveImageIndex,
    updateFirstLabelCreatedFlag,
    updateAuthDataAction
}) => {
    const [projectInProgress, setProjectInProgress] = useState(false);
    const [projectCanceled, setProjectCanceled] = useState(false);

    const startProject = () => {
        setProjectInProgress(true);
    };

    const endProject = () => {
        setProjectInProgress(false);
        setProjectCanceled(true);
        updateActivePopupTypeAction(PopupWindowType.LOGIN);
        updateAuthDataAction({
            email: null,
            displayName: null,
            authToken: null,
            role: null
        });
        window.localStorage.removeItem('@@auth');
        updateActiveLabelNameId(null);
        updateActiveImageIndex(null);
        updateFirstLabelCreatedFlag(false);
        PopupActions.close();
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
        <div className={`${getClassName()} loginShowniq InProgress `}>
            <WrapperLogin>
                 <div className='GenericYesNoPopup loginShowniq__content RightColumn'>
                    {/* <ImagesDropZone/> */}
                    <ImagesFetcher goBack={endProject} />
                </div>
            </WrapperLogin>
        </div>
    );
};
const mapDispatchToProps = {
    updateActivePopupTypeAction: updateActivePopupType,
    updateActiveLabelNameId,
    updateLabelNames,
    updateProjectData,
    updateActiveImageIndex,
    updateImageData,
    updateFirstLabelCreatedFlag,
    updateAuthDataAction: updateAuthData,
};
const mapStateToProps = (state: AppState) => ({
    authData: state.auth.authData
});

export default connect(mapStateToProps, mapDispatchToProps)(MainView);
