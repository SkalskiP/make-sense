import * as React from 'react';
import './AttributeSelect.scss';
import classNames from 'classnames';
import {
    ATTRIBUTE_TYPE,
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
        isMulti
    } = props;

    const getClassName = () => {
        return classNames('AttributeSelect', externalClassName, {
            active: isActive,
            disabled: isDisabled
        });
    };

    const selectOptions = () => {
        switch (type) {
            case ATTRIBUTE_TYPE.GENDER:
                return Object.keys(GENDER).map((key) => ({
                    value: GENDER[key],
                    label: `${lang.GENDER[key]} (${key})`
                }));
            case ATTRIBUTE_TYPE.SOURCE:
                return Object.keys(SOURCE).map((key) => ({
                    value: SOURCE[key],
                    label: `${lang.SOURCE[key]} (${key})`
                }));
            case ATTRIBUTE_TYPE.MAIN_CATEGORY:
                return Object.values(MAIN_CATEGORY_CODE)
                    .filter((value) => typeof value === 'string')
                    .map((key) => ({
                        value: MAIN_CATEGORY_CODE[key],
                        label: `${lang.MAIN_CATEGORY[key]} (${key})`
                    }));
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
                return keys.map((key) => ({
                    value: SUB_CATEGORY_CODE[key],
                    label: `${lang.SUB_CATEGORY[key]} (${key})`
                }));
            }
            case ATTRIBUTE_TYPE.ITEM_COLOR:
                return Object.values(ITEM_COLOR)
                    .filter((value) => typeof value === 'string')
                    .map((key) => ({
                        value: ITEM_COLOR[key],
                        label: `${lang.ITEM_COLOR[key]} (${key})`
                    }));
            case ATTRIBUTE_TYPE.ITEM_PATTERN:
                return Object.values(ITEM_PATTERN)
                    .filter((value) => typeof value === 'string')
                    .map((key) => ({
                        value: ITEM_PATTERN[key],
                        label: `${lang.ITEM_PATTERN[key]} (${key})`
                    }));
            case ATTRIBUTE_TYPE.FASHION_STYLE: {
                const styles =
                    gender === GENDER.MAN
                        ? FASHION_STYLE_MAN
                        : FASHION_STYLE_WOMAN;
                return styles.map((item) => ({
                    value: item.name.toUpperCase(),
                    label: `${lang.FASHION_STYLE[item.slug]} (${item.slug})`
                }));
            }
            case ATTRIBUTE_TYPE.HUMAN_ID: {
                const imageData = LabelsSelector.getActiveImageData();
                return [
                    ...imageData.humans.map((human, index) => ({
                        value: human.uuid,
                        label: index.toString()
                    })),
                    {value: '-1', label: 'UNKNOWN'}
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
            />
        </div>
    );
};
