import {ImageData, LabelName, LabelRect} from '../../../store/labels/types';
import {LabelUtil} from "../../../utils/LabelUtil";
import {AnnotationImporter} from '../AnnotationImporter';
import {LabelsSelector} from '../../../store/selectors/LabelsSelector';

type FileParseResult = {
    filename: string,
    labeledBoxes: LabelRect[]
};

type VOCImportResult = {
    labelNames: Record<string, LabelName>,
    fileParseResults: FileParseResult[],
};

export class DocumentParsingError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = "DocumentParsingError";
    }
}

export class AnnotationAssertionError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = "AnnotationAssertionError";
    }
}

const parser = new DOMParser();

export class VOCImporter extends AnnotationImporter {
    public import(
        filesData: File[],
        onSuccess: (imagesData: ImageData[], labelNames: LabelName[]) => any,
        onFailure: (error?:Error) => any
    ): void {
        try {
            const inputImagesData: Record<string, ImageData> = VOCImporter.mapImageData();

            this.loadAndParseFiles(filesData).then(results => {
                for (const result of results.fileParseResults) {
                    if (inputImagesData[result.filename]) {
                        inputImagesData[result.filename].labelRects = result.labeledBoxes;
                    }
                }

                onSuccess(
                    Array.from(Object.values(inputImagesData)),
                    Array.from(Object.values(results.labelNames))
                );
            }).catch((error: Error) => onFailure(error));
        } catch (error) {
            onFailure(error as Error)
        }
    }

    private loadAndParseFiles(files: File[]): Promise<VOCImportResult> {
        return Promise.all(files.map((file: File) => file.text())).then((fileTexts: string[]) => 
            fileTexts.reduce((current: VOCImportResult, fileText: string, currentIndex: number) => 
            {
                const fileName = files[currentIndex].name;
                try {
                    return VOCImporter.parseDocumentIntoImageData(VOCImporter.tryParseVOCDocument(fileText), current);
                } catch (e) {
                    if (e instanceof DocumentParsingError) {
                        throw new DocumentParsingError(`Failed trying to parse ${fileName} as VOC XML document.`)
                    } else if (e instanceof AnnotationAssertionError) {
                        throw new AnnotationAssertionError(`Failed trying to find required VOC annotations for ${fileName}.`)
                    } else {
                        throw e;
                    }
                }
            }, 
            {
                labelNames: {},
                fileParseResults: [],
            } as VOCImportResult)
            );
    }

    private static tryParseVOCDocument(fileText: string): Document {
        try {
            return parser.parseFromString(fileText, 'application/xml');
        } catch {
            throw new DocumentParsingError();
        }
    }

    protected static parseDocumentIntoImageData(document: Document, { fileParseResults, labelNames }: VOCImportResult): VOCImportResult {
        try {
            const root = document.getElementsByTagName('annotation')[0];
            const filename = root.getElementsByTagName('filename')[0].textContent;
            const [labeledBoxes, newLabelNames] = this.parseAnnotationsFromFileString(document, labelNames);

            return {
                labelNames: newLabelNames,
                fileParseResults: fileParseResults.concat({
                    filename,
                    labeledBoxes
                }),
            };
        } catch {
            throw new AnnotationAssertionError();
        }
    }

    protected static parseAnnotationsFromFileString(document: Document, labelNames: Record<string, LabelName>): 
        [LabelRect[], Record<string, LabelName>] {
        const newLabelNames: Record<string, LabelName> = Object.assign({}, labelNames);
        return [Array.from(document.getElementsByTagName('object')).map(d => {
            const labelName = d.getElementsByTagName('name')[0].textContent;
            const bbox = d.getElementsByTagName('bndbox')[0];
            const xmin = parseInt(bbox.getElementsByTagName('xmin')[0].textContent);
            const xmax = parseInt(bbox.getElementsByTagName('xmax')[0].textContent);
            const ymin = parseInt(bbox.getElementsByTagName('ymin')[0].textContent);
            const ymax = parseInt(bbox.getElementsByTagName('ymax')[0].textContent);
            const rect = {
                x: xmin,
                y: ymin,
                height: ymax - ymin,
                width: xmax - xmin, 
            };
            
            if (!newLabelNames[labelName]) {
                newLabelNames[labelName] = LabelUtil.createLabelName(labelName);
            }
            
            const labelId = newLabelNames[labelName].id;
            return LabelUtil.createLabelRect(labelId, rect);
        }), newLabelNames];
    }

    private static mapImageData(): Record<string, ImageData> {
        return LabelsSelector.getImagesData().reduce(
            (imageDataMap: Record<string, ImageData>, imageData: ImageData) => {
                imageDataMap[imageData.fileData.name] = imageData;
                return imageDataMap;
            }, {}
        );
    }
}
