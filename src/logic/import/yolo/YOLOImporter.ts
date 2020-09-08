import {AnnotationImporter} from "../AnnotationImporter";
import {ImageData, LabelName} from "../../../store/labels/types";
import {FileUtil} from "../../../utils/FileUtil";
// import {YOLOUtils} from "./utils";
import {ArrayUtil} from "../../../utils/ArrayUtil";
import {NoLabelNamesFileProvidedError} from "./YOLOErrors";
import {LabelsSelector} from "../../../store/selectors/LabelsSelector";

export type YOLOFilesSpec = {
    labelNameFile: File
    annotationFiles: File[]
}

export class YOLOImporter extends AnnotationImporter {
    private static labelsFileName: string = "labels.txt"

    public import(
        filesData: File[],
        onSuccess: (imagesData: ImageData[], labelNames: LabelName[]) => any,
        onFailure: (error?:Error) => any
    ): void {
        try {
            const imagesData: ImageData[] = LabelsSelector.getImagesData();
            const {labelNameFile, annotationFiles} = YOLOImporter.filterFilesData(filesData, imagesData);
            FileUtil.readFile(labelNameFile).then((fileContent: string) => {
                // const labelNames: LabelName[] = YOLOUtils.parseLabelsNamesFromString(fileContent);
                FileUtil.readFiles(annotationFiles).then((items: string[]) => {

                })
            });
        } catch (error) {
            onFailure(error);
        }
    }

    public static filterFilesData(filesData: File[], imagesData: ImageData[]): YOLOFilesSpec {
        const functionalityPartitionResult = ArrayUtil.partition(
            filesData,
            (item: File) => item.name === YOLOImporter.labelsFileName
        )
        if (functionalityPartitionResult.pass.length !== 1) {
            throw new NoLabelNamesFileProvidedError()
        }
        const imageIdentifiers: string[] = imagesData
            .map((imageData: ImageData) => imageData.fileData.name)
            .map((name: string) => FileUtil.extractFileName(name))
        const matchingPartitionResult = ArrayUtil.partition(
            filesData,
            (item: File) => imageIdentifiers.includes(FileUtil.extractFileName(item.name))
        )
        return {
            labelNameFile: functionalityPartitionResult.pass[0],
            annotationFiles: matchingPartitionResult.pass
        }
    }
}