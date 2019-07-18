import React from 'react'
import './GenericYesNoPopup.scss'
import {TextButton} from "../../Common/TextButton/TextButton";

interface IProps {
    title: string;
    renderContent: () => any;
    acceptLabel: string;
    onAccept: () => any;
    skipAcceptButton?: boolean;
    disableAcceptButton?: boolean;
    rejectLabel: string;
    onReject: () => any;
    skipRejectButton?: boolean;
    disableRejectButton?: boolean;
}

export const GenericYesNoPopup: React.FC<IProps> = (
    {
        title,
        renderContent,
        acceptLabel,
        onAccept,
        skipAcceptButton,
        disableAcceptButton,
        rejectLabel,
        onReject,
        skipRejectButton,
        disableRejectButton
    }) => {
    return (
        <div className="GenericYesNoPopup">
            <div className="Header">
                {title}
            </div>
            <div className="Content">
                {renderContent()}
            </div>
            <div className="Footer">
                {!skipAcceptButton && <TextButton
                    label={!!acceptLabel ? acceptLabel : "YES"}
                    onClick={onAccept}
                    externalClassName={"accept"}
                    isDisabled={disableAcceptButton}
                />}
                {!skipRejectButton && <TextButton
                    label={!!rejectLabel ? rejectLabel : "NO, THANKS"}
                    onClick={onReject}
                    externalClassName={"reject"}
                    isDisabled={disableRejectButton}
                />}
            </div>
        </div>
    )
};