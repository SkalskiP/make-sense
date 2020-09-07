export class YOLOAnnotationsLoadingError extends Error {
    constructor(message) {
        super(message);
        this.name = "YOLOAnnotationsLoadingError";
    }
}

export class YOLOLabelsReadingError extends YOLOAnnotationsLoadingError {
    constructor() {
        super("Unexpected error occurred during reading label names from labels.txt file");
        this.name = "YOLOLabelsLoadingError";
    }
}

export class LabelNamesNotUniqueError extends YOLOAnnotationsLoadingError {
    constructor() {
        super("Label names listed in labels.txt file should be unique");
        this.name = "LabelNamesNotUniqueError";
    }
}