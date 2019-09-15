import {EditorSelector} from "../../store/selectors/EditorSelector";
import {store} from "../../index";
import {updateActiveImageIndex, updateActiveLabelId} from "../../store/editor/actionCreators";
import {ViewPortActions} from "./ViewPortActions";
import {EditorModel} from "../../staticModels/EditorModel";

export class ImageActions {
    public static getPreviousImage(): void {
        const currentImageIndex: number = EditorSelector.getActiveImageIndex();
        ImageActions.getImageByIndex(currentImageIndex - 1);
    }

    public static getNextImage(): void {
        const currentImageIndex: number = EditorSelector.getActiveImageIndex();
        ImageActions.getImageByIndex(currentImageIndex + 1);
    }

    public static getImageByIndex(index: number): void {
        if (EditorModel.viewPortActionsDisabled) return;

        const imageCount: number = EditorSelector.getImagesData().length;

        if (index < 0 || index > imageCount - 1) {
            return;
        } else {
            ViewPortActions.setZoom(1);
            store.dispatch(updateActiveImageIndex(index));
            store.dispatch(updateActiveLabelId(null));
        }
    }
}