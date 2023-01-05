export enum Action {
    // AI
    UPDATE_SUGGESTED_LABEL_LIST = '@@UPDATE_SUGGESTED_LABEL_LIST',
    UPDATE_REJECTED_SUGGESTED_LABEL_LIST = '@@UPDATE_REJECTED_SUGGESTED_LABEL_LIST',
    UPDATE_SSD_OBJECT_DETECTOR_STATUS = '@@UPDATE_SSD_OBJECT_DETECTOR_STATUS',
    UPDATE_YOLO_V5_OBJECT_DETECTOR_STATUS = '@@UPDATE_YOLO_V5_OBJECT_DETECTOR_STATUS',
    UPDATE_POSE_DETECTOR_STATUS = '@@UPDATE_POSE_DETECTOR_STATUS',
    UPDATE_DISABLED_AI_FLAG = '@@UPDATE_DISABLED_AI_FLAG',
    UPDATE_ROBOFLOW_API_DETAILS = '@@UPDATE_ROBOFLOW_API_DETAILS',

    // GENERAL
    UPDATE_PROJECT_DATA = '@@UPDATE_PROJECT_DATA',
    UPDATE_WINDOW_SIZE = '@@UPDATE_WINDOW_SIZE',
    UPDATE_ACTIVE_POPUP_TYPE = '@@UPDATE_ACTIVE_POPUP_TYPE',
    UPDATE_CUSTOM_CURSOR_STYLE = '@@UPDATE_CUSTOM_CURSOR_STYLE',
    UPDATE_CONTEXT = '@@UPDATE_CONTEXT',
    UPDATE_PREVENT_CUSTOM_CURSOR_STATUS = '@@UPDATE_PREVENT_CUSTOM_CURSOR_STATUS',
    UPDATE_IMAGE_DRAG_MODE_STATUS = '@@UPDATE_IMAGE_DRAG_MODE_STATUS',
    UPDATE_CROSS_HAIR_VISIBLE_STATUS = '@@UPDATE_CROSS_HAIR_VISIBLE_STATUS',
    UPDATE_ENABLE_PER_CLASS_COLORATION_STATUS = '@@UPDATE_ENABLE_PER_CLASS_COLORATION_STATUS',
    UPDATE_ZOOM = '@@UPDATE_ZOOM',

    // LABELS
    UPDATE_ACTIVE_IMAGE_INDEX = '@@UPDATE_ACTIVE_IMAGE_INDEX',
    UPDATE_IMAGE_DATA_BY_ID = '@@UPDATE_IMAGE_DATA_BY_ID',
    ADD_IMAGES_DATA = '@@ADD_IMAGES_DATA',
    UPDATE_IMAGES_DATA = '@@UPDATE_IMAGES_DATA',
    UPDATE_ACTIVE_LABEL_NAME_ID = '@@UPDATE_ACTIVE_LABEL_NAME_ID',
    UPDATE_ACTIVE_LABEL_TYPE = '@@UPDATE_ACTIVE_LABEL_TYPE',
    UPDATE_ACTIVE_LABEL_ID = '@@UPDATE_ACTIVE_LABEL_ID',
    UPDATE_HIGHLIGHTED_LABEL_ID = '@@UPDATE_HIGHLIGHTED_LABEL_ID',
    UPDATE_LABEL_NAMES = '@@UPDATE_LABEL_NAMES',
    UPDATE_FIRST_LABEL_CREATED_FLAG = '@@UPDATE_FIRST_LABEL_CREATED_FLAG',

    // NOTIFICATIONS
    SUBMIT_NEW_NOTIFICATION = '@@SUBMIT_NEW_NOTIFICATION',
    DELETE_NOTIFICATION_BY_ID = '@@DELETE_NOTIFICATION_BY_ID'
}
