import * as React from 'react';
import './TagButton.scss';
import classNames from 'classnames';

interface IProps {
    key?: string;
    label: string;
    onClick?: () => any;
    style?: React.CSSProperties;
    isActive?: boolean;
    isDisabled?: boolean;
    externalClassName?: string;
}

export const TagButton = (props: IProps) => {
    const {
        key,
        label,
        onClick,
        style,
        isActive,
        isDisabled,
        externalClassName
    } = props;

    const getClassName = () => {
        return classNames('TagButton', externalClassName, {
            active: isActive,
            disabled: isDisabled
        });
    };

    const onClickHandler = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.stopPropagation();
        if (onClick) {
            onClick();
        }
    };

    return (
        <div
            className={getClassName()}
            onClick={onClickHandler}
            key={key}
            style={style}>
            {label}
        </div>
    );
};
