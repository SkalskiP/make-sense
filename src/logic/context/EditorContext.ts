import {HotKeyAction} from "../../data/HotKeyAction";
import {EditorModel} from "../../model/EditorModel";
import {LabelType} from "../../data/LabelType";
import {EditorData} from "../../data/EditorData";
import {EditorActions} from "../actions/EditorActions";
import {PolygonRenderEngine} from "../render/PolygonRenderEngine";
import {EditorSelector} from "../../store/selectors/EditorSelector";
import {store} from "../../index";
import {updateActiveImageIndex, updateZoomPercentage} from "../../store/editor/actionCreators";
import {BaseContext} from "./BaseContext";
import {Settings} from "../../settings/Settings";

export class EditorContext extends BaseContext {
    public static actions: HotKeyAction[] = [
        {
            keyCombo: ["Enter"],
            action: (event: KeyboardEvent) => {
                if (EditorModel.supportRenderingEngine && EditorModel.supportRenderingEngine.labelType === LabelType.POLYGON) {
                    const editorData: EditorData = EditorActions.getEditorData();
                    (EditorModel.supportRenderingEngine as PolygonRenderEngine).addLabelAndFinishCreation(editorData);
                }
                EditorActions.fullRender();
            }
        },
        {
            keyCombo: ["Escape"],
            action: (event: KeyboardEvent) => {
                if (EditorModel.supportRenderingEngine && EditorModel.supportRenderingEngine.labelType === LabelType.POLYGON)
                    (EditorModel.supportRenderingEngine as PolygonRenderEngine).cancelLabelCreation();
                EditorActions.fullRender();
            }
        },
        {
            keyCombo: ["ArrowLeft"],
            action: (event: KeyboardEvent) => {
                EditorContext.getPreviousImage();
            }
        },
        {
            keyCombo: ["ArrowRight"],
            action: (event: KeyboardEvent) => {
                EditorContext.getNextImage();
            }
        },
        {
            keyCombo: ["+"],
            action: (event: KeyboardEvent) => {
                EditorContext.zoomIn();
                EditorActions.fullRender();
            }
        },
        {
            keyCombo: ["-"],
            action: (event: KeyboardEvent) => {
                EditorContext.zoomOut();
                EditorActions.fullRender();
            }
        }
    ];

    private static zoomIn(): void {
        const currentZoomPercentage: number = EditorSelector.getCurrentZoomPercentage();
        const newZoomPercentage: number = Math.min(currentZoomPercentage + Settings.ZOOM_PITCH,
            Settings.MAX_ZOOM_PERCENTAGE);
        store.dispatch(updateZoomPercentage(newZoomPercentage));
    }

    private static zoomOut(): void {
        const currentZoomPercentage: number = EditorSelector.getCurrentZoomPercentage();
        const newZoomPercentage: number = Math.max(currentZoomPercentage - Settings.ZOOM_PITCH,
            Settings.MIN_ZOOM_PERCENTAGE);
        store.dispatch(updateZoomPercentage(newZoomPercentage));
    }

    private static getPreviousImage(): void {
        const currentImageIndex: number = EditorSelector.getActiveImageIndex();
        const previousImageIndex: number = Math.max(0, currentImageIndex - 1);
        store.dispatch(updateActiveImageIndex(previousImageIndex));
    }

    private static getNextImage(): void {
        const currentImageIndex: number = EditorSelector.getActiveImageIndex();
        const imageCount: number = EditorSelector.getImagesData().length;
        const nextImageIndex: number = Math.min(imageCount - 1, currentImageIndex + 1);
        store.dispatch(updateActiveImageIndex(nextImageIndex));
    }
}