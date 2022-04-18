import React, {useState} from 'react';
import './LabelInfoPopup.scss';
import {AppState} from '../../../store';
import {connect} from 'react-redux';
import {ImageButton} from '../../Common/ImageButton/ImageButton';
import {ImageData} from '../../../store/labels/types';
import {GenericYesNoPopup} from '../GenericYesNoPopup/GenericYesNoPopup';
import {updateActivePopupType} from '../../../store/general/actionCreators';
import {PopupWindowType} from '../../../data/enums/PopupWindowType';
import {LabelsSelector} from '../../../store/selectors/LabelsSelector';
import {TagButton} from '../../Common/TagButton/TagButton';
import {ATTRIBUTE_TYPE, FASHION_STYLE_MAN} from '../../../data/enums/ItemType';
import {LabelModeType} from '../../../data/enums/LabelType';
import {AttributeSelect} from '../../Common/AttributeSelect/AttributeSelect';

interface IProps {
    labelRectId: string;
    imageData: ImageData;
    updateActivePopupTypeAction: (popupType: PopupWindowType) => any;
}

const LabelInfoPopup: React.FC<IProps> = ({
    labelRectId,
    imageData,
    updateActivePopupTypeAction
}) => {
    const labelRect = LabelsSelector.getActiveRectLabel();
    const onSelect = (code: number, type: ATTRIBUTE_TYPE) =>
        console.log('selected code = ', code, type);
    const renderContent = () => {
        return labelRect.mode === LabelModeType.HUMAN ? (
            <div className="LabelInfoPopupContent">
                <div className="AttributeContainer">
                    <div className="AttributeName">Gender</div>
                    <div className="AttributeSelector">
                        <TagButton label="Male" />
                        <TagButton label="Female" />
                    </div>
                </div>
                <div className="AttributeContainer">
                    <div className="AttributeName">Human type</div>
                    <div className="AttributeSelector">
                        <TagButton label="Human" />
                        <TagButton label="Mannequin" />
                        <TagButton label="Stylebook" />
                    </div>
                </div>
                <div className="AttributeContainer">
                    <div className="AttributeName">Style</div>
                    <div className="AttributeSelector">
                        <TagButton label={FASHION_STYLE_MAN.GENTLEMAN} />
                        <TagButton label={FASHION_STYLE_MAN.SPORTY} />
                        <TagButton label={FASHION_STYLE_MAN.PUNK} />
                    </div>
                </div>
            </div>
        ) : (
            <div className="LabelInfoPopupContent">
                <div className="AttributeContainer">
                    <div className="AttributeName">Item UUID</div>
                    <div className="AttributeSelector">
                        <div className="title">{labelRectId}</div>
                    </div>
                </div>

                <div className="AttributeContainer">
                    <div className="AttributeName">Linked Human ID</div>
                    <div className="AttributeSelector">
                        {imageData.humans.map((human, idx) => (
                            <TagButton
                                key={String(human.id)}
                                label={String(idx)}
                            />
                        ))}
                    </div>
                </div>
                <div className="AttributeContainer">
                    <div className="AttributeName">Gender</div>
                    <div className="AttributeSelector">
                        <AttributeSelect
                            type={ATTRIBUTE_TYPE.GENDER}
                            onSelect={onSelect}
                        />
                    </div>
                </div>
                <div className="AttributeContainer">
                    <div className="AttributeName">Category</div>
                    <div className="AttributeSelector">
                        <AttributeSelect
                            type={ATTRIBUTE_TYPE.MAIN_CATEGORY}
                            onSelect={onSelect}
                        />
                        <div style={{width: '10px'}} />
                        <AttributeSelect
                            type={ATTRIBUTE_TYPE.SUB_CATEGORY}
                            onSelect={onSelect}
                        />
                    </div>
                </div>
                <div className="AttributeContainer">
                    <div className="AttributeName">Color</div>
                    <div className="AttributeSelector">
                        <AttributeSelect
                            type={ATTRIBUTE_TYPE.ITEM_COLOR}
                            onSelect={onSelect}
                        />
                    </div>
                </div>
                <div className="AttributeContainer">
                    <div className="AttributeName">Pattern</div>
                    <div className="AttributeSelector">
                        <AttributeSelect
                            type={ATTRIBUTE_TYPE.ITEM_PATTERN}
                            onSelect={onSelect}
                        />
                    </div>
                </div>

                <div className="AttributeContainer">
                    <div className="AttributeName">Style</div>
                    <div className="AttributeSelector"></div>
                </div>
            </div>
        );
    };

    return (
        <GenericYesNoPopup
            title={`${labelRect.mode} Label Info`}
            renderContent={renderContent}
            acceptLabel={'Save'}
            onAccept={() => updateActivePopupTypeAction(null)}
            rejectLabel={'Cancel'}
            onReject={() => updateActivePopupTypeAction(null)}
        />
    );
};

const mapDispatchToProps = {
    updateActivePopupTypeAction: updateActivePopupType
};

const mapStateToProps = (state: AppState) => ({
    imageData: state.labels.imagesData[state.labels.activeImageIndex],
    labelRectId: state.labels.activeLabelId
});

export default connect(mapStateToProps, mapDispatchToProps)(LabelInfoPopup);
