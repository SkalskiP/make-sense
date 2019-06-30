import React from 'react'
import './GenericYesNoPopup.scss'
import {TextButton} from "../../Common/TextButton/TextButton";

interface IProps {
    title: string
    renderContent: () => any;
    acceptLabel: string
    onAccept: () => any
    rejectLabel: string
    onReject: () => any
}

export const GenericYesNoPopup: React.FC<IProps> = ({title, renderContent, acceptLabel, onAccept, rejectLabel, onReject}) => {
    return (
        <div className="GenericYesNoPopup">
            <div className="Header">
                {title}
            </div>
            <div className="Content">
                {renderContent()}
            </div>
            <div className="Footer">
                <TextButton
                    label={!!acceptLabel ? acceptLabel : "YES"}
                    onClick={onAccept}
                    externalClassName={"accept"}
                />
                <TextButton
                    label={!!rejectLabel ? rejectLabel : "NO, THANKS"}
                    onClick={onReject}
                    externalClassName={"reject"}
                />
            </div>
        </div>
    )
};