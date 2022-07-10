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
    FASHION_STYLE_MAN,
    FASHION_STYLE_WOMAN,
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
import {GenericYesNoPopupDraggable} from '../GenericYesNoPopupDraggable/GenericYesNoPopupDraggable';
import {JSONUploadStatus} from '../../../data/enums/JSONUploadStatus';
import {Settings} from '../../../settings/Settings';

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
    const [image, setImage] = useState<string | undefined>();

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
                    label: (
                        <div className="IconItem">
                            <img
                                src={
                                    GENDER[genderKey] === GENDER.UNKNOWN
                                        ? Settings.UNKNOWN_URL
                                        : `guides/icons/genders/${GENDER[genderKey]}_s.png`
                                }
                                width={30}
                                height={30}
                            />
                            <span className="ItemTitle">{`${lang.GENDER[genderKey]} (${genderKey})`}</span>
                        </div>
                    )
                },
                [ATTRIBUTE_TYPE.SOURCE]: {
                    value: found.type,
                    label: (
                        <div className="IconItem">
                            <img
                                src={
                                    SOURCE[sourceKey] === SOURCE.UNKNOWN
                                        ? Settings.UNKNOWN_URL
                                        : `guides/icons/sources/${SOURCE[sourceKey]}_s.png`
                                }
                                width={30}
                                height={30}
                            />
                            <span className="ItemTitle">{`${lang.SOURCE[sourceKey]} (${sourceKey})`}</span>
                        </div>
                    )
                },
                [ATTRIBUTE_TYPE.FASHION_STYLE]:
                    found.styles.length > 0
                        ? found.styles.map((styleString) => {
                              const style =
                                  _.find(
                                      FASHION_STYLE,
                                      (item) =>
                                          item.name.toUpperCase() ===
                                          styleString.toUpperCase()
                                  ) || _.last(FASHION_STYLE);
                              return {
                                  value: style.name.toUpperCase(),
                                  label: (
                                      <div className="IconItem">
                                          <img
                                              src={
                                                  style.seq === -1
                                                      ? Settings.UNKNOWN_URL
                                                      : gender === GENDER.MAN
                                                      ? `guides/icons/man_style/${style.m}_s.png`
                                                      : `guides/icons/woman_style/${style.f}_s.png`
                                              }
                                              width={30}
                                              height={30}
                                          />
                                          <span className="ItemTitle">{`${
                                              lang.FASHION_STYLE[
                                                  style.name.toLowerCase()
                                              ]
                                          } (${style.name.toUpperCase()})`}</span>
                                      </div>
                                  )
                              };
                          })
                        : imageData.guideStyles.map((guideStyle) => {
                              const style =
                                  _.find(FASHION_STYLE, {
                                      seq: parseInt(guideStyle.seq)
                                  }) || _.last(FASHION_STYLE);
                              return {
                                  value: style.name.toUpperCase(),
                                  label: (
                                      <div className="IconItem">
                                          <img
                                              src={
                                                  style.seq === -1
                                                      ? Settings.UNKNOWN_URL
                                                      : gender === GENDER.MAN
                                                      ? `guides/icons/man_style/${style.m}_s.png`
                                                      : `guides/icons/woman_style/${style.f}_s.png`
                                              }
                                              width={30}
                                              height={30}
                                          />
                                          <span className="ItemTitle">{`${
                                              lang.FASHION_STYLE[
                                                  style.name.toLowerCase()
                                              ]
                                          } (${style.name.toUpperCase()})`}</span>
                                      </div>
                                  )
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
                    label: (
                        <div className="IconItem">
                            <img
                                src={
                                    GENDER[genderKey] === GENDER.UNKNOWN
                                        ? Settings.UNKNOWN_URL
                                        : `guides/icons/genders/${GENDER[genderKey]}_s.png`
                                }
                                width={30}
                                height={30}
                            />
                            <span className="ItemTitle">{`${lang.GENDER[genderKey]} (${genderKey})`}</span>
                        </div>
                    )
                },
                [ATTRIBUTE_TYPE.MAIN_CATEGORY]: {
                    value: found.mainCategory,
                    label: (
                        <div className="IconItem">
                            <img
                                src={
                                    found.mainCategory ===
                                    MAIN_CATEGORY_CODE.UNKNOWN
                                        ? Settings.UNKNOWN_URL
                                        : `guides/icons/main_cats/${found.mainCategory}_s.png`
                                }
                                width={30}
                                height={30}
                            />
                            <span className="ItemTitle">{`${
                                lang.MAIN_CATEGORY[
                                    MAIN_CATEGORY_CODE[found.mainCategory]
                                ]
                            } (${
                                MAIN_CATEGORY_CODE[found.mainCategory]
                            })`}</span>
                        </div>
                    )
                },
                [ATTRIBUTE_TYPE.SUB_CATEGORY]: {
                    value: found.subCategory,
                    // label: `${
                    //     lang.SUB_CATEGORY[SUB_CATEGORY_CODE[found.subCategory]]
                    // } (${SUB_CATEGORY_CODE[found.subCategory]})`
                    label: (
                        <div className="IconItem">
                            <img
                                src={
                                    found.subCategory ===
                                    SUB_CATEGORY_CODE.UNKNOWN
                                        ? Settings.UNKNOWN_URL
                                        : `guides/icons/sub_cats/${found.subCategory}_s.png`
                                }
                                width={30}
                                height={30}
                            />
                            <span className="ItemTitle">
                                {`${
                                    lang.SUB_CATEGORY[
                                        SUB_CATEGORY_CODE[found.subCategory]
                                    ]
                                } (${SUB_CATEGORY_CODE[found.subCategory]})`}
                            </span>
                        </div>
                    )
                },
                [ATTRIBUTE_TYPE.ITEM_COLOR]: {
                    value: found.color,
                    // label: `${lang.ITEM_COLOR[ITEM_COLOR[found.color]]} (${
                    //     ITEM_COLOR[found.color]
                    // })`
                    label: (
                        <div className="IconItem">
                            <img
                                src={
                                    found.color === ITEM_COLOR.UNKNOWN
                                        ? Settings.UNKNOWN_URL
                                        : `guides/icons/colors/${found.color}_s.png`
                                }
                                width={30}
                                height={30}
                            />
                            <span className="ItemTitle">{`${
                                lang.ITEM_COLOR[ITEM_COLOR[found.color]]
                            } (${ITEM_COLOR[found.color]})`}</span>
                        </div>
                    )
                },
                [ATTRIBUTE_TYPE.ITEM_PATTERN]: {
                    value: found.pattern,
                    label: (
                        <div className="IconItem">
                            <img
                                src={
                                    found.pattern === ITEM_PATTERN.UNKNOWN
                                        ? Settings.UNKNOWN_URL
                                        : `guides/icons/patterns/${found.pattern}_s.png`
                                }
                                width={30}
                                height={30}
                            />
                            <span className="ItemTitle">{`${
                                lang.ITEM_PATTERN[ITEM_PATTERN[found.pattern]]
                            } (${ITEM_PATTERN[found.pattern]})`}</span>
                        </div>
                    )
                },

                [ATTRIBUTE_TYPE.FASHION_STYLE]:
                    found.styles.length > 0
                        ? found.styles.map((styleString) => {
                              const style =
                                  _.find(
                                      FASHION_STYLE,
                                      (item) =>
                                          item.name.toUpperCase() ===
                                          styleString.toUpperCase()
                                  ) || _.last(FASHION_STYLE);
                              return {
                                  value: style.name.toUpperCase(),
                                  label: (
                                      <div className="IconItem">
                                          <img
                                              src={
                                                  style.seq === -1
                                                      ? Settings.UNKNOWN_URL
                                                      : gender === GENDER.MAN
                                                      ? `guides/icons/man_style/${style.m}_s.png`
                                                      : `guides/icons/woman_style/${style.f}_s.png`
                                              }
                                              width={30}
                                              height={30}
                                          />
                                          <span className="ItemTitle">{`${
                                              lang.FASHION_STYLE[
                                                  style.name.toLowerCase()
                                              ]
                                          } (${style.name.toUpperCase()})`}</span>
                                      </div>
                                  )
                              };
                          })
                        : imageData.guideStyles.map((guideStyle) => {
                              const style =
                                  _.find(
                                      gender === GENDER.MAN
                                          ? FASHION_STYLE_MAN
                                          : FASHION_STYLE_WOMAN,
                                      {
                                          seq: parseInt(guideStyle.seq)
                                      }
                                  ) || _.last(FASHION_STYLE);
                              return {
                                  value: style.name.toUpperCase(),
                                  label: (
                                      <div className="IconItem">
                                          <img
                                              src={
                                                  style.seq === -1
                                                      ? Settings.UNKNOWN_URL
                                                      : gender === GENDER.MAN
                                                      ? `guides/icons/man_style/${style.m}_s.png`
                                                      : `guides/icons/woman_style/${style.f}_s.png`
                                              }
                                              width={30}
                                              height={30}
                                          />
                                          <span className="ItemTitle">{`${
                                              lang.FASHION_STYLE[
                                                  style.name.toLowerCase()
                                              ]
                                          } (${style.name.toUpperCase()})`}</span>
                                      </div>
                                  )
                              };
                          })
            });
        }

        return () => {
            // nothing
        };
    }, [mode]);

    const onSelect = (item: {value: any; label: any}, type: ATTRIBUTE_TYPE) => {
        // const imageURL = item.label?.props?.children[0]?.props?.src;
        setImage(null);

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
        imageData.uploadStatus = JSONUploadStatus.NEED_UPLOAD;

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
            // console.log('next = ', updatedHumanInfo, imageData);
            updateImageDataByIdAction(imageData.id, imageData);
        }
        if (mode === LabelModeType.ITEM) {
            // console.log('selectedItems', selectedItems);
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
        // console.log('humanInfo', humanInfo);
        // console.log('itemInfo', itemInfo);
        // console.log('selectedItems', selectedItems);
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
                            setPreview={setImage}
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
                            setPreview={setImage}
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
                            setPreview={setImage}
                            value={selectedItems[ATTRIBUTE_TYPE.FASHION_STYLE]}
                            isMulti={true}
                        />
                    </div>
                </div>
                {image ? (
                    <div className="SampleImage">
                        <img src={image} width={300} height={300} />
                    </div>
                ) : null}
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
                            setPreview={setImage}
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
                            setPreview={setImage}
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
                            setPreview={setImage}
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
                            setPreview={setImage}
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
                            setPreview={setImage}
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
                            setPreview={setImage}
                            value={selectedItems[ATTRIBUTE_TYPE.ITEM_PATTERN]}
                        />
                    </div>
                </div>

                <div className="AttributeContainer">
                    <div className="AttributeName">Styles</div>
                    <div className="AttributeSelector">
                        <AttributeSelect
                            gender={gender}
                            type={ATTRIBUTE_TYPE.FASHION_STYLE}
                            onSelect={onSelect}
                            setPreview={setImage}
                            value={selectedItems[ATTRIBUTE_TYPE.FASHION_STYLE]}
                            isMulti={true}
                        />
                    </div>
                </div>
                {image ? (
                    <div className="SampleImage">
                        <img src={image} width={230} height={230} />
                    </div>
                ) : null}
            </div>
        );
    };

    return (
        <GenericYesNoPopupDraggable
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
