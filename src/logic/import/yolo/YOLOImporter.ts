import {AnnotationImporter} from '../AnnotationImporter';
import {ImageData, LabelName} from '../../../store/labels/types';
import {FileUtil} from '../../../utils/FileUtil';
import {ArrayUtil} from '../../../utils/ArrayUtil';
import {NoLabelNamesFileProvidedError} from './YOLOErrors';
import {LabelsSelector} from '../../../store/selectors/LabelsSelector';
import {YOLOUtils} from './YOLOUtils';
import {ImageDataUtil} from '../../../utils/ImageDataUtil';
import {zip, find} from 'lodash';
import {ImageRepository} from '../../imageRepository/ImageRepository';

export type YOLOFilesSpec = {
    labelNameFile: File
    annotationFiles: File[]
}

export class YOLOImporter extends AnnotationImporter {
    private static labelsFileName: string = 'labels.txt'

    public import(
        filesData: File[],
        onSuccess: (imagesData: ImageData[], labelNames: LabelName[]) => any,
        onFailure: (error?:Error) => any
    ): void {
        try {
            const sourceImagesData = LabelsSelector.getImagesData()
                .map((i: ImageData) => ImageDataUtil.cleanAnnotations(i));
            const {labelNameFile, annotationFiles} = YOLOImporter.filterFilesData(filesData, sourceImagesData);
            const [relevantImageData, relevantAnnotations] = YOLOImporter
                .matchImagesWithAnnotations(sourceImagesData, annotationFiles);
            const labelNamesPromise: Promise<LabelName[]> = FileUtil.readFile(labelNameFile)
                .then((fileContent: string) => YOLOUtils.parseLabelsNamesFromString(fileContent));
            const missingImagesPromise: Promise<void> = ImageDataUtil.loadMissingImages(relevantImageData);
            const annotationFilesPromise: Promise<string[]> = FileUtil.readFiles(relevantAnnotations);
            Promise
                .all([labelNamesPromise, missingImagesPromise, annotationFilesPromise])
                .then((values: [LabelName[], void, string[]]) => {
                    const [labelNames, , annotationsRaw] = values;
                    const resultImageData = zip<ImageData, string>(relevantImageData, annotationsRaw)
                        .map((pair: [ImageData, string]) => YOLOImporter.applyAnnotations(pair[0], pair[1], labelNames))
                    onSuccess(YOLOImporter.injectImageDataWithAnnotations(sourceImagesData, resultImageData), labelNames);
                })
                .catch((error: Error) => onFailure(error))
        } catch (error) {
            onFailure(error as Error)
        }
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

    public static matchImagesWithAnnotations(images: ImageData[], annotations: File[]): [ImageData[], File[]] {
        const predicate = (image: ImageData, annotation:  File) => {
            return FileUtil.extractFileName(image.fileData.name) === FileUtil.extractFileName(annotation.name)
        }
        return ArrayUtil.unzip(
            ArrayUtil.match<ImageData, File>(images, annotations, predicate)
        );
    }

    public static applyAnnotations(imageData: ImageData, rawAnnotations: string, labelNames: LabelName[]): ImageData {
        const image: HTMLImageElement = ImageRepository.getById(imageData.id);
        imageData.labelRects = YOLOUtils.parseYOLOAnnotationsFromString(
            rawAnnotations,
            labelNames,
            {width: image.width, height: image.height},
            imageData.fileData.name
        );
        return imageData;
    }

    public static injectImageDataWithAnnotations(sourceImageData: ImageData[], annotatedImageData: ImageData[]): ImageData[] {
        return sourceImageData.map((i: ImageData) => {
            const result = find(annotatedImageData, {id: i.id});
            return result ? result : i;
        })
    }
}
