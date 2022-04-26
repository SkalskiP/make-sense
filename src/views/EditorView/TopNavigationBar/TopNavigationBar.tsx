import React, {useState} from 'react';
import './TopNavigationBar.scss';
import StateBar from '../StateBar/StateBar';
import {PopupWindowType} from '../../../data/enums/PopupWindowType';
import {AppState} from '../../../store';
import {connect} from 'react-redux';
import {
    updateActivePopupType,
    updateProjectData
} from '../../../store/general/actionCreators';
import TextInput from '../../Common/TextInput/TextInput';
import {ImageButton} from '../../Common/ImageButton/ImageButton';
import {Settings} from '../../../settings/Settings';
import {ProjectData} from '../../../store/general/types';
import DropDownMenu from './DropDownMenu/DropDownMenu';
import {LabelsSelector} from '../../../store/selectors/LabelsSelector';
import {RectLabelsExporter} from '../../../logic/export/RectLabelsExporter';
import {ImageData} from '../../../store/labels/types';
import {APIService} from '../../../services/API';
import {ClipLoader} from 'react-spinners';
import {CSSHelper} from '../../../logic/helpers/CSSHelper';

interface IProps {
    updateActivePopupTypeAction: (activePopupType: PopupWindowType) => any;
    updateProjectDataAction: (projectData: ProjectData) => any;
    projectData: ProjectData;
}

const TopNavigationBar: React.FC<IProps> = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const onFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        event.target.setSelectionRange(0, event.target.value.length);
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.toLowerCase().replace(' ', '-');

        props.updateProjectDataAction({
            ...props.projectData,
            name: value
        });
    };

    const closePopup = () =>
        props.updateActivePopupTypeAction(PopupWindowType.EXIT_PROJECT);

    const uploadJson = async () => {
        const imageData: ImageData = LabelsSelector.getActiveImageData();
        const content = RectLabelsExporter.wrapRectLabelsIntoJSON(imageData);
        if (content) {
            const json = JSON.stringify(content);
            try {
                setIsLoading(true);
                await APIService.updateImage({imageId: imageData.id, json});
            } catch (error) {
                console.error('Failed to updateImage:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="TopNavigationBar">
            <StateBar />
            <div className="TopNavigationBarWrapper">
                <div className="NavigationBarGroupWrapper">
                    <div className="Header" onClick={closePopup}>
                        <img
                            draggable={false}
                            alt={'make-sense'}
                            src={'/make-sense-ico-transparent.png'}
                        />
                        Make Sense
                    </div>
                </div>
                <div className="NavigationBarGroupWrapper">
                    <DropDownMenu />
                </div>
                <div className="NavigationBarGroupWrapper middle">
                    <div className="ProjectName">Project Name:</div>
                    <TextInput
                        isPassword={false}
                        value={props.projectData.name}
                        onChange={onChange}
                        onFocus={onFocus}
                    />
                </div>
                <div className="NavigationBarGroupWrapper">
                    {isLoading ? (
                        <ClipLoader
                            size={30}
                            color={CSSHelper.getLeadingColor()}
                            loading={true}
                        />
                    ) : (
                        <ImageButton
                            image={'ico/cloud-upload.png'}
                            imageAlt={'cloud-upload.png'}
                            buttonSize={{width: 30, height: 30}}
                            onClick={uploadJson}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

const mapDispatchToProps = {
    updateActivePopupTypeAction: updateActivePopupType,
    updateProjectDataAction: updateProjectData
};

const mapStateToProps = (state: AppState) => ({
    projectData: state.general.projectData
});

export default connect(mapStateToProps, mapDispatchToProps)(TopNavigationBar);
