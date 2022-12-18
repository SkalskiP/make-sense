import { PopupWindowType } from '../../../data/enums/PopupWindowType';
import { GeneralActionTypes } from '../../../store/general/types';
import React, { useState } from 'react';
import { PopupActions } from '../../../logic/actions/PopupActions';
import { updateActivePopupType as storeUpdateActivePopupType } from '../../../store/general/actionCreators';
import { AppState } from '../../../store';
import { connect } from 'react-redux';
import { GenericSideMenuPopup } from '../GenericSideMenuPopup/GenericSideMenuPopup';
import { ImageButton } from '../../Common/ImageButton/ImageButton';
import { InferenceServerDataMap } from '../../../data/info/InferenceServerData';
import { InferenceServerType } from '../../../data/enums/InferenceServerType';

interface IProps {
    updateActivePopupType: (activePopupType: PopupWindowType) => GeneralActionTypes;
}

const ConnectInferenceServerPopup: React.FC<IProps> = ({ updateActivePopupType }) => {
    const [currentServerType, setCurrentServerType] = useState(InferenceServerType.ROBOFLOW);

    const wrapServerOnClick = (newServerType: InferenceServerType) => {
        return () => {
            setCurrentServerType(newServerType)
        }
    }

    const onAccept = () => {
        PopupActions.close();
    };

    const onReject = () => {
        PopupActions.close();
    };

    const renderContent = () => {
        return <div className='load-model-popup-content'>
            null
        </div>
    };

    const renderSideMenuContent = (): JSX.Element[] => {
        return Object.entries(InferenceServerDataMap).map(([serverType, serverData], index: number) => {
            return <ImageButton
                key={index}
                image={serverData.imageSrc}
                imageAlt={serverData.imageAlt}
                buttonSize={{width: 40, height: 40}}
                padding={20}
                onClick={wrapServerOnClick(serverType as InferenceServerType)}
                isActive={currentServerType === serverType}
            />
        })
    }
    return (
        <GenericSideMenuPopup
            title={InferenceServerDataMap[currentServerType].name}
            renderContent={renderContent}
            renderSideMenuContent={renderSideMenuContent}
            acceptLabel={'Connect'}
            onAccept={onAccept}
            rejectLabel={'Back'}
            onReject={onReject}
        />
    );
}

const mapDispatchToProps = {
  updateActivePopupType: storeUpdateActivePopupType
};

const mapStateToProps = (state: AppState) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectInferenceServerPopup);