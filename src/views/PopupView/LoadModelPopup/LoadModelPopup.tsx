import React from "react";
import {PopupActions} from "../../../logic/actions/PopupActions";
import {GenericYesNoPopup} from "../GenericYesNoPopup/GenericYesNoPopup";
import {ObjectDetector} from "../../../ai/ObjectDetector";

export const LoadModelPopup: React.FC = () => {

    const onAccept = () => {
        ObjectDetector.loadModel();
        PopupActions.close();
    };

    const onReject = () => {
        PopupActions.close();
    };

    const renderContent = () => {
        return null;
    };

    return(
        <GenericYesNoPopup
            title={"Try our AI"}
            renderContent={renderContent}
            acceptLabel={"Let's go!"}
            onAccept={onAccept}
            rejectLabel={"I'm going on my own"}
            onReject={onReject}
        />
    );
};