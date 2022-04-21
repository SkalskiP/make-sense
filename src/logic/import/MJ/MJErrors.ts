export class MJAnnotationsLoadingError extends Error {
    constructor(message) {
        super(message);
        this.name = 'MJAnnotationsLoadingError';
    }
}

export class MJLabelsReadingError extends MJAnnotationsLoadingError {
    constructor() {
        super(
            'Unexpected error occurred during reading label names from labels.txt file'
        );
        this.name = 'MJLabelsLoadingError';
    }
}

export class NoLabelNamesFileProvidedError extends MJAnnotationsLoadingError {
    constructor() {
        super(
            'For MJ labels to be loaded correctly, labels.txt file is required'
        );
        this.name = 'NoLabelNamesFileProvidedError';
    }
}

export class LabelNamesNotUniqueError extends MJAnnotationsLoadingError {
    constructor() {
        super('Label names listed in labels.txt file should be unique');
        this.name = 'LabelNamesNotUniqueError';
    }
}

export class AnnotationsParsingError extends MJAnnotationsLoadingError {
    constructor(imageName: string) {
        super(
            `Unexpected error occurred during parsing of ${imageName} annotations file`
        );
        this.name = 'AnnotationsParsingError';
    }
}
