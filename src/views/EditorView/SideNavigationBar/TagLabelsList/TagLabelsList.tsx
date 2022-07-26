import {ISize} from "../../../../interfaces/ISize";
import {ImageData, LabelName} from "../../../../store/labels/types";
import React from "react";
import Scrollbars from "react-custom-scrollbars-2";
import {updateImageDataById} from "../../../../store/labels/actionCreators";
import {AppState} from "../../../../store";
import {connect} from "react-redux";
import {remove} from "lodash";
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
        if (imageData.labelNameIds.includes(labelId)) {
            updateImageDataById(imageData.id, {
                ...imageData,
                labelNameIds: remove(imageData.labelNameIds, (element: string) => element !== labelId)
            })
        } else {
            updateImageDataById(imageData.id, {
                ...imageData,
                labelNameIds: imageData.labelNameIds.concat(labelId)
            })
        }
    }

    const getClassName = (labelId: string) => {
        return classNames(
            "TagItem",
            {
                "active": imageData.labelNameIds.includes(labelId)
            }
        );
    };

    const addNewOnClick = () => {
        updateActivePopupType(PopupWindowType.UPDATE_LABEL)
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
            key="tag-labels-list"
        >
            {labelNames.length === 0 ?
                <div
                    className="EmptyLabelList"
                    onClick={addNewOnClick}
                    key="empty-label-list"
                >
                    <img
                        draggable={false}
                        alt={"upload"}
                        src={"ico/type-writer.png"}
                    />
                    <p className="extraBold">Your label list is empty</p>
                </div> :
                <Scrollbars>
                    <div
                        className="TagLabelsListContent"
                        style={listStyleContent}
                        key="tag-labels-list-content"
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