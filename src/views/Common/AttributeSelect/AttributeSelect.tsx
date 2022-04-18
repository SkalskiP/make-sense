import * as React from 'react';
import './AttributeSelect.scss';
import classNames from 'classnames';
import {
    ATTRIBUTE_TYPE,
    GENDER,
    ITEM_CATEGORY,
    ITEM_COLOR,
    ITEM_PATTERN,
    MAIN_CATEGORY_CODE,
    SUB_CATEGORY_CODE
} from '../../../data/enums/ItemType';
import Select from 'react-select';

interface IProps {
    key?: string;
    type: ATTRIBUTE_TYPE;
    onSelect: (code: number, type: ATTRIBUTE_TYPE) => any;
    style?: React.CSSProperties;
    isActive?: boolean;
    isDisabled?: boolean;
    externalClassName?: string;
    mainCategory?: number;
}

export const AttributeSelect = (props: IProps) => {
    const {
        key,
        type,
        onSelect,
        style,
        isActive,
        isDisabled,
        externalClassName
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
            default:
                return [];
        }
    };

    const options = React.useMemo(() => selectOptions(), [type]);

    return (
        <Select
            options={options}
            onChange={({value}) => onSelect(value, type)}
        />
    );
};
