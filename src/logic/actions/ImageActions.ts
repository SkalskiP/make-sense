import {EditorSelector} from "../../store/selectors/EditorSelector";
import {store} from "../../index";
import {updateActiveImageIndex} from "../../store/editor/actionCreators";

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
        const imageCount: number = EditorSelector.getImagesData().length;

        if (index < 0 || index > imageCount - 1)
            return;
        else
            store.dispatch(updateActiveImageIndex(index));
    }
}