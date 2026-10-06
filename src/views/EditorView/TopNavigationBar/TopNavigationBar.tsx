import React from 'react';
import './TopNavigationBar.scss';
import StateBar from '../StateBar/StateBar';
import {PopupWindowType} from '../../../data/enums/PopupWindowType';
import {AppState} from '../../../store';
import {connect} from 'react-redux';
import {updateActivePopupType, updateProjectData} from '../../../store/general/actionCreators';
import TextInput from '../../Common/TextInput/TextInput';
import {ImageButton} from '../../Common/ImageButton/ImageButton';
import {Settings} from '../../../settings/Settings';
import {ProjectData} from '../../../store/general/types';
import DropDownMenu from './DropDownMenu/DropDownMenu';
import {AI_STATUS_EVENT, SAVE_STATUS_EVENT} from '../../../logic/uiEvents';

interface IProps {
    updateActivePopupTypeAction: (activePopupType: PopupWindowType) => any;
    updateProjectDataAction: (projectData: ProjectData) => any;
    projectData: ProjectData;
    activeImageIndex: number;
    totalImageCount: number;
}

const TopNavigationBar: React.FC<IProps> = (props) => {
    const [saveState, setSaveState] = React.useState('Project saved');
    const [saveClass, setSaveClass] = React.useState('saved');
    const [aiText, setAiText] = React.useState('AI offline');
    const [aiActive, setAiActive] = React.useState(false);

    React.useEffect(() => {
        const onSave = (event: Event) => {
            const detail = (event as CustomEvent).detail as {state: string};
            if (detail.state === 'saving') { setSaveState('Saving…'); setSaveClass('saving'); }
            else if (detail.state === 'saved') { setSaveState('✓ Saved'); setSaveClass('saved'); }
            else if (detail.state === 'failed') { setSaveState('⚠ Save failed'); setSaveClass('failed'); }
            else { setSaveState('Unsaved changes'); setSaveClass('unsaved'); }
        };
        const onAI = (event: Event) => {
            const detail = (event as CustomEvent).detail as
                {connected: boolean; pending: number; threshold: number; training: boolean};
            if (!detail.connected) { setAiText('AI offline'); setAiActive(false); }
            else if (detail.training) { setAiText('⟳ Training'); setAiActive(true); }
            else { setAiText(`AI ● ${detail.pending}/${detail.threshold}`); setAiActive(true); }
        };
        window.addEventListener(SAVE_STATUS_EVENT, onSave);
        window.addEventListener(AI_STATUS_EVENT, onAI);
        return () => {
            window.removeEventListener(SAVE_STATUS_EVENT, onSave);
            window.removeEventListener(AI_STATUS_EVENT, onAI);
        };
    }, []);

    const onFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        event.target.setSelectionRange(0, event.target.value.length);
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
            .toLowerCase()
            .replace(' ', '-');

        props.updateProjectDataAction({
            ...props.projectData,
            name: value
        })
    };

    const closePopup = () => props.updateActivePopupTypeAction(PopupWindowType.EXIT_PROJECT)

    return (
        <div className='TopNavigationBar'>
            <StateBar/>
            <div className='TopNavigationBarWrapper'>
                <div className='NavigationBarGroupWrapper'>
                    <div
                        className='Header'
                        onClick={closePopup}
                    >
                        <img
                            draggable={false}
                            alt={'make-sense'}
                            src={'/make-sense-ico-transparent.png'}
                        />
                        Make Sense
                    </div>
                </div>
                <div className='NavigationBarGroupWrapper'>
                    <DropDownMenu/>
                </div>
                <div className='NavigationBarGroupWrapper middle'>
                    <div className='ProjectName'>Project Name:</div>
                    <TextInput
                        isPassword={false}
                        value={props.projectData.name}
                        onChange={onChange}
                        onFocus={onFocus}
                    />
                </div>
                <div className='NavigationBarGroupWrapper status-cluster'>
                    {props.totalImageCount > 0 &&
                        <span className='TopBarCounter' title='Current image'>
                            {props.activeImageIndex + 1} / {props.totalImageCount}
                        </span>}
                    <span className={`TopBarSave ${saveClass}`} title='Project save state'>{saveState}</span>
                    <span className={aiActive ? 'TopBarAI on' : 'TopBarAI'} title='AI assist state'>{aiText}</span>
                    <ImageButton
                        image={'ico/github-logo.png'}
                        imageAlt={'github-logo.png'}
                        buttonSize={{width: 30, height: 30}}
                        href={Settings.GITHUB_URL}
                    />
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
    projectData: state.general.projectData,
    activeImageIndex: state.labels.activeImageIndex,
    totalImageCount: state.labels.imagesData.length
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TopNavigationBar);
