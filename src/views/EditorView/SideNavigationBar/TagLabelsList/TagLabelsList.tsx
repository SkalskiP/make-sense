import {ISize} from "../../../../interfaces/ISize";
import {ImageData, LabelName} from "../../../../store/labels/types";
import React from "react";
import EmptyLabelList from "../EmptyLabelList/EmptyLabelList";
import Scrollbars from "react-custom-scrollbars";
import {updateImageDataById} from "../../../../store/labels/actionCreators";
import {AppState} from "../../../../store";
import {connect} from "react-redux";
import './TagLabelsList.scss';
import classNames from "classnames";
import {ImageButton} from "../../../Common/ImageButton/ImageButton";
import {PopupWindowType} from "../../../../data/enums/PopupWindowType";
import {updateActivePopupType} from "../../../../store/general/actionCreators";
interface IProps {
    size: ISize;
    imageData: ImageData;
    updateImageDataById: (id: string, newImageData: ImageData) => any;
    labelNames: LabelName[];
    updateActivePopupType: (activePopupType: PopupWindowType) => any;
}

const TagLabelsList: React.FC<IProps> = (
    {
        size,
        imageData,
        updateImageDataById,
        labelNames,
        updateActivePopupType
    }) => {
    const labelInputFieldHeight = 40;
    const listStyle: React.CSSProperties = {
        width: size.width,
        height: size.height
    };
    const listStyleContent: React.CSSProperties = {
        width: size.width,
        height: imageData.labelPolygons.length * labelInputFieldHeight
    };

    const onTagClick = (labelId: string)  => {
        if (imageData.labelTagId === labelId) {
            updateImageDataById(imageData.id, {
                ...imageData,
                labelTagId: null
            })
        } else {
            updateImageDataById(imageData.id, {
                ...imageData,
                labelTagId: labelId
            })
        }
    }

    const getClassName = (labelId: string) => {
        return classNames(
            "TagItem",
            {
                "active": imageData.labelTagId === labelId
            }
        );
    };

    const addNewOnClick = () => {
        updateActivePopupType(PopupWindowType.UPDATE_LABEL_NAMES)
    }

    const getChildren = () => {
        return [
            ...labelNames.map((labelName: LabelName) => {
                return <div
                    className={getClassName(labelName.id)}
                    onClickCapture={() => onTagClick(labelName.id)}
                    key={labelName.id}
                >
                    {labelName.name}
                </div>
            }),
            <ImageButton
                image={"ico/plus.png"}
                imageAlt={"plus"}
                buttonSize={{width: 32, height: 32}}
                onClick={addNewOnClick}
            />
        ]
    };

    return (
        <div
            className="TagLabelsList"
            style={listStyle}
        >
            {labelNames.length === 0 ?
                <EmptyLabelList
                    labelBefore={"Mark the first polygon"}
                    labelAfter={"No labels created for this image"}
                /> :
                <Scrollbars>
                    <div
                        className="TagLabelsListContent"
                        style={listStyleContent}
                    >
                        {getChildren()}
                    </div>
                </Scrollbars>
            }
        </div>
    );
};

const mapDispatchToProps = {
    updateImageDataById,
    updateActivePopupType
};

const mapStateToProps = (state: AppState) => ({
    labelNames : state.labels.labels
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TagLabelsList);