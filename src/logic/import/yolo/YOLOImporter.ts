import {AnnotationImporter} from "../AnnotationImporter";
import {ImageData, LabelName} from "../../../store/labels/types";

export class YOLOImporter extends AnnotationImporter {
    public import(
        filesData: File[],
        onSuccess: (imagesData: ImageData[], labelNames: LabelName[]) => any,
        onFailure: (error?:Error) => any
    ): void {
        console.log(filesData);
    }
}