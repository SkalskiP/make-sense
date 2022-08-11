import React from 'react';
import './PerLabelIdCountsStatisticsPopup.scss';
import {PopupWindowType} from '../../../data/enums/PopupWindowType';
import {AppState} from '../../../store';
import {connect} from 'react-redux';
import {updateActivePopupType as storeUpdateActivePopupType} from '../../../store/general/actionCreators';
import {GenericYesNoPopup} from '../GenericYesNoPopup/GenericYesNoPopup';
import Scrollbars from 'react-custom-scrollbars-2';

interface IProps {
    updateActivePopupTypeAction: (activePopupType: PopupWindowType) => void;
}

const PerLabelIdCountsStatisticsPopup: React.FC<IProps> = ({ updateActivePopupTypeAction }) => {

    const onReject = () => {
        updateActivePopupTypeAction(null);
    };

    const renderContent = () => {
        return <div className={'per-label-id-counts-statistics-popup-content'}>
            <Scrollbars autoHeight={true}>
                <div>
                    {null}
                </div>
            </Scrollbars>
        </div>
    }

    return (
        <GenericYesNoPopup
            title={'Insights'}
            renderContent={renderContent}
            skipAcceptButton={true}
            onReject={onReject}
        />
    );
}

const mapDispatchToProps = {
    updateActivePopupTypeAction: storeUpdateActivePopupType
};

const mapStateToProps = (state: AppState) => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PerLabelIdCountsStatisticsPopup);
