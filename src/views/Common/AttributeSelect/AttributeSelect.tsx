import * as React from 'react';
import './AttributeSelect.scss';
import classNames from 'classnames';
import {
    ATTRIBUTE_TYPE,
    FASHION_STYLE_CODE_FOR_MAN,
    FASHION_STYLE_MAN,
    FASHION_STYLE_WOMAN,
    GENDER,
    ITEM_CATEGORY,
    ITEM_COLOR,
    ITEM_PATTERN,
    MAIN_CATEGORY_CODE,
    SOURCE,
    SUB_CATEGORY_CODE
} from '../../../data/enums/ItemType';
import Select from 'react-select';
import {LabelsSelector} from '../../../store/selectors/LabelsSelector';
import {vi as lang} from '../../../lang';
import {Settings} from '../../../settings/Settings';

interface IProps {
    key?: string;
    type: ATTRIBUTE_TYPE;
    value?: any;
    onSelect: (
        selectedItem: {value: any; label: string},
        type: ATTRIBUTE_TYPE
    ) => any;
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

    const getClassName = () => {
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

    const selectOptions = () => {
        switch (type) {
            case ATTRIBUTE_TYPE.GENDER:
                return Object.keys(GENDER).map((key) => {
                    const url =
                        GENDER[key] === GENDER.UNKNOWN
                            ? Settings.UNKNOWN_URL
                            : `guides/icons/genders/${GENDER[key]}_s.png`;
                    return {
                        value: GENDER[key],
                        // label: `${lang.GENDER[key]} (${key})`
                        label: renderItem({
                            url,
                            title: `${lang.GENDER[key]} (${key})`
                        })
                    };
                });
            case ATTRIBUTE_TYPE.SOURCE:
                return Object.keys(SOURCE).map((key) => {
                    const url =
                        SOURCE[key] === SOURCE.UNKNOWN
                            ? Settings.UNKNOWN_URL
                            : `guides/icons/sources/${SOURCE[key]}_s.png`;
                    return {
                        value: SOURCE[key],
                        // label: `${lang.SOURCE[key]} (${key})`
                        label: renderItem({
                            url,
                            title: `${lang.SOURCE[key]} (${key})`
                        })
                    };
                });
            case ATTRIBUTE_TYPE.MAIN_CATEGORY:
                return Object.values(MAIN_CATEGORY_CODE)
                    .filter((value) => typeof value === 'string')
                    .map((key) => {
                        const url =
                            MAIN_CATEGORY_CODE[key] ===
                            MAIN_CATEGORY_CODE.UNKNOWN
                                ? Settings.UNKNOWN_URL
                                : `guides/icons/main_cats/${MAIN_CATEGORY_CODE[key]}_s.png`;

                        return {
                            value: MAIN_CATEGORY_CODE[key],
                            // label: `${lang.MAIN_CATEGORY[key]} (${key})`
                            label: renderItem({
                                url,
                                title: `${lang.MAIN_CATEGORY[key]} (${key})`
                            })
                        };
                    });
            case ATTRIBUTE_TYPE.SUB_CATEGORY: {
                let keys = Object.values(SUB_CATEGORY_CODE).filter(
                    (value) => typeof value === 'string'
                );
                // console.log('mainCategory = ', mainCategory);
                if (mainCategory !== MAIN_CATEGORY_CODE.UNKNOWN) {
                    const subCategoryCodes =
                        ITEM_CATEGORY[MAIN_CATEGORY_CODE[mainCategory]];
                    keys = keys.filter((key) =>
                        subCategoryCodes?.includes(SUB_CATEGORY_CODE[key])
                    );
                }
                return keys.map((key) => {
                    const url =
                        SUB_CATEGORY_CODE[key] === SUB_CATEGORY_CODE.UNKNOWN
                            ? Settings.UNKNOWN_URL
                            : `guides/icons/sub_cats/${SUB_CATEGORY_CODE[key]}_s.png`;

                    return {
                        value: SUB_CATEGORY_CODE[key],
                        // label: `${lang.SUB_CATEGORY[key]} (${key})`
                        label: renderItem({
                            url,
                            title: `${lang.SUB_CATEGORY[key]} (${key})`
                        })
                    };
                });
            }
            case ATTRIBUTE_TYPE.ITEM_COLOR:
                return [
                    ...Object.values(ITEM_COLOR)
                        .filter((value) => typeof value === 'string')
                        .map((key) => {
                            const url =
                                ITEM_COLOR[key] === ITEM_COLOR.UNKNOWN
                                    ? Settings.UNKNOWN_URL
                                    : `guides/icons/colors/${ITEM_COLOR[key]}_s.png`;

                            return {
                                value: ITEM_COLOR[key],
                                label: renderItem({
                                    url,
                                    title: `${lang.ITEM_COLOR[key]} (${key})`
                                })
                            };
                        })
                ];
            case ATTRIBUTE_TYPE.ITEM_PATTERN:
                return [
                    ...Object.values(ITEM_PATTERN)
                        .filter((value) => typeof value === 'string')
                        .map((key) => {
                            const url =
                                ITEM_PATTERN[key] === ITEM_PATTERN.UNKNOWN
                                    ? Settings.UNKNOWN_URL
                                    : `guides/icons/patterns/${ITEM_PATTERN[key]}_s.png`;

                            return {
                                value: ITEM_PATTERN[key],
                                label: renderItem({
                                    url,
                                    title: `${lang.ITEM_PATTERN[key]} (${key})`
                                })
                            };
                        })
                ];

            case ATTRIBUTE_TYPE.FASHION_STYLE: {
                console.log('gender = ', gender);
                const styles =
                    gender === GENDER.MAN
                        ? FASHION_STYLE_MAN
                        : FASHION_STYLE_WOMAN;
                return styles.map((style) => {
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
                            title: `${lang.FASHION_STYLE[style.slug]} (${
                                style.slug
                            })`
                        })
                    };
                });
            }
            case ATTRIBUTE_TYPE.HUMAN_ID: {
                const imageData = LabelsSelector.getActiveImageData();
                return [
                    ...imageData.humans.map((human, index) => ({
                        value: human.uuid,
                        label: <div>{index.toString()}</div>
                    })),
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

    return (
        <div style={{width: '90%'}}>
            <Select
                menuPlacement="auto"
                menuPosition="fixed"
                value={value}
                isMulti={isMulti}
                options={options}
                onChange={(selectedItem) => onSelect(selectedItem, type)}
                filterOption={(option, input) => {
                    // console.log('option.data = ', option.data.label.props.length == 1);
                    if (typeof option.data.label.props.children == 'string') {
                        return option.data.label.props.children
                            .toLowerCase()
                            .includes(input.toLowerCase());
                    } else {
                        return option.data.label.props.children[1].props.children
                            .toLowerCase()
                            .includes(input.toLowerCase());
                    }
                }}
            />
        </div>
    );
};
