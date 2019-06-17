import * as React from 'react';
import {ISize} from "../../../interfaces/ISize";
import './ImageButton.scss';

interface Props {
    size:ISize,
    image:string,
    imageAlt:string,
    href:string
    style?:React.CSSProperties
}

export const ImageButton = (props:Props) => {
    let imagePadding:number = 10;

    let buttonStyle:React.CSSProperties = {
        ...props.style,
        width: props.size.width,
        height: props.size.height
    };

    let imageStyle:React.CSSProperties = {
        maxWidth: props.size.width - imagePadding,
        maxHeight: props.size.height - imagePadding
    };
    
    return(
        <div className="ImageButton" style={buttonStyle}>
            <a href={props.href} style={imageStyle}>
                <img alt={props.imageAlt} src={props.image} style={imageStyle}/>
            </a>
        </div>
    );
};