import {HotKeyAction} from "../../data/HotKeyAction";
import {EditorModel} from "../../model/EditorModel";
import {LabelType} from "../../data/LabelType";
import {EditorData} from "../../data/EditorData";
import {EditorActions} from "../actions/EditorActions";
import {PolygonRenderEngine} from "../render/PolygonRenderEngine";
import {EditorSelector} from "../../store/selectors/EditorSelector";
import {store} from "../../index";
import {updateZoomPercentage} from "../../store/editor/actionCreators";
import {BaseContext} from "./BaseContext";
import {Settings} from "../../settings/Settings";
import {Direction} from "../../data/Direction";

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
            keyCombo: ["Alt", "ArrowLeft"],
            action: (event: KeyboardEvent) => {
                EditorActions.getPreviousImage();
            }
        },
        {
            keyCombo: ["Alt", "ArrowRight"],
            action: (event: KeyboardEvent) => {
                EditorActions.getNextImage();
            }
        },
        {
            keyCombo: ["+"],
            action: (event: KeyboardEvent) => {
                EditorContext.zoomIn();
            }
        },
        {
            keyCombo: ["-"],
            action: (event: KeyboardEvent) => {
                EditorContext.zoomOut();
            }
        },
        {
            keyCombo: ["ArrowLeft"],
            action: (event: KeyboardEvent) => {
                EditorActions.recalculateAfterTranslationAndRender(Direction.LEFT);
            }
        },
        {
            keyCombo: ["ArrowRight"],
            action: (event: KeyboardEvent) => {
                EditorActions.recalculateAfterTranslationAndRender(Direction.RIGHT);
            }
        },
        {
            keyCombo: ["ArrowUp"],
            action: (event: KeyboardEvent) => {
                EditorActions.recalculateAfterTranslationAndRender(Direction.BOTTOM);
            }
        },
        {
            keyCombo: ["ArrowDown"],
            action: (event: KeyboardEvent) => {
                EditorActions.recalculateAfterTranslationAndRender(Direction.TOP);
            }
        },
    ];

    private static zoomIn(): void {
        const currentZoomPercentage: number = EditorSelector.getCurrentZoomPercentage();
        const newZoomPercentage: number = Math.min(currentZoomPercentage + Settings.CANVAS_ZOOM_PERCENTAGE_STEP,
            Settings.MAX_ZOOM_PERCENTAGE);
        store.dispatch(updateZoomPercentage(newZoomPercentage));
        EditorActions.recalculateAlterZoomAndRender();
    }

    private static zoomOut(): void {
        const currentZoomPercentage: number = EditorSelector.getCurrentZoomPercentage();
        const newZoomPercentage: number = Math.max(currentZoomPercentage - Settings.CANVAS_ZOOM_PERCENTAGE_STEP,
            Settings.MIN_ZOOM_PERCENTAGE);
        store.dispatch(updateZoomPercentage(newZoomPercentage));
        EditorActions.recalculateAlterZoomAndRender();
    }
}