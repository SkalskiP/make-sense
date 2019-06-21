import * as React from 'react';
import './TextButton.scss';
import classNames from "classnames";
import {Link} from "react-router-dom";

interface IProps {
    key?:string;
    label:string;
    onClick?:() => any;
    style?:React.CSSProperties;
    rout?:string,
    isActive?:boolean;
}

export const TextButton = (props:IProps) => {

    const { key, label, onClick, style, isActive } = props;

    const getClassName = () => {
        return classNames(
            "TextButton",
            {
                "active": isActive
            }
        );
    };

    return(
        <div
            className={getClassName()}
            onClick={onClick}
            key={key}
            style={style}
        >
            {!props.rout && props.label}
            {!!props.rout && <Link to={props.rout}>
                {props.label}
            </Link>}
        </div>
    )
};