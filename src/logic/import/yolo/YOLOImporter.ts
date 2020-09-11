import {AnnotationImporter} from "../AnnotationImporter";
import {ImageData, LabelName} from "../../../store/labels/types";
import {FileUtil} from "../../../utils/FileUtil";
import {ArrayUtil, PartitionResult} from "../../../utils/ArrayUtil";
import {NoLabelNamesFileProvidedError} from "./YOLOErrors";
import {LabelsSelector} from "../../../store/selectors/LabelsSelector";
import {YOLOUtils} from "./YOLOUtils";
import {ImageRepository} from "../../imageRepository/ImageRepository";
import {ImageDataUtil} from "../../../utils/ImageDataUtil";

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
        const imagesData: ImageData[] = LabelsSelector.getImagesData();
        const {labelNameFile, annotationFiles} = YOLOImporter.filterFilesData(filesData, imagesData);
        const missingImages: ImageData[] = YOLOImporter.listImagesStillToBeLoaded(annotationFiles, imagesData);
        const missingImagesFileData: File[] = missingImages.map((i: ImageData) => i.fileData);
        const labelNamesPromise: Promise<LabelName[]> = FileUtil.readFile(labelNameFile)
            .then((fileContent: string) => YOLOUtils.parseLabelsNamesFromString(fileContent));
        const missingImagesPromise: Promise<void> = FileUtil.loadImages(missingImagesFileData)
            .then((images:HTMLImageElement[]) => {
                ImageRepository.storeImages(missingImages.map((i: ImageData) => i.id), images);
            });
        const annotationFilesPromise: Promise<string[]> = FileUtil.readFiles(annotationFiles);
        Promise
            .all([labelNamesPromise, missingImagesPromise, annotationFilesPromise])
            .then((values: [LabelName[], void, string[]]) => {
                const labelNames: LabelName[] = values[0];
                const annotationsRaw: string[] = values[2];
                const cleanImageData: ImageData[] = imagesData
                    .map((i: ImageData) => ImageDataUtil.cleanAnnotations(i));
                const imageDataPartition: PartitionResult<ImageData> = YOLOImporter
                    .partitionImageData(cleanImageData, annotationFiles);
                const imageDataWithAnnotation: ImageData[] = ArrayUtil.match<File, ImageData>(
                    annotationFiles,
                    imageDataPartition.pass,
                        (ann: File, image: ImageData) => FileUtil.extractFileName(image.fileData.name) === FileUtil.extractFileName(ann.name)
                    )
                    .map((i: [File, ImageData[]], index: number) => {
                        const annotationFile: File = i[0]
                        const imageData: ImageData = i[1][0];
                        const image: HTMLImageElement = ImageRepository.getById(imageData.id);
                        imageData.labelRects = YOLOUtils.parseYOLOAnnotationsFromString(
                            annotationsRaw[index],
                            labelNames,
                            {width: image.width, height: image.height},
                            annotationFile.name
                        );
                        return imageData;
                    })
                onSuccess(
                    ImageDataUtil.arrange(
                        [...imageDataWithAnnotation, ...imageDataPartition.fail],
                        imagesData.map((item: ImageData) => item.id)
                    ),
                    labelNames
                )
            })
            .catch((error: Error) => onFailure(error));
    }

    public static filterFilesData(filesData: File[], imagesData: ImageData[]): YOLOFilesSpec {
        const functionalityPartitionResult = ArrayUtil.partition(
            filesData,
            (i: File) => i.name === YOLOImporter.labelsFileName
        )
        if (functionalityPartitionResult.pass.length !== 1) {
            throw new NoLabelNamesFileProvidedError()
        }
        const imageIdentifiers: string[] = imagesData
            .map((i: ImageData) => i.fileData.name)
            .map((i: string) => FileUtil.extractFileName(i))
        const matchingPartitionResult = ArrayUtil.partition(
            filesData,
            (i: File) => imageIdentifiers.includes(FileUtil.extractFileName(i.name))
        )
        return {
            labelNameFile: functionalityPartitionResult.pass[0],
            annotationFiles: matchingPartitionResult.pass
        }
    }

    public static listImagesStillToBeLoaded(filesData: File[], imagesData: ImageData[]): ImageData[] {
        const annotationIdentifiers: string[] = filesData.map((i: File) => FileUtil.extractFileName(i.name))
        return imagesData
            .filter((i: ImageData) => !i.loadStatus)
            .filter((i: ImageData) => annotationIdentifiers.includes(FileUtil.extractFileName(i.fileData.name)))
    }

    protected static partitionImageData(items: ImageData[], annotationFiles: File[]): PartitionResult<ImageData> {
        const annotationFileNames: string[] = annotationFiles.map((i: File) => FileUtil.extractFileName(i.name));
        const predicate = (i: ImageData) => annotationFileNames.includes(FileUtil.extractFileName(i.fileData.name));
        return ArrayUtil.partition<ImageData>(items, predicate);
    }
}