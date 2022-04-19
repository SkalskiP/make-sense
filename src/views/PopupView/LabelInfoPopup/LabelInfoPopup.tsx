import React, {useEffect, useState} from 'react';
import './LabelInfoPopup.scss';
import {AppState} from '../../../store';
import {connect} from 'react-redux';
import {HumanInfo, ImageData, ItemInfo} from '../../../store/labels/types';
import {GenericYesNoPopup} from '../GenericYesNoPopup/GenericYesNoPopup';
import {updateActivePopupType} from '../../../store/general/actionCreators';
import {PopupWindowType} from '../../../data/enums/PopupWindowType';
import {LabelsSelector} from '../../../store/selectors/LabelsSelector';
import {TagButton} from '../../Common/TagButton/TagButton';
import {
    ATTRIBUTE_TYPE,
    FASHION_STYLE_MAN,
    FASHION_STYLE_WOMAN,
    GENDER,
    SOURCE
} from '../../../data/enums/ItemType';
import {LabelModeType} from '../../../data/enums/LabelType';
import {AttributeSelect} from '../../Common/AttributeSelect/AttributeSelect';
import _ from 'lodash';
import {updateImageDataById} from '../../../store/labels/actionCreators';

interface IProps {
    labelRectId: string;
    imageData: ImageData;
    updateActivePopupTypeAction: (popupType: PopupWindowType) => any;
    updateImageDataByIdAction: (id: string, newImageData: ImageData) => any;
}

interface ISelectedItem {
    [key: string]: any;
}

const LabelInfoPopup: React.FC<IProps> = ({
    labelRectId,
    imageData,
    updateActivePopupTypeAction,
    updateImageDataByIdAction
}) => {
    const labelRect = LabelsSelector.getActiveRectLabel();
    const {id, mode} = labelRect;
    const [humanInfo, setHumanInfo] = useState<HumanInfo>();
    const [itemInfo, setItemInfo] = useState<ItemInfo>();
    const [selectedItems, setSelectedItems] = useState<ISelectedItem>({});
    const [gender, setGender] = useState<number>();

    useEffect(() => {
        if (mode === LabelModeType.HUMAN) {
            const found = _.find(imageData.humans, {uuid: id});
            setHumanInfo(found);
            const fashionStyles =
                found.gender === GENDER.MAN
                    ? FASHION_STYLE_MAN
                    : FASHION_STYLE_WOMAN;
            setGender(found.gender);
            setSelectedItems({
                [ATTRIBUTE_TYPE.GENDER]: {
                    value: found.gender,
                    label: Object.keys(GENDER).find(
                        (key) => GENDER[key] === found.gender
                    )
                },
                [ATTRIBUTE_TYPE.SOURCE]: {
                    value: found.type,
                    label: Object.keys(SOURCE).find(
                        (key) => SOURCE[key] === found.type
                    )
                },
                [ATTRIBUTE_TYPE.FASHION_STYLE]: found.styles.map((style) => ({
                    value: style,
                    label: fashionStyles[style]
                }))
            });
        } else {
            setItemInfo(_.find(imageData.items, {uuid: id}));
        }

        return () => {
            // nothing
        };
    }, [mode]);

    const onSelect = (
        item: {value: any; label: string},
        type: ATTRIBUTE_TYPE
    ) => {
        console.log('selectedItem = ', item, type);
        switch (type) {
            case ATTRIBUTE_TYPE.GENDER: {
                setGender(item.value);
                break;
            }
        }
        setSelectedItems({...selectedItems, [type]: item});
    };

    const save = () => {
        if (mode === LabelModeType.HUMAN) {
            const updatedHumanInfo = {
                ...humanInfo,
                gender: selectedItems[ATTRIBUTE_TYPE.GENDER].value,
                type: selectedItems[ATTRIBUTE_TYPE.SOURCE].value,
                styles: selectedItems[ATTRIBUTE_TYPE.FASHION_STYLE].map(
                    (item) => item.value
                )
            };
            imageData.humans = imageData.humans.map((human) =>
                human.uuid === humanInfo.uuid ? updatedHumanInfo : human
            );
            console.log('next = ', updatedHumanInfo, imageData);
            updateImageDataByIdAction(imageData.id, imageData);
        }
    };

    const renderContent = () => {
        console.log('humanInfo', humanInfo);
        console.log('itemInfo', itemInfo);
        console.log('selectedItems', selectedItems);
        if (!humanInfo && !itemInfo) {
            return null;
        }
        return mode === LabelModeType.HUMAN ? (
            <div className="LabelInfoPopupContent">
                <div className="AttributeContainer">
                    <div className="AttributeName">Gender</div>
                    <div className="AttributeSelector">
                        <AttributeSelect
                            type={ATTRIBUTE_TYPE.GENDER}
                            onSelect={onSelect}
                            value={selectedItems[ATTRIBUTE_TYPE.GENDER]}
                        />
                    </div>
                </div>
                <div className="AttributeContainer">
                    <div className="AttributeName">Human type</div>
                    <div className="AttributeSelector">
                        <AttributeSelect
                            type={ATTRIBUTE_TYPE.SOURCE}
                            onSelect={onSelect}
                            value={selectedItems[ATTRIBUTE_TYPE.SOURCE]}
                        />
                    </div>
                </div>
                <div className="AttributeContainer">
                    <div className="AttributeName">Styles</div>
                    <div className="AttributeSelector">
                        <AttributeSelect
                            type={ATTRIBUTE_TYPE.FASHION_STYLE}
                            gender={gender}
                            onSelect={onSelect}
                            value={selectedItems[ATTRIBUTE_TYPE.FASHION_STYLE]}
                            isMulti={true}
                        />
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
                            value={selectedItems[ATTRIBUTE_TYPE.GENDER]}
                        />
                    </div>
                </div>
                <div className="AttributeContainer">
                    <div className="AttributeName">Category</div>
                    <div className="AttributeSelector">
                        <AttributeSelect
                            type={ATTRIBUTE_TYPE.MAIN_CATEGORY}
                            onSelect={onSelect}
                            value={selectedItems[ATTRIBUTE_TYPE.MAIN_CATEGORY]}
                        />
                        <div style={{width: '10px'}} />
                        <AttributeSelect
                            type={ATTRIBUTE_TYPE.SUB_CATEGORY}
                            onSelect={onSelect}
                            value={selectedItems[ATTRIBUTE_TYPE.SUB_CATEGORY]}
                        />
                    </div>
                </div>
                <div className="AttributeContainer">
                    <div className="AttributeName">Color</div>
                    <div className="AttributeSelector">
                        <AttributeSelect
                            type={ATTRIBUTE_TYPE.ITEM_COLOR}
                            onSelect={onSelect}
                            value={selectedItems[ATTRIBUTE_TYPE.ITEM_COLOR]}
                        />
                    </div>
                </div>
                <div className="AttributeContainer">
                    <div className="AttributeName">Pattern</div>
                    <div className="AttributeSelector">
                        <AttributeSelect
                            type={ATTRIBUTE_TYPE.ITEM_PATTERN}
                            onSelect={onSelect}
                            value={selectedItems[ATTRIBUTE_TYPE.ITEM_PATTERN]}
                        />
                    </div>
                </div>

                <div className="AttributeContainer">
                    <div className="AttributeName">Styles</div>
                    <div className="AttributeSelector">
                        <AttributeSelect
                            type={ATTRIBUTE_TYPE.FASHION_STYLE}
                            onSelect={onSelect}
                            value={selectedItems[ATTRIBUTE_TYPE.FASHION_STYLE]}
                            isMulti={true}
                        />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <GenericYesNoPopup
            title={`${mode} Label Info`}
            renderContent={renderContent}
            acceptLabel={'Save'}
            onAccept={save}
            rejectLabel={'Cancel'}
            onReject={() => updateActivePopupTypeAction(null)}
        />
    );
};

const mapDispatchToProps = {
    updateActivePopupTypeAction: updateActivePopupType,
    updateImageDataByIdAction: updateImageDataById
};

const mapStateToProps = (state: AppState) => ({
    imageData: state.labels.imagesData[state.labels.activeImageIndex],
    labelRectId: state.labels.activeLabelId
});

export default connect(mapStateToProps, mapDispatchToProps)(LabelInfoPopup);
