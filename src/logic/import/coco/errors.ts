export class CocoImportError extends Error {
    constructor(message) {
        super(message);
        this.name = "CocoAnnotationsLoadingError";
    }
}

export class CocoFormatValidationError extends CocoImportError {
    constructor(message) {
        super(message);
        this.name = "CocoFormatValidationError";
    }
}

export class CocoAnnotationReadingError extends CocoImportError {
    constructor() {
        super("Unexpected error occurred during reading annotations from file");
        this.name = "CocoAnnotationDeserializationError";
    }
}

export class CocoAnnotationDeserializationError extends CocoImportError {
    constructor() {
        super("COCO annotation file need to be in JSON format");
        this.name = "CocoAnnotationDeserializationError";
    }
}

export class CocoAnnotationFileCountError extends CocoImportError {
    constructor() {
        super("COCO annotation requires single file but multiple were given");
        this.name = "CocoAnnotationFileCountError";
    }
}