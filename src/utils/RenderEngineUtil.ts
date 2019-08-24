import {EditorData} from "../data/EditorData";
import {RectUtil} from "./RectUtil";
import {store} from "../index";
import {updateCustomcursorStyle} from "../store/general/actionCreators";
import {CustomCursorStyle} from "../data/CustomCursorStyle";

export class RenderEngineUtil {
    public static wrapDefaultCursorStyleInCancel(data: EditorData) {
        if (RectUtil.isPointInside(data.activeImageRectOnCanvas, data.mousePositionOnCanvas)) {
            store.dispatch(updateCustomcursorStyle(CustomCursorStyle.DEFAULT));
        } else {
            store.dispatch(updateCustomcursorStyle(CustomCursorStyle.CANCEL));
        }
    }
}