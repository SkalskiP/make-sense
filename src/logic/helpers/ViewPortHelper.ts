import {EditorData} from "../../data/EditorData";
import {MouseEventUtil} from "../../utils/MouseEventUtil";
import {EventType} from "../../data/enums/EventType";
import {store} from "../../index";
import {updateCustomCursorStyle} from "../../store/general/actionCreators";
import {CustomCursorStyle} from "../../data/enums/CustomCursorStyle";
import {EditorModel} from "../../staticModels/EditorModel";

export class ViewPortHelper {
    public update(data: EditorData): void {
        if (!!data.event) {
            switch (MouseEventUtil.getEventType(data.event)) {
                case EventType.MOUSE_MOVE:
                    this.mouseMoveHandler(data);
                    break;
                case EventType.MOUSE_UP:
                    this.mouseUpHandler(data);
                    break;
                case EventType.MOUSE_DOWN:
                    this.mouseDownHandler(data);
                    break;
                default:
                    break;
            }
        }
    }

    private mouseDownHandler(data: EditorData) {

    }

    private mouseUpHandler(data: EditorData) {

    }

    private mouseMoveHandler(data: EditorData) {
        store.dispatch(updateCustomCursorStyle(CustomCursorStyle.GRAB));
        EditorModel.canvas.style.cursor = "none";
    }
}