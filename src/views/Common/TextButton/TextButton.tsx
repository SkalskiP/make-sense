import * as React from 'react';
import './TextButton.scss';
import classNames from "classnames";

interface IProps {
    key?:string;
    label:string;
    onClick?:() => any;
    style?:React.CSSProperties;
    isActive?:boolean;
    isDisabled?:boolean;
}

export const TextButton = (props:IProps) => {
    const { key, label, onClick, style, isActive, isDisabled} = props;

    const getClassName = () => {
        return classNames(
            "TextButton",
            {
                "active": isActive,
                "disabled": isDisabled
            }
        );
    };

    return(
        <div
            className={getClassName()}
            onClick={!!onClick ? onClick : undefined}
            key={key}
            style={style}
        >
            {label}
        </div>
    )
};