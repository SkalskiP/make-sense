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
                    label: key
                }));
            case ATTRIBUTE_TYPE.SOURCE:
                return Object.keys(SOURCE).map((key) => ({
                    value: SOURCE[key],
                    label: key
                }));
            case ATTRIBUTE_TYPE.MAIN_CATEGORY:
                return Object.values(MAIN_CATEGORY_CODE)
                    .filter((value) => typeof value === 'string')
                    .map((key) => ({
                        value: MAIN_CATEGORY_CODE[key],
                        label: key.toString()
                    }));
            case ATTRIBUTE_TYPE.SUB_CATEGORY:
                return Object.values(SUB_CATEGORY_CODE)
                    .filter((value) => typeof value === 'string')
                    .map((key) => ({
                        value: SUB_CATEGORY_CODE[key],
                        label: key.toString()
                    }));
            case ATTRIBUTE_TYPE.ITEM_COLOR:
                return Object.values(ITEM_COLOR)
                    .filter((value) => typeof value === 'string')
                    .map((key) => ({
                        value: ITEM_COLOR[key],
                        label: key.toString()
                    }));
            case ATTRIBUTE_TYPE.ITEM_PATTERN:
                return Object.values(ITEM_PATTERN)
                    .filter((value) => typeof value === 'string')
                    .map((key) => ({
                        value: ITEM_PATTERN[key],
                        label: key.toString()
                    }));
            case ATTRIBUTE_TYPE.FASHION_STYLE: {
                const styles =
                    gender === GENDER.MAN
                        ? FASHION_STYLE_MAN
                        : FASHION_STYLE_WOMAN;
                return Object.values(styles)
                    .filter((value) => typeof value === 'string')
                    .map((key) => ({
                        value: styles[key],
                        label: key.toString()
                    }));
            }
            default:
                return [];
        }
    };

    const options = React.useMemo(() => selectOptions(), [type, gender]);

    return (
        <Select
            value={value}
            isMulti={isMulti}
            options={options}
            onChange={(selectedItem) => onSelect(selectedItem, type)}
        />
    );
};
