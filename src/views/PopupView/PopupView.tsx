import React from 'react';
import './PopupView.scss';
import {PopupWindowType} from '../../data/enums/PopupWindowType';
import {AppState} from '../../store';
import {connect} from 'react-redux';
import LoadLabelsPopup from './LoadLabelNamesPopup/LoadLabelNamesPopup';
import InsertLabelNamesPopup from './InsertLabelNamesPopup/InsertLabelNamesPopup';
import ExitProjectPopup from './ExitProjectPopup/ExitProjectPopup';
import LoadMoreImagesPopup from './LoadMoreImagesPopup/LoadMoreImagesPopup';
import {LoadModelPopup} from './LoadModelPopup/LoadModelPopup';
import SuggestLabelNamesPopup from './SuggestLabelNamesPopup/SuggestLabelNamesPopup';
import {CSSHelper} from '../../logic/helpers/CSSHelper';
import {ClipLoader} from 'react-spinners';
import ImportLabelPopup from './ImportLabelPopup/ImportLabelPopup';
import ExportLabelPopup from './ExportLabelsPopup/ExportLabelPopup';
import LabelInfoPopup from './LabelInfoPopup/LabelInfoPopup';
import LoginPopup from './LoginPopup/LoginPopup';
import LogoutPopup from './LogoutPopup/LogoutPopup';
import DeleteConfirmPopup from './DeleteConfirmPopup/DeleteConfirmPopup';

interface IProps {
    activePopupType: PopupWindowType;
}

const PopupView: React.FC<IProps> = ({activePopupType}) => {
    console.log(activePopupType)
    const selectPopup = () => {
        switch (activePopupType) {
            
            case PopupWindowType.LOGIN:
                return <LoginPopup />;
            case PopupWindowType.LOGOUT:
                return <LogoutPopup />;
            case PopupWindowType.LOAD_LABEL_NAMES:
                return <LoadLabelsPopup />;
            case PopupWindowType.EXPORT_ANNOTATIONS:
                return <ExportLabelPopup />;
            case PopupWindowType.IMPORT_ANNOTATIONS:
                return <ImportLabelPopup />;
            case PopupWindowType.INSERT_LABEL_NAMES:
                return <InsertLabelNamesPopup isUpdate={false} />;
            case PopupWindowType.UPDATE_LABEL:
                return <InsertLabelNamesPopup isUpdate={true} />;
            case PopupWindowType.LABEL_INFO:
                return <LabelInfoPopup />;
            case PopupWindowType.EXIT_PROJECT:
                return <ExitProjectPopup />;
            case PopupWindowType.IMPORT_IMAGES:
                return <LoadMoreImagesPopup />;
            case PopupWindowType.LOAD_AI_MODEL:
                return <LoadModelPopup />;
            case PopupWindowType.SUGGEST_LABEL_NAMES:
                return <SuggestLabelNamesPopup />;
            case PopupWindowType.DELETE_CONFIRM:
                return <DeleteConfirmPopup />;
            case PopupWindowType.LOADER:
                return (
                    <ClipLoader
                        size={50}
                        color={CSSHelper.getLeadingColor()}
                        loading={true}
                    />
                );
            default:
                return <LoginPopup />;
        }
    };

    return activePopupType && <div className="PopupView ">{selectPopup()}</div>;
};

const mapStateToProps = (state: AppState) => ({
    activePopupType: state.general.activePopupType
});

export default connect(mapStateToProps)(PopupView);
