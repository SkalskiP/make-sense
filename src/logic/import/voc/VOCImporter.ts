import {ImageData, LabelName, LabelRect} from '../../../store/labels/types';
import {LabelUtil} from "../../../utils/LabelUtil";
import {AnnotationImporter} from '../AnnotationImporter';
import {LabelsSelector} from '../../../store/selectors/LabelsSelector';

export type FileParseResult = {
    filename: string,
    labeledBoxes: LabelRect[]
};
export type VOCImportResult = {
    labelNames: LabelName[],
    fileParseResults: FileParseResult[],
};

export class VOCImporter extends AnnotationImporter {
    public static requiredKeys = ['annotation', 'filename', 'categories'];
    private labelNames: Map<string, LabelName>;

    public import(
        filesData: File[],
        onSuccess: (imagesData: ImageData[], labelNames: LabelName[]) => any,
        onFailure: (error?:Error) => any
    ): void {
        try {
            const inputImagesData: Map<string, ImageData> = VOCImporter.mapImageData();
            this.labelNames = new Map<string, LabelName>();

            Promise.all(this.loadAndParseFiles(filesData)).then(results => {
                for (const result of results) {
                    if (inputImagesData[result.filename]) {
                        inputImagesData[result.filename].labelRects = result.labeledBoxes;
                    }
                }

                onSuccess(
                    Array.from(Object.values(inputImagesData)),
                    Array.from(this.labelNames.values())
                );
            }).catch((error: Error) => onFailure(error));
        } catch (error) {
            onFailure(error as Error)
        }
    }

    private loadAndParseFiles(files: File[]): Promise<FileParseResult>[] {
        const parser = new DOMParser();
        return files.map(fileData => fileData.text().then(text => 
            this.parseDocumentIntoImageData(parser.parseFromString(text, 'application/xml'))
        ));
    }

    private parseDocumentIntoImageData(document: Document): FileParseResult {
        const root = document.getElementsByTagName('annotation')[0];
        const filename = root.getElementsByTagName('filename')[0].textContent;
        
        const labeledBoxes: LabelRect[] = this.parseAnnotationsFromFileString(document);

        return {
            filename,
            labeledBoxes,
        };
    }

    private parseAnnotationsFromFileString(document: Document): LabelRect[] {
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
            
            if (!this.labelNames.has(labelName)) {
                this.labelNames.set(labelName, LabelUtil.createLabelName(labelName));
            }
            
            const labelId = this.labelNames.get(labelName).id;

            return LabelUtil.createLabelRect(labelId, rect);
        });
    }

    private static mapImageData(): Map<string, ImageData> {
        return LabelsSelector.getImagesData().reduce(
            (c: Map<string, ImageData>, i: ImageData) => {
                c[i.fileData.name] = i;
                return c;
            },
            {} as Map<string, ImageData>
        );
    }
}
