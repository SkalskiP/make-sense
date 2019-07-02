import React from 'react';
import './ImagePreview.scss';
import {ISize} from "../../../../interfaces/ISize";
import {ImageData} from "../../../../store/editor/types";
import {ClipLoader} from "react-spinners";
import {Settings} from "../../../../settings/Settings";

interface IProps {
    imageData: ImageData;
    size: ISize;
    style: React.CSSProperties;
    showLoader?: boolean;
    onClick?: () => any;
}

export const ImagePreview: React.FC<IProps> = ({imageData, size, style, showLoader, onClick}) => {
    const getStyle = () => {
        return Object.assign(style, size);
    };

    return(
        <div className="ImagePreview" style={getStyle()}>
            <ClipLoader
                sizeUnit={"px"}
                size={30}
                color={Settings.SECONDARY_COLOR}
                loading={true}
            />
        </div>)
};