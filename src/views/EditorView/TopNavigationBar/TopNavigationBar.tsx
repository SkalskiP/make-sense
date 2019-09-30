import React from 'react';
import './TopNavigationBar.scss';
import StateBar from "../StateBar/StateBar";
import {UnderlineTextButton} from "../../Common/UnderlineTextButton/UnderlineTextButton";
import {PopupWindowType} from "../../../data/enums/PopupWindowType";
import {AppState} from "../../../store";
import {connect} from "react-redux";
import {updateActivePopupType, updateProjectData} from "../../../store/general/actionCreators";
import TextInput from "../../Common/TextInput/TextInput";
import {ImageButton} from "../../Common/ImageButton/ImageButton";
import {Settings} from "../../../settings/Settings";
import {ProjectData} from "../../../store/general/types";

interface IProps {
    updateActivePopupType: (activePopupType: PopupWindowType) => any;
    updateProjectData: (projectData: ProjectData) => any;
    projectData: ProjectData;
}

const TopNavigationBar: React.FC<IProps> = ({updateActivePopupType, updateProjectData, projectData}) => {
    const onFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        event.target.setSelectionRange(0, event.target.value.length);
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
            .toLowerCase()
            .replace(' ', '-');

        updateProjectData({
            ...projectData,
            name: value
        })
    };

    return (
        <div className="TopNavigationBar">
            <StateBar/>
            <div className="TopNavigationBarWrapper">
                <div>
                    <div
                        className="Header"
                        onClick={() => updateActivePopupType(PopupWindowType.EXIT_PROJECT)}
                    >
                        <img
                            draggable={false}
                            alt={"make-sense"}
                            src={"/make-sense-ico-transparent.png"}
                        />
                        Make Sense
                    </div>
                </div>
                <div className="NavigationBarGroupWrapper">
                    <div className="ProjectName">Project Name:</div>
                    <TextInput
                        key={"ProjectName"}
                        isPassword={false}
                        value={projectData.name}
                        onChange={onChange}
                        onFocus={onFocus}
                    />
                </div>
                <div className="NavigationBarGroupWrapper">
                    <UnderlineTextButton
                        label={"UPDATE LABELS NAMES"}
                        under={true}
                        onClick={() => updateActivePopupType(PopupWindowType.UPDATE_LABEL_NAMES)}
                    />
                    <UnderlineTextButton
                        label={"MORE IMAGES"}
                        under={true}
                        onClick={() => updateActivePopupType(PopupWindowType.LOAD_IMAGES)}
                    />
                    <UnderlineTextButton
                        label={"EXPORT LABELS"}
                        under={true}
                        onClick={() => updateActivePopupType(PopupWindowType.EXPORT_LABELS)}
                    />
                    <ImageButton
                        image={"img/github-logo.png"}
                        imageAlt={"github-logo.png"}
                        buttonSize={{width: 30, height: 30}}
                        href={Settings.GITHUB_URL}
                    />
                </div>
            </div>
        </div>
    );
};

const mapDispatchToProps = {
    updateActivePopupType,
    updateProjectData
};

const mapStateToProps = (state: AppState) => ({
    projectData: state.general.projectData
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TopNavigationBar);