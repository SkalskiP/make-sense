import React, {useState} from "react";
import {PopupActions} from "../../../logic/actions/PopupActions";
import {GenericYesNoPopup} from "../GenericYesNoPopup/GenericYesNoPopup";
import {ObjectDetector} from "../../../ai/ObjectDetector";
import './LoadModelPopup.scss'
import {Settings} from "../../../settings/Settings";
import {ClipLoader} from "react-spinners";

export const LoadModelPopup: React.FC = () => {
    const [modelIsLoadingStatus, setModelIsLoadingStatus] = useState(false);

    const onAccept = () => {
        setModelIsLoadingStatus(true);
        ObjectDetector.loadModel(() => {
            PopupActions.close();
        });
    };

    const onReject = () => {
        PopupActions.close();
    };

    const renderContent = () => {
        return <div className="LoadModelPopupContent">
            <div className="Message">
                To speed up your work, you can use our AI, which will try to mark objects on your images. Don't worry,
                your photos are still safe. To take care of your privacy, we decided not to send your images to the
                server, but instead send our AI to you. When accepting, make sure that you have a fast and stable
                connection - it may take a few minutes to load the model.
            </div>
            <div className="Companion">
                {modelIsLoadingStatus ?
                    <ClipLoader
                        sizeUnit={"px"}
                        size={40}
                        color={Settings.SECONDARY_COLOR}
                        loading={true}
                    /> :
                    <img
                        draggable={false}
                        alt={"robot"}
                        src={"img/robot.png"}
                    />
                }
            </div>
        </div>
    };

    return(
        <GenericYesNoPopup
            title={"Say hello to AI"}
            renderContent={renderContent}
            acceptLabel={"Use model!"}
            onAccept={onAccept}
            disableAcceptButton={modelIsLoadingStatus}
            rejectLabel={"I'm going on my own"}
            onReject={onReject}
            disableRejectButton={modelIsLoadingStatus}
        />
    );
};