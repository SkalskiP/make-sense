import React from 'react';
import {ISize} from "../../../../interfaces/ISize";
import Scrollbars from 'react-custom-scrollbars';
import {ImageData, LabelRect} from "../../../../store/editor/types";
import './RectLabelsList.scss';
import {LabelInputField} from "../LabelInputField/LabelInputField";

interface IProps {
    size: ISize;
    imageData: ImageData;
}

const RectLabelsList: React.FC<IProps> = ({size, imageData}) => {
    const labelInputFieldHeight = 40;
    const listStyle: React.CSSProperties = {
        width: size.width,
        height: size.height
    };
    const listStyleContent: React.CSSProperties = {
        width: size.width,
        height: imageData.labelRects.length * labelInputFieldHeight
    };

    const children =
        imageData.labelRects.map((labelRect: LabelRect) => {
            return <LabelInputField
                size={{
                    width: size.width,
                    height: labelInputFieldHeight
                }}
                isActive={false}
                id={labelRect.id}
                key={labelRect.id}
            />
        });


    return (
        <div
            className="RectLabelsList"
            style={listStyle}
        >
            <Scrollbars>
                <div
                    className="RectLabelsListContent"
                    style={listStyleContent}
                >
                    {children}
                </div>
            </Scrollbars>
        </div>
    );
};

export default RectLabelsList;