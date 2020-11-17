export class VOCAnnotationsExportError extends Error {
    constructor(message) {
        super(message);
        this.name = "VOCAnnotationsExportError";
    }
}