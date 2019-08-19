import React from 'react'
import './LoadMoreImagesPopup.scss'
import {AppState} from "../../../store";
import {connect} from "react-redux";
import {addImageData} from "../../../store/editor/actionCreators";
import {GenericYesNoPopup} from "../GenericYesNoPopup/GenericYesNoPopup";
import {PopupWindowType} from "../../../data/PopupWindowType";
import {updateActivePopupType} from "../../../store/general/actionCreators";
import {useDropzone} from "react-dropzone";
import {FileUtil} from "../../../utils/FileUtil";
import {ImageData} from "../../../store/editor/types";

interface IProps {
    updateActivePopupType: (activePopupType: PopupWindowType) => any;
    addImageData: (imageData: ImageData[]) => any;
}

const LoadMoreImagesPopup: React.FC<IProps> = ({updateActivePopupType, addImageData}) => {
    const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
        accept: 'image/jpeg, image/png'
    });

    const onAccept = () => {
        if (acceptedFiles.length > 0) {
            addImageData(acceptedFiles.map((fileData:File) => FileUtil.mapFileDataToImageData(fileData)));
            updateActivePopupType(null);
        }
    };

    const onReject = () => {
        updateActivePopupType(null);
    };

    const getDropZoneContent = () => {
        if (acceptedFiles.length === 0)
            return <>
                <input {...getInputProps()} />
                <img
                    draggable={false}
                    alt={"upload"}
                    src={"img/box-opened.png"}
                />
                <p className="extraBold">Add new images</p>
                <p>or</p>
                <p className="extraBold">Click here to select them</p>
            </>;
        else if (acceptedFiles.length === 1)
            return <>
                <img
                    draggable={false}
                    alt={"uploaded"}
                    src={"img/box-closed.png"}
                />
                <p className="extraBold">1 new image loaded</p>
            </>;
        else
            return <>
                <img
                    draggable={false}
                    key={1}
                    alt={"uploaded"}
                    src={"img/box-closed.png"}
                />
                <p key={2} className="extraBold">{acceptedFiles.length} new images loaded</p>
            </>;
    };

    const renderContent = () => {
        return(<div className="LoadMoreImagesPopupContent">
            <div {...getRootProps({className: 'DropZone'})}>
                {getDropZoneContent()}
            </div>
        </div>);
    };

    return(
        <GenericYesNoPopup
            title={"Load more images"}
            renderContent={renderContent}
            acceptLabel={"Load"}
            disableAcceptButton={acceptedFiles.length < 1}
            onAccept={onAccept}
            rejectLabel={"Cancel"}
            onReject={onReject}
        />
    );
};

const mapDispatchToProps = {
    updateActivePopupType,
    addImageData
};

const mapStateToProps = (state: AppState) => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoadMoreImagesPopup);