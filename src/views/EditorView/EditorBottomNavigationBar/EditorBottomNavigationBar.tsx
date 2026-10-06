import React, {useState} from 'react';
import './EditorBottomNavigationBar.scss';
import {ImageData} from "../../../store/labels/types";
import {AppState} from "../../../store";
import {connect} from "react-redux";
import {ISize} from "../../../interfaces/ISize";
import {ContextType} from "../../../data/enums/ContextType";
import classNames from "classnames";
import {ImageActions} from "../../../logic/actions/ImageActions";
import {EditorActions} from "../../../logic/actions/EditorActions";
import {EditorModel} from "../../../staticModels/EditorModel";
import {LabelsSelector} from "../../../store/selectors/LabelsSelector";
import {isReviewedFile} from "../../../logic/projects/learningMarks";
import {countManual, countUnverifiedAI, findNextUnreviewedIndex, requestApproval} from "../../../logic/review/reviewWorkflow";

interface IProps {
    size: ISize;
    imageData: ImageData;
    totalImageCount: number;
    activeImageIndex: number;
    activeContext: ContextType;
}

const EditorBottomNavigationBar: React.FC<IProps> = ({size, imageData, totalImageCount, activeImageIndex, activeContext}) => {
    const minWidth:number = 400;
    const [hidden, setHidden] = useState(EditorModel.areAnnotationsHidden);

    const getImageCounter = () => {
        return (activeImageIndex + 1) + " / " + totalImageCount;
    };

    const getClassName = () => {
        return classNames(
            "EditorBottomNavigationBar",
            {
                "with-context": activeContext === ContextType.EDITOR
            }
        );
    };

    const skipToNextUnreviewed = () => {
        const images = LabelsSelector.getImagesData();
        const next = findNextUnreviewedIndex(
            images.map(im => im.fileData.name), isReviewedFile, activeImageIndex);
        if (next >= 0) ImageActions.getImageByIndex(next);
    };

    const toggleHidden = () => {
        setHidden(EditorActions.toggleAnnotationsHidden());
    };

    const aiCount = countUnverifiedAI(imageData);
    const manualCount = countManual(imageData);

    return (
        <div className={getClassName()}>
            <button className="ImageNavigation" aria-label="Previous image" title="Previous image (Ctrl + Left)"
                disabled={activeImageIndex <= 0} onClick={() => ImageActions.getPreviousImage()}>← Previous</button>
            <span className="ImagePosition">{getImageCounter()}</span>
            {size.width > minWidth ?
                <div className="CurrentImageName" title={imageData.fileData.name}> {imageData.fileData.name} </div> :
                <div className="CurrentImageCount"> {getImageCounter()} </div>
            }
            {(aiCount > 0 || manualCount > 0) &&
                <span className="ObjectCounts" title={`${manualCount} manual, ${aiCount} AI suggestions`}>
                    {manualCount > 0 && <span>{manualCount} verified</span>}
                    {aiCount > 0 && <span>{aiCount} AI</span>}
                </span>}
            <button className="ImageNavigation" aria-label="Hide or show annotations" title="Hide or show annotations (Q)"
                onClick={toggleHidden}>{hidden ? "👁 Show" : "👁 Hide"}</button>
            <button className="ImageNavigation" aria-label="Skip to next unreviewed image" title="Skip to next unreviewed image"
                onClick={skipToNextUnreviewed}>Skip</button>
            <button className="ImageNavigation approve" aria-label="Approve and next image" title="Approve as ground truth and open next unreviewed image (A)"
                onClick={() => requestApproval()}>✓ Approve &amp; Next</button>
            <button className="ImageNavigation" aria-label="Next image" title="Next image (Ctrl + Right)"
                disabled={activeImageIndex >= totalImageCount - 1} onClick={() => ImageActions.getNextImage()}>Next →</button>
        </div>
    );
};

const mapDispatchToProps = {};

const mapStateToProps = (state: AppState) => ({
    activeImageIndex: state.labels.activeImageIndex,
    activeContext: state.general.activeContext
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EditorBottomNavigationBar);
