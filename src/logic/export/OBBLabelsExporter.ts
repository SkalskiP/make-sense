import {AnnotationFormatType} from '../../data/enums/AnnotationFormatType';
import {ImageData, LabelName, LabelOBB} from '../../store/labels/types';
import {ImageRepository} from '../imageRepository/ImageRepository';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import {LabelsSelector} from '../../store/selectors/LabelsSelector';
import {ExporterUtil} from '../../utils/ExporterUtil';
import {findIndex} from 'lodash';
import {ISize} from '../../interfaces/ISize';
import {NumberUtil} from '../../utils/NumberUtil';

export class OBBLabelsExporter {
    public static export(exportFormatType: AnnotationFormatType): void {
        switch (exportFormatType) {
            case AnnotationFormatType.YOLO:
                OBBLabelsExporter.exportAsYOLO();
                break;
            default:
                return;
        }
    }

    private static exportAsYOLO(): void {
        const zip = new JSZip();
        
        // Add labels.txt file with label names
        const labelNames: LabelName[] = LabelsSelector.getLabelNames();
        const labelsContent: string = labelNames.map((label: LabelName) => label.name).join('\n');
        try {
            zip.file('labels.txt', labelsContent);
        } catch (error) {
            throw new Error(error as string);
        }
        
        // Add annotation files for each image
        LabelsSelector.getImagesData()
            .forEach((imageData: ImageData) => {
                const fileContent: string = OBBLabelsExporter.wrapOBBLabelsIntoYOLO(imageData);
                if (fileContent) {
                    const fileName : string = imageData.fileData.name.replace(/\.[^/.]+$/, '.txt');
                    try {
                        zip.file(fileName, fileContent);
                    } catch (error) {
                        throw new Error(error as string);
                    }
                }
            });

        try {
            zip.generateAsync({type:'blob'})
                .then((content: Blob) => {
                    saveAs(content, `${ExporterUtil.getExportFileName()}.zip`);
                });
        } catch (error) {
            throw new Error(error as string);
        }
    }

    public static wrapOBBLabelIntoYOLO(labelOBB: LabelOBB, labelNames: LabelName[], imageSize: ISize): string {
        const snapAndFix = (value: number) => NumberUtil.snapValueToRange(value, 0, 1).toFixed(6);
        const classIdx: string = findIndex(labelNames, {id: labelOBB.labelId}).toString();
        
        // YOLO OBB format: class_index x1 y1 x2 y2 x3 y3 x4 y4
        // All coordinates normalized to [0, 1]
        const normalizedCoords: number[] = [];
        
        labelOBB.vertices.forEach((vertex) => {
            normalizedCoords.push(vertex.x / imageSize.width);
            normalizedCoords.push(vertex.y / imageSize.height);
        });
        
        // Snap all coordinates to [0, 1] range
        const processedCoords = normalizedCoords.map((value: number) => snapAndFix(value));
        
        return [classIdx, ...processedCoords].join(' ');
    }

    private static wrapOBBLabelsIntoYOLO(imageData: ImageData): string {
        if (!imageData.labelOBBs || imageData.labelOBBs.length === 0 || !imageData.loadStatus)
            return null;

        const labelNames: LabelName[] = LabelsSelector.getLabelNames();
        const image: HTMLImageElement = ImageRepository.getById(imageData.id);
        const imageSize: ISize = {width: image.width, height: image.height};
        
        const labelOBBsString: string[] = imageData.labelOBBs
            .filter((labelOBB: LabelOBB) => labelOBB.labelId !== null)
            .map((labelOBB: LabelOBB) => {
                return OBBLabelsExporter.wrapOBBLabelIntoYOLO(labelOBB, labelNames, imageSize);
            });
        return labelOBBsString.join('\n');
    }
}
