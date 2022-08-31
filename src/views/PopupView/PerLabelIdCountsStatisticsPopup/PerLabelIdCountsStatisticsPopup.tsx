import React from 'react';
import './PerLabelIdCountsStatisticsPopup.scss';
import {PopupWindowType} from '../../../data/enums/PopupWindowType';
import {AppState} from '../../../store';
import {connect} from 'react-redux';
import {updateActivePopupType as storeUpdateActivePopupType} from '../../../store/general/actionCreators';
import {GenericYesNoPopup} from '../GenericYesNoPopup/GenericYesNoPopup';
import {ImageButton} from '../../Common/ImageButton/ImageButton';
import {LabelsSelector} from '../../../store/selectors/LabelsSelector';

interface IProps {
    updateActivePopupTypeAction: (activePopupType: PopupWindowType) => void;
}

const PerLabelIdCountsStatisticsPopup: React.FC<IProps> = ({ updateActivePopupTypeAction }) => {

    const labelNames = LabelsSelector.getLabelNames()
    const imageData = LabelsSelector.getImagesData()

    const onReject = () => {
        updateActivePopupTypeAction(null);
    };

    const renderContent = () => {
        return <div className={'per-label-id-counts-statistics-popup-content'}>
            <div className='left-container'>
                <ImageButton
                    image={'ico/tags.png'}
                    imageAlt={'plus'}
                    buttonSize={{ width: 40, height: 40 }}
                    padding={20}
                    externalClassName={'monochrome'}
                    isActive={true}
                />
            </div>
            <div className='right-container'>
                <table>
                    <tr>
                        <th>Company</th>
                        <th>Contact</th>
                        <th>Country</th>
                    </tr>
                    <tr>
                        <td>Alfreds Futterkiste</td>
                        <td>Maria Anders</td>
                        <td>Germany</td>
                    </tr>
                    <tr>
                        <td>Centro comercial Moctezuma</td>
                        <td>Francisco Chang</td>
                        <td>Mexico</td>
                    </tr>
                </table>
            </div>
        </div>
    }

    return (
        <GenericYesNoPopup
            title={'Label distribution'}
            renderContent={renderContent}
            skipAcceptButton={true}
            onReject={onReject}
            rejectLabel={'Close'}
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
