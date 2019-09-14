import {EditorSelector} from "../../store/selectors/EditorSelector";
import {ImageData, LabelPoint, LabelPolygon, LabelRect} from "../../store/editor/types";
import * as _ from "lodash";
import {store} from "../../index";
import {updateImageDataById} from "../../store/editor/actionCreators";

export class LabelActions {
    public static deleteActiveLabel() {
        const activeImageData: ImageData = EditorSelector.getActiveImageData();
        const activeLabelId: string = EditorSelector.getActiveLabelId();
        LabelActions.deleteImageLabelById(activeImageData.id, activeLabelId);
    }

    public static deleteImageLabelById(imageId: string, labelId: string) {
        LabelActions.deleteRectLabelById(imageId, labelId);
        LabelActions.deletePointLabelById(imageId, labelId);
        LabelActions.deletePolygonLabelById(imageId, labelId);
    }

    public static deleteRectLabelById(imageId: string, labelRectId: string) {
        const imageData: ImageData = EditorSelector.getImageDataById(imageId);
        const newImageData = {
            ...imageData,
            labelRects: _.filter(imageData.labelRects, (currentLabel: LabelRect) => {
                return currentLabel.id !== labelRectId;
            })
        };
        store.dispatch(updateImageDataById(imageData.id, newImageData));
    }

    public static deletePointLabelById(imageId: string, labelPointId: string) {
        const imageData: ImageData = EditorSelector.getImageDataById(imageId);
        const newImageData = {
            ...imageData,
            labelPoints: _.filter(imageData.labelPoints, (currentLabel: LabelPoint) => {
                return currentLabel.id !== labelPointId;
            })
        };
        updateImageDataById(imageData.id, newImageData);
    }

    public static deletePolygonLabelById(imageId: string, labelPolygonId: string) {
        const imageData: ImageData = EditorSelector.getImageDataById(imageId);
        const newImageData = {
            ...imageData,
            labelPolygons: _.filter(imageData.labelPolygons, (currentLabel: LabelPolygon) => {
                return currentLabel.id !== labelPolygonId;
            })
        };
        updateImageDataById(imageData.id, newImageData);
    }
}