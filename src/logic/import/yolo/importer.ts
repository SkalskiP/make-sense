import {AnnotationImporter, ImportResult} from "../AnnotationImporter";
import {ImageData, LabelName} from "../../../store/labels/types";
import {FileUtil} from "../../../utils/FileUtil";
import {YOLOUtils} from "./utils";
import {ArrayUtil} from "../../../utils/ArrayUtil";
import {NoLabelNamesFileProvidedError} from "./errors";
import {LabelsSelector} from "../../../store/selectors/LabelsSelector";

export class YOLOImporter extends AnnotationImporter {
    private labelsFileName: string = "labels.txt"

    public import(
        filesData: File[],
        onSuccess: (imagesData: ImageData[], labelNames: LabelName[]) => any,
        onFailure: (error?:Error) => any
    ): void {
        try {
            const inputImagesData: ImageData[] = LabelsSelector.getImagesData();
            const {imagesData, labelNames} = this.applyLabels(inputImagesData, filesData);
            onSuccess(imagesData, labelNames);
        } catch (error) {
            onFailure(error);
        }
    }

    private applyLabels(imageData: ImageData[], filesData: File[]): ImportResult {
        const partitionResult = ArrayUtil.partition(
            filesData,
            (item: File) => item.name === this.labelsFileName
        )
        if (partitionResult.pass.length !== 1) {
            throw new NoLabelNamesFileProvidedError()
        }
        FileUtil.readFile(filesData[0]).then((fileContent: string) => {
            const labelNames: LabelName[] = YOLOUtils.parseLabelsNamesFromString(fileContent);
            console.log(labelNames);
        });

        return {
            labelNames: [],
            imagesData: []
        }
    }
}