import { EditorData } from "../../data/EditorData";
import { Direction } from "../../data/enums/Direction";
import { LabelType } from "../../data/enums/LabelType";
import { HotKeyAction } from "../../data/HotKeyAction";
import { EditorModel } from "../../staticModels/EditorModel";
import { PlatformUtil } from "../../utils/PlatformUtil";
import { EditorActions } from "../actions/EditorActions";
import { ImageActions } from "../actions/ImageActions";
import { LabelActions } from "../actions/LabelActions";
import { ViewPortActions } from "../actions/ViewPortActions";
import { LineRenderEngine } from "../render/LineRenderEngine";
import { PolygonRenderEngine } from "../render/PolygonRenderEngine";
import { BaseContext } from "./BaseContext";

function getMacKeyCombo(combo: string[], alternate: string[]): string[] {
    return PlatformUtil.isMac(window.navigator.userAgent) ? combo : alternate;
}

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
                if (EditorModel.supportRenderingEngine) {
                    switch (EditorModel.supportRenderingEngine.labelType) {
                        case LabelType.POLYGON:
                            (EditorModel.supportRenderingEngine as PolygonRenderEngine).cancelLabelCreation();
                            break;
                        case LabelType.LINE:
                            (EditorModel.supportRenderingEngine as LineRenderEngine).cancelLabelCreation();
                            break;
                    }
                }
                EditorActions.fullRender();
            }
        },
        {
            keyCombo: getMacKeyCombo(["Alt", "ArrowLeft"], ["Control", "ArrowLeft"]),
            action: (event: KeyboardEvent) => {
                ImageActions.getPreviousImage();
            }
        },
        {
            keyCombo: getMacKeyCombo(["Alt", "ArrowRight"], ["Control", "ArrowRight"]),
            action: (event: KeyboardEvent) => {
                ImageActions.getNextImage();
            }
        },
        {
            keyCombo: getMacKeyCombo(["Alt", "+"], ["Control", "+"]),
            action: (event: KeyboardEvent) => {
                ViewPortActions.zoomIn();
            }
        },
        {
            keyCombo: getMacKeyCombo(["Alt", "-"], ["Control", "-"]),
            action: (event: KeyboardEvent) => {
                ViewPortActions.zoomOut();
            }
        },
        {
            keyCombo: ["ArrowRight"],
            action: (event: KeyboardEvent) => {
                event.preventDefault();
                ViewPortActions.translateViewPortPosition(Direction.RIGHT);
            }
        },
        {
            keyCombo: ["ArrowLeft"],
            action: (event: KeyboardEvent) => {
                event.preventDefault();
                ViewPortActions.translateViewPortPosition(Direction.LEFT);
            }
        },
        {
            keyCombo: ["ArrowUp"],
            action: (event: KeyboardEvent) => {
                event.preventDefault();
                ViewPortActions.translateViewPortPosition(Direction.BOTTOM);
            }
        },
        {
            keyCombo: ["ArrowDown"],
            action: (event: KeyboardEvent) => {
                event.preventDefault();
                ViewPortActions.translateViewPortPosition(Direction.TOP);
            }
        },
        {
            keyCombo: getMacKeyCombo(["Backspace"], ["Delete"]),
            action: (event: KeyboardEvent) => {
                LabelActions.deleteActiveLabel();
            }
        },
        {
            keyCombo: getMacKeyCombo(["Alt", "0"], ["Control", "0"]),
            action: (event: KeyboardEvent) => {
                ImageActions.setActiveLabelOnActiveImage(0);
                EditorActions.fullRender();
            }
        },
        {
            keyCombo: getMacKeyCombo(["Alt", "1"], ["Control", "1"]),
            action: (event: KeyboardEvent) => {
                ImageActions.setActiveLabelOnActiveImage(1);
                EditorActions.fullRender();
            }
        },
        {
            keyCombo: getMacKeyCombo(["Alt", "2"], ["Control", "2"]),
            action: (event: KeyboardEvent) => {
                ImageActions.setActiveLabelOnActiveImage(2);
                EditorActions.fullRender();
            }
        },
        {
            keyCombo: getMacKeyCombo(["Alt", "3"], ["Control", "3"]),
            action: (event: KeyboardEvent) => {
                ImageActions.setActiveLabelOnActiveImage(3);
                EditorActions.fullRender();
            }
        },
        {
            keyCombo: getMacKeyCombo(["Alt", "4"], ["Control", "4"]),
            action: (event: KeyboardEvent) => {
                ImageActions.setActiveLabelOnActiveImage(4);
                EditorActions.fullRender();
            }
        },
        {
            keyCombo: getMacKeyCombo(["Alt", "5"], ["Control", "5"]),
            action: (event: KeyboardEvent) => {
                ImageActions.setActiveLabelOnActiveImage(5);
                EditorActions.fullRender();
            }
        },
        {
            keyCombo: getMacKeyCombo(["Alt", "6"], ["Control", "6"]),
            action: (event: KeyboardEvent) => {
                ImageActions.setActiveLabelOnActiveImage(6);
                EditorActions.fullRender();
            }
        },
        {
            keyCombo: getMacKeyCombo(["Alt", "7"], ["Control", "7"]),
            action: (event: KeyboardEvent) => {
                ImageActions.setActiveLabelOnActiveImage(7);
                EditorActions.fullRender();
            }
        },
        {
            keyCombo: getMacKeyCombo(["Alt", "8"], ["Control", "8"]),
            action: (event: KeyboardEvent) => {
                ImageActions.setActiveLabelOnActiveImage(8);
                EditorActions.fullRender();
            }
        },
        {
            keyCombo: getMacKeyCombo(["Alt", "9"], ["Control", "9"]),
            action: (event: KeyboardEvent) => {
                ImageActions.setActiveLabelOnActiveImage(9);
                EditorActions.fullRender();
            }
        }
    ];
}