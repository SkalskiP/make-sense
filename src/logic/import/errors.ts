export class CocoFormatValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "CocoFormatValidationError";
    }
}