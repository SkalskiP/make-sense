export class YOLOAnnotationsLoadingError extends Error {
    constructor(message) {
        super(message);
        this.name = 'YOLOAnnotationsLoadingError';
    }
}

export class YOLOLabelsReadingError extends YOLOAnnotationsLoadingError {
    constructor() {
        super('Unexpected error occurred during reading label names from labels.txt file');
        this.name = 'YOLOLabelsLoadingError';
    }
}

export class NoLabelNamesFileProvidedError extends YOLOAnnotationsLoadingError {
    constructor() {
        super('For YOLO labels to be loaded correctly, labels.txt file is required');
        this.name = 'NoLabelNamesFileProvidedError';
    }
}

export class LabelNamesNotUniqueError extends YOLOAnnotationsLoadingError {
    constructor() {
        super('Label names listed in labels.txt file should be unique');
        this.name = 'LabelNamesNotUniqueError';
    }
}

export class AnnotationsParsingError extends YOLOAnnotationsLoadingError {
    constructor(imageName: string) {
        super(`Unexpected error occurred during parsing of ${imageName} annotations file`);
        this.name = 'AnnotationsParsingError';
    }
}