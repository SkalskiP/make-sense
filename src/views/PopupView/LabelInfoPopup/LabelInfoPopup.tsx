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
    const [selectedItems, setSelectedItems] = useState<any>({});
    const [gender, setGender] = useState<number>();
    const [image, setImage] = useState<string | undefined>();
    const [isFollowHumanSetting, setFollowHumanSetting] = useState(false);

    useEffect(() => {
        if (mode === LabelModeType.HUMAN) {
            const found = _.find(imageData.humans, {uuid: id});
            const foundGender = gender ? gender : found?.gender;
            const genderStyles =
                foundGender === GENDER.MAN
                    ? FASHION_STYLE_MAN
                    : FASHION_STYLE_WOMAN;
            setHumanInfo(found);
            setSelectedItems({
                [ATTRIBUTE_TYPE.SOURCE]: found.type,
                [ATTRIBUTE_TYPE.GENDER]: foundGender,
                [ATTRIBUTE_TYPE.FASHION_STYLE]:
                    found.styles.length > 0
                        ? genderStyles.filter((style) =>
                              found.styles.includes(style.name.toUpperCase())
                          )
                        : genderStyles.filter((style) =>
                              imageData.guideStyles
                                  .map((gs) => parseInt(gs.seq))
                                  .includes(style.seq)
                          )
            });
        } else {
            const found = _.find(imageData.items, {uuid: id});
            setItemInfo(found);
            const foundHuman = imageData.humans.find(
                (human) => human.uuid === found.humanId
            );
            setHumanInfo(foundHuman ? foundHuman : null);
            const foundGender = gender
                ? gender
                : foundHuman?.gender
                ? foundHuman.gender
                : found?.gender;

            const genderStyles =
                foundGender === GENDER.MAN
                    ? FASHION_STYLE_MAN
                    : FASHION_STYLE_WOMAN;

            setSelectedItems({
                [ATTRIBUTE_TYPE.HUMAN_ID]: found.humanId,
                [ATTRIBUTE_TYPE.GENDER]: foundGender,
                [ATTRIBUTE_TYPE.MAIN_CATEGORY]: found.mainCategory,
                [ATTRIBUTE_TYPE.SUB_CATEGORY]: found.subCategory,
                [ATTRIBUTE_TYPE.ITEM_COLOR]: found.color,
                [ATTRIBUTE_TYPE.ITEM_PATTERN]: found.pattern,
                [ATTRIBUTE_TYPE.FASHION_STYLE]:
                    (foundHuman ? foundHuman : found).styles.length > 0
                        ? genderStyles.filter((style) =>
                              found.styles.includes(style.name.toUpperCase())
                          )
                        : genderStyles.filter((style) =>
                              imageData.guideStyles
                                  .map((gs) => parseInt(gs.seq))
                                  .includes(style.seq)
                          )
            });
        }

        return () => {
            // nothing
        };
    }, [mode, gender]);

    useEffect(() => {
        console.log('humanInfo = ', humanInfo);
        setFollowHumanSetting(Boolean(humanInfo));
    }, [humanInfo]);

    const onSelect = (item: any, type: ATTRIBUTE_TYPE) => {
        // const imageURL = item.label?.props?.children[0]?.props?.src;
        setImage(null);

        switch (type) {
            case ATTRIBUTE_TYPE.HUMAN_ID: {
                const human = imageData.humans.find(
                    (human) => human.uuid === item
                );

                let composedGender;
                let selectiveStyles;

                if (item === '-1' || !human) {
                    setHumanInfo(null);
                    composedGender = LabelsSelector.getActiveGender();
                    selectiveStyles = LabelsSelector.getActiveStyles();
                } else {
                    setHumanInfo(human);
                    composedGender = human.gender;
                    selectiveStyles = human.styles;
                }

                const genderStyles =
                    composedGender === GENDER.MAN
                        ? FASHION_STYLE_MAN
                        : FASHION_STYLE_WOMAN;

                const composedStyles =
                    selectiveStyles.length > 0
                        ? genderStyles.filter((style) =>
                              selectiveStyles.includes(style.name.toUpperCase())
                          )
                        : genderStyles.filter((style) =>
                              imageData.guideStyles
                                  .map((gs) => parseInt(gs.seq))
                                  .includes(style.seq)
                          );

                setSelectedItems({
                    ...selectedItems,
                    [type]: item,
                    [ATTRIBUTE_TYPE.GENDER]: composedGender,
                    [ATTRIBUTE_TYPE.FASHION_STYLE]: composedStyles
                });
                break;
            }
            case ATTRIBUTE_TYPE.GENDER: {
                setGender(item);
                setSelectedItems({...selectedItems, [type]: item});
                break;
            }
            case ATTRIBUTE_TYPE.MAIN_CATEGORY: {
                setSelectedItems({
                    ...selectedItems,
                    [ATTRIBUTE_TYPE.MAIN_CATEGORY]: item,
                    [ATTRIBUTE_TYPE.SUB_CATEGORY]: SUB_CATEGORY_CODE.UNKNOWN
                });
                break;
            }
            case ATTRIBUTE_TYPE.SUB_CATEGORY: {
                setSelectedItems({
                    ...selectedItems,
                    [ATTRIBUTE_TYPE.SUB_CATEGORY]: item
                });
                break;
            }
            default: {
                setSelectedItems({...selectedItems, [type]: item});
            }
        }
    };

    const save = () => {
        if (selectedItems[ATTRIBUTE_TYPE.FASHION_STYLE]?.length !== 1) {
            alert(lang.ALERT.SELECT_ONE_STYLE);
            return;
        }
        imageData.uploadStatus = JSONUploadStatus.NEED_UPLOAD;

        if (mode === LabelModeType.HUMAN) {
            const updatedHumanInfo = {
                ...humanInfo,
                gender: selectedItems[ATTRIBUTE_TYPE.GENDER],
                type: selectedItems[ATTRIBUTE_TYPE.SOURCE],
                styles: selectedItems[ATTRIBUTE_TYPE.FASHION_STYLE].map(
                    (style) => style.name.toUpperCase()
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
                humanId: selectedItems[ATTRIBUTE_TYPE.HUMAN_ID],
                gender: selectedItems[ATTRIBUTE_TYPE.GENDER],
                mainCategory: selectedItems[ATTRIBUTE_TYPE.MAIN_CATEGORY],
                subCategory: selectedItems[ATTRIBUTE_TYPE.SUB_CATEGORY],
                color: selectedItems[ATTRIBUTE_TYPE.ITEM_COLOR],
                pattern: selectedItems[ATTRIBUTE_TYPE.ITEM_PATTERN],
                styles: selectedItems[ATTRIBUTE_TYPE.FASHION_STYLE].map(
                    (style) => style.name.toUpperCase()
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
        console.log('follow? ', isFollowHumanSetting);
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
                        <img src={image} width={230} height={230} />
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
                            isDisabled={isFollowHumanSetting}
                            isActive={!isFollowHumanSetting}
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
                            isDisabled={isFollowHumanSetting}
                            isActive={!isFollowHumanSetting}
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
            disableAcceptButton={
                selectedItems[ATTRIBUTE_TYPE.FASHION_STYLE]?.length !== 1
            }
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
