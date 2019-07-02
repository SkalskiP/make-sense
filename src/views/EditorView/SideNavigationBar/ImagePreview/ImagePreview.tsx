import React from 'react';
import './ImagePreview.scss';
import {ISize} from "../../../../interfaces/ISize";

interface IProps {
    size: ISize;
    style: React.CSSProperties;
}

export const ImagePreview: React.FC<IProps> = ({size, style, children}) => {
    const getStyle = () => {
        return Object.assign(style, size);
    };

    return(
        <div className="ImagePreview" style={getStyle()}>
            {children}
        </div>)
};