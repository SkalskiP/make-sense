import React from 'react';
import './DeleteConfirmPopup.scss';
import {GenericYesNoPopup} from '../GenericYesNoPopup/GenericYesNoPopup';
import {AppState} from '../../../store';
import {connect} from 'react-redux';
import {PopupActions} from '../../../logic/actions/PopupActions';
import {LabelsSelector} from '../../../store/selectors/LabelsSelector';
import {LabelActions} from '../../../logic/actions/LabelActions';

interface IProps {}

const DeleteConfirmPopup: React.FC<IProps> = (props) => {
    const {} = props;

    const renderContent = () => {
        return (
            <div className="DeleteConfirmPopupContent">
                <div className="Message">Are you sure you want to Delete?</div>
            </div>
        );
    };

    const onAccept = () => {
        PopupActions.close();
        const {id: labelId} = LabelsSelector.getActiveRectLabel();
        const {id: imageId} = LabelsSelector.getActiveImageData();
        console.log('imageId = ', imageId);
        console.log('labelId = ', labelId);
        LabelActions.deleteRectLabelById(imageId, labelId);
    };

    const onReject = () => {
        PopupActions.close();
    };

    return (
        <div>
        <GenericYesNoPopup
            title={'Delete Confirmation'}
            renderContent={renderContent}
            acceptLabel={'OK'}
            onAccept={onAccept}
            rejectLabel={'Cancel'}
            onReject={onReject}
        />
        </div>
    );
};

const mapDispatchToProps = {};

const mapStateToProps = (state: AppState) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(DeleteConfirmPopup);
