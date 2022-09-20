import * as React from 'react';
import './AttributeSelect.scss';
import classNames from 'classnames';
import {
    ATTRIBUTE_TYPE,
    FASHION_STYLE,
    FASHION_STYLE_CODE_FOR_MAN,
    FASHION_STYLE_MAN,
    FASHION_STYLE_WOMAN,
    GENDER,
    GENDER_CODE,
    ITEM_CATEGORY,
    ITEM_COLOR,
    ITEM_PATTERN,
    MAIN_CATEGORY_CODE,
    SOURCE,
    SOURCE_CODE,
    SUB_CATEGORY_CODE
} from '../../../data/enums/ItemType';
import Select from 'react-select';
import {LabelsSelector} from '../../../store/selectors/LabelsSelector';
import {vi as lang} from '../../../lang';
import {Settings} from '../../../settings/Settings';
import _ from 'lodash';

interface IProps {
    key?: string;
    type: ATTRIBUTE_TYPE;
    value?: any;
    onSelect: (selectedItem: any, type: ATTRIBUTE_TYPE) => any;
    style?: React.CSSProperties;
    isActive?: boolean;
    isDisabled?: boolean;
    externalClassName?: string;
    mainCategory?: number;
    gender?: number;
    isMulti?: boolean;
    setPreview?: (url: string) => any;
}

export const AttributeSelect = (props: IProps) => {
    const {
        key,
        type,
        value,
        onSelect,
        style,
        isActive,
        isDisabled,
        externalClassName,
        mainCategory,
        gender,
        isMulti,
        setPreview
    } = props;

    const getClassNamesName = () => {
        return classNames('AttributeSelect', externalClassName, {
            active: isActive,
            disabled: isDisabled
        });
    };

    const renderItem = (item: {url: string; title: string}) => {
        const {url, title} = item;
        return (
            <div
                className="IconItem"
                onMouseOver={() => setPreview(url.replace('_s.png', '.png'))}
                onMouseLeave={() => setPreview(null)}>
                <img src={url} width={30} height={30} />
                <span className="ItemTitle">{title}</span>
            </div>
        );
    };

    const renderGenderItem = (gender: number) => {
        const genderCode = GENDER_CODE[gender.toString()];
        const url =
            gender === GENDER.UNKNOWN
                ? Settings.UNKNOWN_URL
                : `guides/icons/genders/${gender}_s.png`;
        return {
            value: gender,
            label: renderItem({
                url,
                title: `${lang.GENDER[genderCode]} (${genderCode})`
            })
        };
    };

    const renderSourceItem = (source: number) => {
        const sourceCode = SOURCE_CODE[source.toString()];
        const url =
            source === SOURCE.UNKNOWN
                ? Settings.UNKNOWN_URL
                : `guides/icons/sources/${source}_s.png`;
        return {
            value: source,
            label: renderItem({
                url,
                title: `${lang.SOURCE[sourceCode]} (${sourceCode})`
            })
        };
    };

    const renderMainCategory = (mainCategory: any) => {
        const index = Object.values(MAIN_CATEGORY_CODE).indexOf(mainCategory);
        const mainCategoryCode = Object.keys(MAIN_CATEGORY_CODE)[index];
        const url =
            mainCategory === MAIN_CATEGORY_CODE.UNKNOWN
                ? Settings.UNKNOWN_URL
                : `guides/icons/main_cats/${mainCategory}_s.png`;
        return {
            value: mainCategory,
            label: renderItem({
                url,
                title: `${lang.MAIN_CATEGORY[mainCategoryCode]} (${mainCategoryCode})`
            })
        };
    };

    const renderSubCategory = (subCategory: any) => {
        const index = Object.values(SUB_CATEGORY_CODE).indexOf(subCategory);
        const subCategoryCode = Object.keys(SUB_CATEGORY_CODE)[index];
        const url =
            subCategory === SUB_CATEGORY_CODE.UNKNOWN
                ? Settings.UNKNOWN_URL
                : `guides/icons/sub_cats/${subCategory}_s.png`;

        return {
            value: subCategory,
            label: renderItem({
                url,
                title: `${lang.SUB_CATEGORY[subCategoryCode]} (${subCategoryCode})`
            })
        };
    };

    const renderColor = (color: any) => {
        const index = Object.values(ITEM_COLOR).indexOf(color);
        const colorCode = Object.keys(ITEM_COLOR)[index];
        const url =
            color === ITEM_COLOR.UNKNOWN
                ? Settings.UNKNOWN_URL
                : `guides/icons/colors/${color}_s.png`;

        return {
            value: color,
            label: renderItem({
                url,
                title: `${lang.ITEM_COLOR[colorCode]} (${colorCode})`
            })
        };
    };

    const renderPattern = (pattern: any) => {
        const index = Object.values(ITEM_PATTERN).indexOf(pattern);
        const patternCode = Object.keys(ITEM_PATTERN)[index];
        const url =
            pattern === ITEM_PATTERN.UNKNOWN
                ? Settings.UNKNOWN_URL
                : `guides/icons/patterns/${pattern}_s.png`;

        return {
            value: pattern,
            label: renderItem({
                url,
                title: `${lang.ITEM_PATTERN[patternCode]} (${patternCode})`
            })
        };
    };

    const renderStyle = (style: any) => {
        const url =
            style.seq === -1
                ? Settings.UNKNOWN_URL
                : gender === GENDER.MAN
                ? `guides/icons/man_style/${style.m}_s.png`
                : `guides/icons/woman_style/${style.f}_s.png`;

        return {
            value: style.name.toUpperCase(),
            label: renderItem({
                url,
                title: `${lang.FASHION_STYLE[style.slug]} (${style.slug})`
            })
        };
    };

    const renderHumanId = (uuid: any) => {
        const imageData = LabelsSelector.getActiveImageData();
        const index = _.findIndex(imageData.humans, {uuid});
        return uuid === '-1'
            ? {value: '-1', label: <div>UNKNOWN</div>}
            : {
                  value: uuid,
                  label: <div>{index.toString()}</div>
              };
    };

    const selectOptions = () => {
        switch (type) {
            case ATTRIBUTE_TYPE.GENDER:
                return Object.values(GENDER).map((gender) =>
                    renderGenderItem(gender)
                );
            case ATTRIBUTE_TYPE.SOURCE:
                return Object.values(SOURCE).map((source) =>
                    renderSourceItem(source)
                );
            case ATTRIBUTE_TYPE.MAIN_CATEGORY:
                return Object.values(MAIN_CATEGORY_CODE)
                    .filter((v) => typeof v === 'number' && v !== -1)
                    .map((value) => renderMainCategory(value));
            case ATTRIBUTE_TYPE.SUB_CATEGORY: {
                const subCategoryCodes =
                    mainCategory > 0
                        ? ITEM_CATEGORY[MAIN_CATEGORY_CODE[mainCategory]]
                        : Object.values(SUB_CATEGORY_CODE).filter(
                              (value) =>
                                  typeof value === 'number' && value !== -1
                          );

                console.log('subCategoryCodes = ', subCategoryCodes);
                return subCategoryCodes.map((subcategory) =>
                    renderSubCategory(subcategory)
                );
            }
            case ATTRIBUTE_TYPE.ITEM_COLOR:
                return Object.values(ITEM_COLOR)
                    .filter((value) => typeof value === 'number')
                    .map((value) => renderColor(value));
            case ATTRIBUTE_TYPE.ITEM_PATTERN:
                return Object.values(ITEM_PATTERN)
                    .filter((value) => typeof value === 'number')
                    .map((value) => renderPattern(value));

            case ATTRIBUTE_TYPE.FASHION_STYLE: {
                console.log('gender = ', gender);
                const styles =
                    gender === GENDER.MAN
                        ? FASHION_STYLE_MAN
                        : FASHION_STYLE_WOMAN;
                return styles.map((style) => renderStyle(style));
            }
            case ATTRIBUTE_TYPE.HUMAN_ID: {
                const imageData = LabelsSelector.getActiveImageData();
                return [
                    ...imageData.humans.map((human) =>
                        renderHumanId(human.uuid)
                    ),
                    {value: '-1', label: <div>UNKNOWN</div>}
                ];
            }
            default:
                return [];
        }
    };

    const options = React.useMemo(
        () => selectOptions(),
        [type, gender, mainCategory]
    );

    const renderValue = (value, type) => {
        switch (type) {
            case ATTRIBUTE_TYPE.GENDER:
                return renderGenderItem(value);
            case ATTRIBUTE_TYPE.SOURCE:
                return renderSourceItem(value);
            case ATTRIBUTE_TYPE.MAIN_CATEGORY:
                return renderMainCategory(value);
            case ATTRIBUTE_TYPE.SUB_CATEGORY:
                return renderSubCategory(value);
            case ATTRIBUTE_TYPE.ITEM_COLOR:
                return renderColor(value);
            case ATTRIBUTE_TYPE.ITEM_PATTERN:
                return renderPattern(value);
            case ATTRIBUTE_TYPE.FASHION_STYLE:
                return value.map((style) => renderStyle(style));
            case ATTRIBUTE_TYPE.HUMAN_ID:
                return renderHumanId(value);
            default:
                return null;
        }
    };

    const handleOnSelect = (selectedItem: any) => {
        switch (type) {
            case ATTRIBUTE_TYPE.FASHION_STYLE:
                onSelect(
                    FASHION_STYLE.filter((style) =>
                        selectedItem
                            .map((item) => item.value)
                            .includes(style.name.toUpperCase())
                    ),
                    type
                );
                return;
            default:
                onSelect(selectedItem.value, type);
        }
    };

    return (
        <div style={{width: '90%'}}>
            <Select
                isDisabled={isDisabled}
                menuPlacement="auto"
                menuPosition="fixed"
                value={renderValue(value, type)}
                isMulti={isMulti}
                options={options}
                onChange={handleOnSelect}
                filterOption={(option, input) => {
                    //@ts-ignore
                    if (typeof option.data.label.props.children == 'string') {
                        //@ts-ignore
                        return option.data.label.props.children
                            .toLowerCase()
                            .includes(input.toLowerCase());
                    } else {
                        //@ts-ignore
                        return option.data.label.props.children[1].props.children
                            .toLowerCase()
                            .includes(input.toLowerCase());
                    }
                }}
            />
        </div>
    );
};
