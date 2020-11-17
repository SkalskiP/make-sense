export class COCOAnnotationsImportError extends Error {
    constructor(message) {
        super(message);
        this.name = "COCOAnnotationsImportError";
    }
}

export class COCOFormatValidationError extends COCOAnnotationsImportError {
    constructor(message) {
        super(message);
        this.name = "COCOFormatValidationError";
    }
}

export class COCOAnnotationReadingError extends COCOAnnotationsImportError {
    constructor() {
        super("Unexpected error occurred during reading annotations from file");
        this.name = "COCOAnnotationReadingError";
    }
}

export class COCOAnnotationDeserializationError extends COCOAnnotationsImportError {
    constructor() {
        super("COCO annotation file need to be in JSON format");
        this.name = "COCOAnnotationDeserializationError";
    }
}

export class COCOAnnotationFileCountError extends COCOAnnotationsImportError {
    constructor() {
        super("COCO annotation requires single file but multiple were given");
        this.name = "COCOAnnotationFileCountError";
    }
}