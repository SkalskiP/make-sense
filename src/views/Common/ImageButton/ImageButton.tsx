import * as React from 'react';
import {ISize} from "../../../interfaces/ISize";
import './ImageButton.scss';
import classNames from "classnames";
import {LegacyRef} from "react";

export interface ImageButtonProps extends React.HTMLProps<HTMLDivElement> {
    buttonSize:ISize,
    padding?:number;
    image:string,
    imageAlt:string,
    href?:string
    onClick?:() => any;
    style?:React.CSSProperties
    isActive?:boolean;
    isDisabled?:boolean;
    externalClassName?:string;
}

export const ImageButton = React.forwardRef((props: ImageButtonProps, ref: LegacyRef<HTMLDivElement>) => {
    const {buttonSize, padding, image, imageAlt, href, onClick, style, isActive, isDisabled, externalClassName} = props;
    const imagePadding:number = !!padding ? padding : 10;

    const onClickHandler = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
        !!onClick && onClick();
    };

    const buttonStyle:React.CSSProperties = {
        ...style,
        width: buttonSize.width,
        height: buttonSize.height
    };

    const imageStyle:React.CSSProperties = {
        maxWidth: buttonSize.width - imagePadding,
        maxHeight: buttonSize.height - imagePadding
    };

    const getClassName = () => {
        return classNames(
            "ImageButton",
            externalClassName,
            {
                "active": isActive,
                "disabled": isDisabled,
            }
        );
    };
    
    return(
        <div
            className={getClassName()}
            style={buttonStyle}
            onClick={onClickHandler}
            ref={ref}
        >
            {!!href && <a href={href} style={imageStyle} target="_blank" rel="noopener noreferrer">
                <img
                    draggable={false}
                    alt={imageAlt}
                    src={image}
                    style={imageStyle}
                />
            </a>}
            {!href && <img
                draggable={false}
                alt={imageAlt}
                src={image}
                style={imageStyle}
            />}
        </div>
    );
});
