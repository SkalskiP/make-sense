import {Notification} from '../enums/Notification';

export type NotificationContent = {
    header: string;
    description: string;
}

export type ExportFormatDataMap = Record<Notification, NotificationContent>;

export const NotificationsDataMap: ExportFormatDataMap = {
    [Notification.EMPTY_LABEL_NAME_ERROR]: {
        header: 'Empty label name',
        description: "Looks like you didn't assign name to one of your labels. Unfortunately it is mandatory for " +
            'every label to have unique name value. Insert correct name or delete empty label and try again.'
    },
    [Notification.NON_UNIQUE_LABEL_NAMES_ERROR]: {
        header: 'Non unique label names',
        description: 'Looks like not all your label names are unique. Unique names are necessary to guarantee correct' +
            ' data export when you complete your work. Make your names unique and try again.'
    },
    [Notification.MODEL_DOWNLOAD_ERROR]: {
        header: 'Model could not be downloaded',
        description: 'Looks like we ware unable to download tensorflow.js model from external server. Make sure that ' +
            'you are connected to internet and try again.'
    },
    [Notification.MODEL_INFERENCE_ERROR]: {
        header: 'Inference failed',
        description: 'Looks like we were unable to run inference of your image. Please help us improve Make Sense ' +
            'and let us know.'
    },
    [Notification.MODEL_LOAD_ERROR]: {
        header: 'Model could not be loaded',
        description: 'Looks like we ware unable to load your tensorflow.js model from uploaded files. Make sure that ' +
            'you uploaded all model shard files. Please re-upload all model files once again.'
    },
    [Notification.LABELS_FILE_UPLOAD_ERROR]: {
        header: 'Labels file was not uploaded',
        description: 'Looks like you forgot to upload text file containing list of detected classes names. We need ' +
            'it to map YOLOv5 model output to labels. Please re-upload all model files once again.'
    },
    [Notification.ANNOTATION_FILE_PARSE_ERROR]: {
        header: 'Annotation files could not be parsed',
        description: 'The contents of an annotation file is not valid JSON, CSV, or XML. Please fix the files ' +
            'selected to import and try again.',
    },
    [Notification.ANNOTATION_IMPORT_ASSERTION_ERROR]: {
        header: 'Annotation files did not contain valid data',
        description: 'Missing or invalid annotations provided during import. Please fix the files selected ' +
            'to import and try again.',
    },
    [Notification.UNSUPPORTED_INFERENCE_SERVER_MESSAGE]: {
        header: 'Selected inference server is not yet supported',
        description: 'Integration with selected inference server is still under construction. Stay tuned for more ' +
            'updates on our GitHub.'
    },
    [Notification.ROBOFLOW_INFERENCE_SERVER_ERROR]: {
        header: 'Roboflow connection failed',
        description: 'Looks like we ware unable to connect to your Roboflow model. Please, make sure that the model ' +
            'specification and Roboflow API key, are correct.'
    }
}
