import {EditorData} from "../data/EditorData";
import {RectUtil} from "./RectUtil";
import {store} from "../index";
import {CustomCursorStyle} from "../data/CustomCursorStyle";
import {updateCustomCursorStyle} from "../store/general/actionCreators";

export class RenderEngineUtil {
    public static wrapDefaultCursorStyleInCancel(data: EditorData) {
        if (RectUtil.isPointInside(data.activeImageRectOnCanvas, data.mousePositionOnCanvas)) {
            store.dispatch(updateCustomCursorStyle(CustomCursorStyle.DEFAULT));
        } else {
            store.dispatch(updateCustomCursorStyle(CustomCursorStyle.CANCEL));
        }
    }
}