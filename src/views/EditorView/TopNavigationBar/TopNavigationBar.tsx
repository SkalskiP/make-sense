import React from 'react';
import './TopNavigationBar.scss';
import StateBar from "../StateBar/StateBar";
import {UnderlineTextButton} from "../../Common/UnderlineTextButton/UnderlineTextButton";
import {PopupWindowType} from "../../../data/PopupWindowType";
import {AppState} from "../../../store";
import {connect} from "react-redux";
import {updateActivePopupType} from "../../../store/general/actionCreators";
import TextInput from "../../Common/TextInput/TextInput";
import {updateProjectName} from "../../../store/editor/actionCreators";
import {ImageButton} from "../../Common/ImageButton/ImageButton";
import {Settings} from "../../../settings/Settings";

interface IProps {
    updateActivePopupType: (activePopupType: PopupWindowType) => any;
    updateProjectName: (projectName: string) => any;
    projectName: string;
}

const TopNavigationBar: React.FC<IProps> = ({updateActivePopupType, updateProjectName, projectName}) => {
    const onFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        event.target.setSelectionRange(0, event.target.value.length);
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
            .toLowerCase()
            .replace(' ', '-');
        updateProjectName(value)
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
                        value={projectName}
                        onChange={onChange}
                        onFocus={onFocus}
                    />
                </div>
                <div className="NavigationBarGroupWrapper">
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
                        size={{width: 30, height: 30}}
                        href={Settings.GITHUB_URL}
                    />
                </div>
            </div>
        </div>
    );
};

const mapDispatchToProps = {
    updateActivePopupType,
    updateProjectName
};

const mapStateToProps = (state: AppState) => ({
    projectName: state.editor.projectName
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TopNavigationBar);