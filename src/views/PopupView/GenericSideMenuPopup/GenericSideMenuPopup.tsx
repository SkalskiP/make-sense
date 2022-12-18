import React from 'react';
import './GenericSideMenuPopup.scss'
import { GenericYesNoPopup } from '../GenericYesNoPopup/GenericYesNoPopup';
import { jsx } from '@emotion/react';
import JSX = jsx.JSX;

interface IProps {
    title: string;
    acceptLabel: string;
    onAccept: () => void;
    rejectLabel: string;
    onReject: () => void;
    renderContent: () => JSX.Element;
    renderSideMenuContent: () => JSX.Element[];
}

export const GenericSideMenuPopup: React.FC<IProps> = (
    {
        title,
        acceptLabel,
        onAccept,
        rejectLabel,
        onReject,
        renderContent,
        renderSideMenuContent
    }
) => {

    const renderPopupContent = () => {
        return (<div className='generic-side-menu-popup'>
            <div className='left-container'>
                {renderSideMenuContent()}
            </div>
            <div className='right-container'>
                {renderContent()}
            </div>
        </div>);
    }

    return(
        <GenericYesNoPopup
            title={title}
            renderContent={renderPopupContent}
            acceptLabel={acceptLabel}
            onAccept={onAccept}
            rejectLabel={rejectLabel}
            onReject={onReject}
        />
    );
}