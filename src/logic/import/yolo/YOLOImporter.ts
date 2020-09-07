import {AnnotationImporter} from "../AnnotationImporter";
import {ImageData, LabelName} from "../../../store/labels/types";
import {FileUtil} from "../../../utils/FileUtil";
// import {YOLOUtils} from "./utils";
import {ArrayUtil} from "../../../utils/ArrayUtil";
import {NoLabelNamesFileProvidedError} from "./YOLOErrors";
// import {LabelsSelector} from "../../../store/selectors/LabelsSelector";

export class YOLOImporter extends AnnotationImporter {
    private labelsFileName: string = "labels.txt"

    public import(
        filesData: File[],
        onSuccess: (imagesData: ImageData[], labelNames: LabelName[]) => any,
        onFailure: (error?:Error) => any
    ): void {
        try {
            // const inputImagesData: ImageData[] = LabelsSelector.getImagesData();
            const partitionResult = ArrayUtil.partition(
                filesData,
                (item: File) => item.name === this.labelsFileName
            )
            if (partitionResult.pass.length !== 1) {
                onFailure(new NoLabelNamesFileProvidedError())
            }
            FileUtil.readFile(filesData[0]).then((fileContent: string) => {
                // const labelNames: LabelName[] = YOLOUtils.parseLabelsNamesFromString(fileContent);
                FileUtil.readFiles(partitionResult.fail).then((items: string[]) => {

                })
            });
        } catch (error) {
            onFailure(error);
        }
    }
}