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
    FASHION_STYLE,
    GENDER,
    ITEM_COLOR,
    ITEM_PATTERN,
    MAIN_CATEGORY_CODE,
    SOURCE,
    SUB_CATEGORY_CODE,
    SUB_CATEGORY_TO_MAIN
} from '../../../data/enums/ItemType';
import {LabelModeType} from '../../../data/enums/LabelType';
import {AttributeSelect} from '../../Common/AttributeSelect/AttributeSelect';
import _ from 'lodash';
import {
    updateActiveColor,
    updateActiveGender,
    updateActiveHumanID,
    updateActiveHumanType,
    updateActiveMainCategory,
    updateActivePattern,
    updateActiveStyles,
    updateActiveSubCategory,
    updateImageDataById
} from '../../../store/labels/actionCreators';

import {vi as lang} from '../../../lang';

interface IProps {
    labelRectId: string;
    imageData: ImageData;
    updateActivePopupTypeAction: (popupType: PopupWindowType) => any;
    updateImageDataByIdAction: (id: string, newImageData: ImageData) => any;
    updateActiveGenderAction: (gender: number) => any;
    updateActiveHumanTypeAction: (humanType: number) => any;
    updateActiveStylesAction: (styles: string[]) => any;
    updateActiveHumanIDAction: (humanId: string) => any;
    updateActiveMainCategoryAction: (mainCategory: number) => any;
    updateActiveSubCategoryAction: (subCategory: number) => any;
    updateActiveColorAction: (color: number) => any;
    updateActivePatternAction: (pattern: number) => any;
}

interface ISelectedItem {
    [key: string]: any;
}

const LabelInfoPopup: React.FC<IProps> = ({
    labelRectId,
    imageData,
    updateActivePopupTypeAction,
    updateImageDataByIdAction,
    updateActiveGenderAction,
    updateActiveHumanTypeAction,
    updateActiveStylesAction,
    updateActiveHumanIDAction,
    updateActiveMainCategoryAction,
    updateActiveSubCategoryAction,
    updateActiveColorAction,
    updateActivePatternAction
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
            setGender(found.gender);
            const genderKey = Object.keys(GENDER).find(
                (key) => GENDER[key] === found.gender
            );
            const sourceKey = Object.keys(SOURCE).find(
                (key) => SOURCE[key] === found.type
            );
            setSelectedItems({
                [ATTRIBUTE_TYPE.GENDER]: {
                    value: found.gender,
                    label: `${lang.GENDER[genderKey]} (${genderKey})`
                },
                [ATTRIBUTE_TYPE.SOURCE]: {
                    value: found.type,
                    label: `${lang.SOURCE[sourceKey]} (${sourceKey})`
                },
                [ATTRIBUTE_TYPE.FASHION_STYLE]:
                    found.styles.length > 0
                        ? found.styles.map((style) => {
                              return {
                                  value: style.toUpperCase(),
                                  label: `${
                                      lang.FASHION_STYLE[style.toLowerCase()]
                                  } (${style.toUpperCase()})`
                              };
                          })
                        : imageData.guideStyles.map((style) => {
                              return {
                                  value: style.name.toUpperCase(),
                                  label: `${
                                      lang.FASHION_STYLE[
                                          style.name.toLocaleLowerCase()
                                      ]
                                  } (${style.name.toUpperCase()})`
                              };
                          })
            });
        } else {
            const found = _.find(imageData.items, {uuid: id});
            setItemInfo(found);
            setGender(found.gender);
            const humanIndex = imageData.humans.findIndex(
                (human) => human.uuid === found.humanId
            );
            const genderKey = Object.keys(GENDER).find(
                (key) => GENDER[key] === found.gender
            );

            setSelectedItems({
                [ATTRIBUTE_TYPE.HUMAN_ID]: {
                    value: found.humanId,
                    label: humanIndex === -1 ? 'UNKNOWN' : humanIndex
                },
                [ATTRIBUTE_TYPE.GENDER]: {
                    value: found.gender,
                    label: `${lang.GENDER[genderKey]} (${genderKey})`
                },
                [ATTRIBUTE_TYPE.MAIN_CATEGORY]: {
                    value: found.mainCategory,
                    label: `${
                        lang.MAIN_CATEGORY[
                            MAIN_CATEGORY_CODE[found.mainCategory]
                        ]
                    } (${MAIN_CATEGORY_CODE[found.mainCategory]})`
                },
                [ATTRIBUTE_TYPE.SUB_CATEGORY]: {
                    value: found.subCategory,
                    label: `${
                        lang.SUB_CATEGORY[SUB_CATEGORY_CODE[found.subCategory]]
                    } (${SUB_CATEGORY_CODE[found.subCategory]})`
                },
                [ATTRIBUTE_TYPE.ITEM_COLOR]: {
                    value: found.color,
                    label: `${lang.ITEM_COLOR[ITEM_COLOR[found.color]]} (${
                        ITEM_COLOR[found.color]
                    })`
                },
                [ATTRIBUTE_TYPE.ITEM_PATTERN]: {
                    value: found.pattern,
                    label: `${
                        lang.ITEM_PATTERN[ITEM_PATTERN[found.pattern]]
                    } (${ITEM_PATTERN[found.pattern]})`
                },

                [ATTRIBUTE_TYPE.FASHION_STYLE]:
                    found.styles.length > 0
                        ? found.styles.map((style) => {
                              return {
                                  value: style.toUpperCase(),
                                  label: `${
                                      lang.FASHION_STYLE[style.toLowerCase()]
                                  } (${style.toUpperCase()})`
                              };
                          })
                        : imageData.guideStyles.map((style) => {
                              return {
                                  value: style.name.toUpperCase(),
                                  label: `${
                                      lang.FASHION_STYLE[
                                          style.name.toLocaleLowerCase()
                                      ]
                                  } (${style.name.toUpperCase()})`
                              };
                          })
            });
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
                setSelectedItems({...selectedItems, [type]: item});
                break;
            }
            case ATTRIBUTE_TYPE.MAIN_CATEGORY: {
                setSelectedItems({
                    ...selectedItems,
                    [ATTRIBUTE_TYPE.MAIN_CATEGORY]: item,
                    [ATTRIBUTE_TYPE.SUB_CATEGORY]: {
                        value: SUB_CATEGORY_CODE.UNKNOWN,
                        label: `${lang.SUB_CATEGORY.UNKNOWN} (${
                            SUB_CATEGORY_CODE[SUB_CATEGORY_CODE.UNKNOWN]
                        })`
                    }
                });
                break;
            }
            case ATTRIBUTE_TYPE.SUB_CATEGORY: {
                // const mainCode =
                //     SUB_CATEGORY_TO_MAIN[SUB_CATEGORY_CODE[item.value]];
                // const mainItem = {
                //     value: mainCode,
                //     label: `${
                //         lang.MAIN_CATEGORY[MAIN_CATEGORY_CODE[mainCode]]
                //     } (${MAIN_CATEGORY_CODE[mainCode]})`
                // };

                // console.log('mainItem = ', mainItem);
                setSelectedItems({
                    ...selectedItems,
                    [ATTRIBUTE_TYPE.SUB_CATEGORY]: item
                    // [ATTRIBUTE_TYPE.MAIN_CATEGORY]: mainItem
                });
                break;
            }
            default: {
                setSelectedItems({...selectedItems, [type]: item});
            }
        }
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
            // update active*
            updateActiveGenderAction(updatedHumanInfo.gender);
            updateActiveHumanTypeAction(updatedHumanInfo.type);
            updateActiveStylesAction(updatedHumanInfo.styles);

            // update imageData
            imageData.humans = imageData.humans.map((human) =>
                human.uuid === humanInfo.uuid ? updatedHumanInfo : human
            );
            console.log('next = ', updatedHumanInfo, imageData);
            updateImageDataByIdAction(imageData.id, imageData);
        }
        if (mode === LabelModeType.ITEM) {
            console.log('selectedItems', selectedItems);
            const updateItemInfo: ItemInfo = {
                ...itemInfo,
                humanId: selectedItems[ATTRIBUTE_TYPE.HUMAN_ID].value,
                gender: selectedItems[ATTRIBUTE_TYPE.GENDER].value,
                mainCategory: selectedItems[ATTRIBUTE_TYPE.MAIN_CATEGORY].value,
                subCategory: selectedItems[ATTRIBUTE_TYPE.SUB_CATEGORY].value,
                color: selectedItems[ATTRIBUTE_TYPE.ITEM_COLOR].value,
                pattern: selectedItems[ATTRIBUTE_TYPE.ITEM_PATTERN].value,
                styles: selectedItems[ATTRIBUTE_TYPE.FASHION_STYLE].map(
                    (item) => item.value
                )
            };

            // update active*
            updateActiveGenderAction(updateItemInfo.gender);
            updateActiveMainCategoryAction(updateItemInfo.mainCategory);
            updateActiveSubCategoryAction(updateItemInfo.subCategory);
            updateActiveColorAction(updateItemInfo.color);
            updateActivePatternAction(updateItemInfo.pattern);
            updateActiveStylesAction(updateItemInfo.styles);
            updateActiveHumanIDAction(updateItemInfo.humanId);

            // update imageData
            imageData.items = imageData.items.map((item) =>
                item.uuid === itemInfo.uuid ? updateItemInfo : item
            );
            updateImageDataByIdAction(imageData.id, imageData);
        }
        updateActivePopupTypeAction(null);
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
                        <AttributeSelect
                            type={ATTRIBUTE_TYPE.HUMAN_ID}
                            onSelect={onSelect}
                            value={selectedItems[ATTRIBUTE_TYPE.HUMAN_ID]}
                        />
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
                    <div className="AttributeName">Main Category</div>
                    <div className="AttributeSelector">
                        <AttributeSelect
                            type={ATTRIBUTE_TYPE.MAIN_CATEGORY}
                            onSelect={onSelect}
                            value={selectedItems[ATTRIBUTE_TYPE.MAIN_CATEGORY]}
                        />
                        <div style={{width: '10px'}} />
                    </div>
                </div>
                <div className="AttributeContainer">
                    <div className="AttributeName">Sub Category</div>
                    <div className="AttributeSelector">
                        <AttributeSelect
                            mainCategory={
                                selectedItems[ATTRIBUTE_TYPE.MAIN_CATEGORY]
                                    .value
                            }
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
    updateImageDataByIdAction: updateImageDataById,
    updateActiveGenderAction: updateActiveGender,
    updateActiveHumanTypeAction: updateActiveHumanType,
    updateActiveStylesAction: updateActiveStyles,
    updateActiveHumanIDAction: updateActiveHumanID,
    updateActiveMainCategoryAction: updateActiveMainCategory,
    updateActiveSubCategoryAction: updateActiveSubCategory,
    updateActiveColorAction: updateActiveColor,
    updateActivePatternAction: updateActivePattern
};

const mapStateToProps = (state: AppState) => ({
    imageData: state.labels.imagesData[state.labels.activeImageIndex],
    labelRectId: state.labels.activeLabelId
});

export default connect(mapStateToProps, mapDispatchToProps)(LabelInfoPopup);
