import React, { useEffect } from 'react';
import './EditorView.scss';
import EditorContainer from './EditorContainer/EditorContainer';
import {PopupWindowType} from '../../data/enums/PopupWindowType';
import {AppState} from '../../store';
import {connect} from 'react-redux';
import classNames from 'classnames';
import TopNavigationBar from './TopNavigationBar/TopNavigationBar';

interface IProps {
    activePopupType: PopupWindowType;
}

const EditorView: React.FC<IProps> = ({activePopupType}) => {

    // Disable middle mouse scroll
    useEffect(() => {
        document.body.onmousedown = e => { return e.button === 1 ? false : true; };
        }, []
    );

    const getClassName = () => {
        return classNames(
            'EditorView',
            {
                'withPopup': !!activePopupType
            }
        );
    };

    return (
        <div
            className={getClassName()}
            draggable={false}
        >
            <TopNavigationBar/>
            <EditorContainer/>
        </div>
    );
};

const mapStateToProps = (state: AppState) => ({
    activePopupType: state.general.activePopupType
});

export default connect(
    mapStateToProps
)(EditorView);
