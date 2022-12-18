import React from 'react';
import './PopupView.scss';
import { PopupWindowType } from '../../data/enums/PopupWindowType';
import { AppState } from '../../store';
import { connect } from 'react-redux';
import LoadLabelsPopup from './LoadLabelNamesPopup/LoadLabelNamesPopup';
import InsertLabelNamesPopup from './InsertLabelNamesPopup/InsertLabelNamesPopup';
import ExitProjectPopup from './ExitProjectPopup/ExitProjectPopup';
import LoadMoreImagesPopup from './LoadMoreImagesPopup/LoadMoreImagesPopup';
import SuggestLabelNamesPopup from './SuggestLabelNamesPopup/SuggestLabelNamesPopup';
import { CSSHelper } from '../../logic/helpers/CSSHelper';
import { ClipLoader } from 'react-spinners';
import ImportLabelPopup from './ImportLabelPopup/ImportLabelPopup';
import ExportLabelPopup from './ExportLabelsPopup/ExportLabelPopup';
import LoadModelPopup from './LoadModelPopup/LoadModelPopup';
import LoadYOLOv5ModelPopup from './LoadYOLOv5ModelPopup/LoadYOLOv5ModelPopup';
import ConnectInferenceServerPopup from './ConnectInferenceServerPopup/ConnectInferenceServerPopup';

interface IProps {
    activePopupType: PopupWindowType;
}

const PopupView: React.FC<IProps> = ({ activePopupType }) => {

    const selectPopup = () => {
        switch (activePopupType) {
            case PopupWindowType.LOAD_LABEL_NAMES:
                return <LoadLabelsPopup />;
            case PopupWindowType.EXPORT_ANNOTATIONS:
                return <ExportLabelPopup />;
            case PopupWindowType.IMPORT_ANNOTATIONS:
                return <ImportLabelPopup />;
            case PopupWindowType.INSERT_LABEL_NAMES:
                return <InsertLabelNamesPopup
                    isUpdate={false}
                />;
            case PopupWindowType.UPDATE_LABEL:
                return <InsertLabelNamesPopup
                    isUpdate={true}
                />;
            case PopupWindowType.EXIT_PROJECT:
                return <ExitProjectPopup />;
            case PopupWindowType.IMPORT_IMAGES:
                return <LoadMoreImagesPopup />;
            case PopupWindowType.LOAD_AI_MODEL:
                return <LoadModelPopup />;
            case PopupWindowType.LOAD_YOLO_V5_MODEL:
                return <LoadYOLOv5ModelPopup />;
            case PopupWindowType.CONNECT_AI_MODEL_VIA_API:
                return <ConnectInferenceServerPopup />;
            case PopupWindowType.SUGGEST_LABEL_NAMES:
                return <SuggestLabelNamesPopup />;
            case PopupWindowType.LOADER:
                return <ClipLoader
                    size={50}
                    color={CSSHelper.getLeadingColor()}
                    loading={true}
                />;
            default:
                return null;
        }
    };

    return (
        activePopupType && <div className='PopupView'>
            {selectPopup()}
        </div>
    );
};

const mapStateToProps = (state: AppState) => ({
    activePopupType: state.general.activePopupType
});

export default connect(
    mapStateToProps
)(PopupView);
