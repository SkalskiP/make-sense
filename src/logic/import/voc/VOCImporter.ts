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
        const parser = new DOMParser();

        return Promise.all(files.map(file => file.text())).then(textFiles => 
            textFiles.reduce((current, fileData) => 
            VOCImporter.parseDocumentIntoImageData(parser.parseFromString(fileData, 'application/xml'), current), 
                {
                    labelNames: {},
                    fileParseResults: [],
                } as VOCImportResult)
            );
    }

    protected static parseDocumentIntoImageData(document: Document, { fileParseResults, labelNames }: VOCImportResult): VOCImportResult {
        const root = document.getElementsByTagName('annotation')[0];
        const filename = root.getElementsByTagName('filename')[0].textContent;
        
        const labeledBoxes: LabelRect[] = this.parseAnnotationsFromFileString(document, labelNames);

        return {
            labelNames,
            fileParseResults: fileParseResults.concat({
                filename,
                labeledBoxes
            }),
        };
    }

    protected static parseAnnotationsFromFileString(document: Document, labelNames: Record<string, LabelName>): LabelRect[] {
        return Array.from(document.getElementsByTagName('object')).map(d => {
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
            
            if (!labelNames[labelName]) {
                labelNames[labelName] = LabelUtil.createLabelName(labelName);
            }
            
            const labelId = labelNames[labelName].id;

            return LabelUtil.createLabelRect(labelId, rect);
        });
    }

    private static mapImageData(): Record<string, ImageData> {
        return LabelsSelector.getImagesData().reduce(
            (c: Record<string, ImageData>, i: ImageData) => {
                c[i.fileData.name] = i;
                return c;
            }, {}
        );
    }
}
