import { IconButton } from "@mui/material";
import { IconTrashX } from "@tabler/icons-react";
import classNames from "classnames";
import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import { ClipLoader } from "react-spinners";
import { IRect } from "~/interfaces/IRect";
import { ISize } from "~/interfaces/ISize";
import { CSSHelper } from "~/logic/helpers/CSSHelper";
import { ImageLoadManager } from "~/logic/imageRepository/ImageLoadManager";
import { ImageRepository } from "~/logic/imageRepository/ImageRepository";
import { updateImageDataById } from "~/store/labels/actionCreators";
import { ImageData } from "~/store/labels/types";
import { FileUtil } from "~/utils/FileUtil";
import { RectUtil } from "~/utils/RectUtil";
import './ImagePreview.scss';

interface IProps {
    imageData: ImageData;
    style: React.CSSProperties;
    size: ISize;
    isScrolling?: boolean;
    isChecked?: boolean;
    onClick?: () => unknown;
    isSelected?: boolean;
    updateImageDataById: (id: string, newImageData: ImageData) => any;
}

const ImagePreview: React.FC<IProps> = (props) => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const saveLoadedImage = (img: HTMLImageElement, imageData: any) => {
        imageData.loadStatus = true;
        props.updateImageDataById(imageData.id, imageData);
        ImageRepository.storeImage(imageData.id, img);
        if (imageData.id === props.imageData.id) {
            setImage(img);
            setIsLoading(false);
        }
    };

    const getStyle = () => {
        const {size} = props;

        const containerRect: IRect = {
            x: 0.15 * size.width,
            y: 0.15 * size.height,
            width: 0.7 * size.width,
            height: 0.7 * size.height,
        };

        const imageRect: IRect = {
            x: 0,
            y: 0,
            width: image?.width ?? 0,
            height: image?.height ?? 0,
        };

        const imageRatio = RectUtil.getRatio(imageRect);
        const imagePosition: IRect = RectUtil.fitInsideRectWithRatio(containerRect, imageRatio);

        return {
            width: imagePosition.width,
            height: imagePosition.height,
            left: imagePosition.x,
            top: imagePosition.y,
        };
    };

    const handleLoadImageError = (error: unknown) => {
        if (error instanceof Error) {
            console.error(error);
        }
    };

    const getClassName = () => {
        return classNames('ImagePreview', {
            selected: props.isSelected,
        });
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handleDeleteButtonClick = () => {
        ImageRepository.removeImage(props.imageData.id);
    };

    const loadImage = async (imageData: ImageData, isScrolling: boolean) => {
        if (imageData.loadStatus) {
            const i = ImageRepository.getById(imageData.id);
            if (image !== i) {
                setImage(i);
            }
        } else if (!isScrolling || !isLoading) {
            setIsLoading(true);
            const saveLoadedImagePartial = (i: HTMLImageElement) => saveLoadedImage(i, imageData);
            FileUtil.loadImage(imageData.fileData)
                .then((i: HTMLImageElement) => saveLoadedImagePartial(i))
                .catch((error) => handleLoadImageError(error));
        }
    };

    useEffect(() => {
        ImageLoadManager.addAndRun(loadImage(props.imageData, props.isScrolling == true));
    }, []);

    useEffect(() => {
        if (props.imageData.loadStatus) {
            ImageLoadManager.addAndRun(loadImage(props.imageData, props.isScrolling == true));
        } else {
            setImage(null);
        }

        if (props.isScrolling) {
            ImageLoadManager.addAndRun(loadImage(props.imageData, false));
        }
    }, [props.imageData, props.isScrolling]);


    const {
        isChecked,
        style,
        onClick,
    } = props;

    return (
        <div
            className={getClassName()}
            style={style}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div onClick={onClick} style={{width: "100%"}}>
                {image ? (
                    [
                        <div className="Foreground" key={"Foreground"} style={getStyle()}>
                            <img
                                className="Image"
                                draggable={false}
                                src={image.src}
                                alt={image.alt}
                                style={{...getStyle(), left: 0, top: 0}}
                            />
                            {isChecked && (
                                <img
                                    className="CheckBox"
                                    draggable={false}
                                    src={"ico/ok.png"}
                                    alt={"checkbox"}
                                />
                            )}
                        </div>,
                        <div className="Background" key={"Background"} style={getStyle()} />,
                    ]
                ) : (
                    <ClipLoader size={30} color={CSSHelper.getLeadingColor()} loading={true} />
                )}
            </div>
            {isHovered && (
                <div className={classNames('icon', "DeleteButton")}>
                    <IconButton
                        aria-label={'remove Image'}
                        size="small"
                        onClick={handleDeleteButtonClick}
                    >
                        <IconTrashX size={18} />
                    </IconButton>
                </div>
            )}
        </div>
    );
};


const mapDispatchToProps = {
    updateImageDataById
};

const mapStateToProps = (state: any) => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ImagePreview);