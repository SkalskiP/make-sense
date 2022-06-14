import React, {useEffect, useState} from 'react';
import './GenericYesNoPopupDraggable.scss';
import {TextButton} from '../../Common/TextButton/TextButton';
import {ContextManager} from '../../../logic/context/ContextManager';
import {ContextType} from '../../../data/enums/ContextType';
import ReactModal from 'react-modal-resizable-draggable';

interface IProps {
    title: string;
    renderContent: () => any;
    acceptLabel?: string;
    onAccept?: () => any;
    skipAcceptButton?: boolean;
    disableAcceptButton?: boolean;
    rejectLabel?: string;
    onReject?: () => any;
    skipRejectButton?: boolean;
    disableRejectButton?: boolean;
}

export const GenericYesNoPopupDraggable: React.FC<IProps> = ({
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
    const [status, setMountStatus] = useState(false);
    useEffect(() => {
        if (!status) {
            ContextManager.switchCtx(ContextType.POPUP);
            setMountStatus(true);
        }
    }, [status]);

    return (
        <ReactModal
            className="GenericYesNoPopupDraggable"
            initWidth={600}
            initHeight={600}
            onFocus={() => console.log('on focused')}
            isOpen={true}
            onRequestClose={() => console.group('on request close')}>
            <div className="Header">{title}</div>
            <div className="Content">{renderContent()}</div>
            <div className="Footer">
                {!skipAcceptButton && (
                    <TextButton
                        label={!!acceptLabel ? acceptLabel : 'YES'}
                        onClick={onAccept}
                        externalClassName={'accept'}
                        isDisabled={disableAcceptButton}
                    />
                )}
                {!skipRejectButton && (
                    <TextButton
                        label={!!rejectLabel ? rejectLabel : 'NO, THANKS'}
                        onClick={onReject}
                        externalClassName={'reject'}
                        isDisabled={disableRejectButton}
                    />
                )}
            </div>
        </ReactModal>
    );
};
