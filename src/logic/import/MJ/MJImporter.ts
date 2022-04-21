import {AnnotationImporter} from '../AnnotationImporter';
import {ImageData, LabelName} from '../../../store/labels/types';
import {FileUtil} from '../../../utils/FileUtil';
import {ArrayUtil} from '../../../utils/ArrayUtil';
import {NoLabelNamesFileProvidedError} from './MJErrors';
import {LabelsSelector} from '../../../store/selectors/LabelsSelector';
import {MJUtils} from './MJUtils';
import {ImageDataUtil} from '../../../utils/ImageDataUtil';
import {zip, find} from 'lodash';
import {ImageRepository} from '../../imageRepository/ImageRepository';

export type MJFilesSpec = {
    labelNameFile: File;
    annotationFiles: File[];
};

export class MJImporter extends AnnotationImporter {
    private static labelsFileName: string = 'labels.txt';

    public import(
        filesData: File[],
        onSuccess: (imagesData: ImageData[], labelNames: LabelName[]) => any,
        onFailure: (error?: Error) => any
    ): void {
        try {
            const sourceImagesData = LabelsSelector.getImagesData().map(
                (i: ImageData) => ImageDataUtil.cleanAnnotations(i)
            );
            const {labelNameFile, annotationFiles} = MJImporter.filterFilesData(
                filesData,
                sourceImagesData
            );
            const [relevantImageData, relevantAnnotations] =
                MJImporter.matchImagesWithAnnotations(
                    sourceImagesData,
                    annotationFiles
                );
            const labelNamesPromise: Promise<LabelName[]> = FileUtil.readFile(
                labelNameFile
            ).then((fileContent: string) =>
                MJUtils.parseLabelsNamesFromString(fileContent)
            );
            const missingImagesPromise: Promise<void> =
                ImageDataUtil.loadMissingImages(relevantImageData);
            const annotationFilesPromise: Promise<string[]> =
                FileUtil.readFiles(relevantAnnotations);
            Promise.all([
                labelNamesPromise,
                missingImagesPromise,
                annotationFilesPromise
            ])
                .then((values: [LabelName[], void, string[]]) => {
                    const [labelNames, , annotationsRaw] = values;
                    const resultImageData = zip<ImageData, string>(
                        relevantImageData,
                        annotationsRaw
                    ).map((pair: [ImageData, string]) =>
                        MJImporter.applyAnnotations(
                            pair[0],
                            pair[1],
                            labelNames
                        )
                    );
                    onSuccess(
                        MJImporter.injectImageDataWithAnnotations(
                            sourceImagesData,
                            resultImageData
                        ),
                        labelNames
                    );
                })
                .catch((error: Error) => onFailure(error));
        } catch (error) {
            onFailure(error as Error);
        }
    }

    public static filterFilesData(
        filesData: File[],
        imagesData: ImageData[]
    ): MJFilesSpec {
        const functionalityPartitionResult = ArrayUtil.partition(
            filesData,
            (i: File) => i.name === MJImporter.labelsFileName
        );
        if (functionalityPartitionResult.pass.length !== 1) {
            throw new NoLabelNamesFileProvidedError();
        }
        const imageIdentifiers: string[] = imagesData
            .map((i: ImageData) => i.fileData.name)
            .map((i: string) => FileUtil.extractFileName(i));
        const matchingPartitionResult = ArrayUtil.partition(
            filesData,
            (i: File) =>
                imageIdentifiers.includes(FileUtil.extractFileName(i.name))
        );
        return {
            labelNameFile: functionalityPartitionResult.pass[0],
            annotationFiles: matchingPartitionResult.pass
        };
    }

    public static matchImagesWithAnnotations(
        images: ImageData[],
        annotations: File[]
    ): [ImageData[], File[]] {
        const predicate = (image: ImageData, annotation: File) => {
            return (
                FileUtil.extractFileName(image.fileData.name) ===
                FileUtil.extractFileName(annotation.name)
            );
        };
        return ArrayUtil.unzip(
            ArrayUtil.match<ImageData, File>(images, annotations, predicate)
        );
    }

    public static applyAnnotations(
        imageData: ImageData,
        rawAnnotations: string,
        labelNames: LabelName[]
    ): ImageData {
        const image: HTMLImageElement = ImageRepository.getById(imageData.id);
        const {labelRects, humans, items} = MJUtils.parseMJAnnotationsFromJSON(
            rawAnnotations,
            labelNames,
            {width: image.width, height: image.height},
            imageData.fileData.name
        );
        imageData.labelRects = labelRects;
        imageData.humans = humans;
        imageData.items = items;

        console.log('imageData = ', imageData);
        return imageData;
    }

    public static injectImageDataWithAnnotations(
        sourceImageData: ImageData[],
        annotatedImageData: ImageData[]
    ): ImageData[] {
        return sourceImageData.map((i: ImageData) => {
            const result = find(annotatedImageData, {id: i.id});
            return !!result ? result : i;
        });
    }
}
