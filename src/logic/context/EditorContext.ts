import {HotKeyAction} from "../../data/HotKeyAction";
import {EditorModel} from "../../staticModels/EditorModel";
import {LabelType} from "../../data/enums/LabelType";
import {EditorData} from "../../data/EditorData";
import {EditorActions} from "../actions/EditorActions";
import {PolygonRenderEngine} from "../render/PolygonRenderEngine";
import {BaseContext} from "./BaseContext";
import {PlatformModel} from "../../staticModels/PlatformModel";
import {ImageActions} from "../actions/ImageActions";
import {DisplayActions} from "../actions/DisplayActions";

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
            keyCombo: PlatformModel.isMac ? ["Meta", "ArrowLeft"] : ["Control", "ArrowLeft"],
            action: (event: KeyboardEvent) => {
                ImageActions.getPreviousImage()
            }
        },
        {
            keyCombo: PlatformModel.isMac ? ["Meta", "ArrowRight"] : ["Control", "ArrowRight"],
            action: (event: KeyboardEvent) => {
                ImageActions.getNextImage();
            }
        },
        {
            keyCombo: ["+"],
            action: (event: KeyboardEvent) => {
                DisplayActions.zoomIn();
            }
        },
        {
            keyCombo: ["-"],
            action: (event: KeyboardEvent) => {
                DisplayActions.zoomOut();
            }
        },
    ];
}