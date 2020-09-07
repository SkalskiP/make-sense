import {AnnotationImporter} from "../AnnotationImporter";
import {ImageData, LabelName} from "../../../store/labels/types";
import {FileUtil} from "../../../utils/FileUtil";
import {YOLOUtils} from "./utils";

export class YOLOImporter extends AnnotationImporter {
    private labelsFileName: string = "labels.txt"

    public import(
        filesData: File[],
        onSuccess: (imagesData: ImageData[], labelNames: LabelName[]) => any,
        onFailure: (error?:Error) => any
    ): void {
        FileUtil.readFile(filesData[0]).then((fileContent: string) => {
            const labelNames: LabelName[] = YOLOUtils.parseLabelsNamesFromString(fileContent);
            console.log(labelNames);
        });
    }
}