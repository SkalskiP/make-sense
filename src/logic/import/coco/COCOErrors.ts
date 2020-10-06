export class COCOAnnotationsLoadingError extends Error {
    constructor(message) {
        super(message);
        this.name = "COCOAnnotationsLoadingError";
    }
}

export class COCOFormatValidationError extends COCOAnnotationsLoadingError {
    constructor(message) {
        super(message);
        this.name = "COCOFormatValidationError";
    }
}

export class COCOAnnotationReadingError extends COCOAnnotationsLoadingError {
    constructor() {
        super("Unexpected error occurred during reading annotations from file");
        this.name = "COCOAnnotationReadingError";
    }
}

export class COCOAnnotationDeserializationError extends COCOAnnotationsLoadingError {
    constructor() {
        super("COCO annotation file need to be in JSON format");
        this.name = "COCOAnnotationDeserializationError";
    }
}

export class COCOAnnotationFileCountError extends COCOAnnotationsLoadingError {
    constructor() {
        super("COCO annotation requires single file but multiple were given");
        this.name = "COCOAnnotationFileCountError";
    }
}