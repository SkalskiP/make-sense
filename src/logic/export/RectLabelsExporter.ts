import {ExportFormatType} from "../../data/enums/ExportFormatType";
import {ImageData, LabelName, LabelRect} from "../../store/labels/types";
import {ImageRepository} from "../imageRepository/ImageRepository";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import {LabelsSelector} from "../../store/selectors/LabelsSelector";
import {XMLSanitizerUtil} from "../../utils/XMLSanitizerUtil";
import {ExporterUtil} from "../../utils/ExporterUtil";
import {GeneralSelector} from "../../store/selectors/GeneralSelector";
import {findIndex, findLast} from "lodash";

export class RectLabelsExporter {
    public static export(exportFormatType: ExportFormatType): void {
        switch (exportFormatType) {
            case ExportFormatType.YOLO:
                RectLabelsExporter.exportAsYOLO();
                break;
            case ExportFormatType.VOC:
                RectLabelsExporter.exportAsVOC();
                break;
            case ExportFormatType.CSV:
                RectLabelsExporter.exportAsCSV();
                break;
            default:
                return;
        }
    }

    private static exportAsYOLO(): void {
        let zip = new JSZip();
        LabelsSelector.getImagesData()
            .forEach((imageData: ImageData) => {
                const fileContent: string = RectLabelsExporter.wrapRectLabelsIntoYOLO(imageData);
                if (fileContent) {
                    const fileName : string = imageData.fileData.name.replace(/\.[^/.]+$/, ".txt");
                    try {
                        zip.file(fileName, fileContent);
                    } catch (error) {
                        // TODO
                        throw new Error(error);
                    }
                }
            });

        try {
            zip.generateAsync({type:"blob"})
                .then(function(content) {
                    saveAs(content, `${ExporterUtil.getExportFileName()}.zip`);
                });
        } catch (error) {
            // TODO
            throw new Error(error);
        }

    }

    private static wrapRectLabelsIntoYOLO(imageData: ImageData): string {
        if (imageData.labelRects.length === 0 || !imageData.loadStatus)
            return null;

        const labelNames: LabelName[] = LabelsSelector.getLabelNames();
        const image: HTMLImageElement = ImageRepository.getById(imageData.id);
        const labelRectsString: string[] = imageData.labelRects.map((labelRect: LabelRect) => {
            const labelFields = [
                findIndex(labelNames, {id: labelRect.labelId}).toString(),
                ((labelRect.rect.x + labelRect.rect.width / 2) / image.width).toFixed(6) + "",
                ((labelRect.rect.y + labelRect.rect.height / 2) / image.height).toFixed(6) + "",
                (labelRect.rect.width / image.width).toFixed(6) + "",
                (labelRect.rect.height / image.height).toFixed(6) + ""
            ];
            return labelFields.join(" ")
        });
        return labelRectsString.join("\n");
    }

    private static exportAsVOC(): void {
        let zip = new JSZip();
        LabelsSelector.getImagesData().forEach((imageData: ImageData) => {
                const fileContent: string = RectLabelsExporter.wrapImageIntoVOC(imageData);
                if (fileContent) {
                    const fileName : string = imageData.fileData.name.replace(/\.[^/.]+$/, ".xml");
                    try {
                        zip.file(fileName, fileContent);
                    } catch (error) {
                        // TODO
                        throw new Error(error);
                    }
                }
            });

        try {
            zip.generateAsync({type:"blob"})
                .then(function(content) {
                    saveAs(content, `${ExporterUtil.getExportFileName()}.zip`);
                });
        } catch (error) {
            // TODO
            throw new Error(error);
        }
    }

    private static wrapRectLabelsIntoVOC(imageData: ImageData): string {
        if (imageData.labelRects.length === 0 || !imageData.loadStatus)
            return null;

        const labelNamesList: LabelName[] = LabelsSelector.getLabelNames();
        const labelRectsString: string[] = imageData.labelRects.map((labelRect: LabelRect) => {
            const labelName: LabelName = findLast(labelNamesList, {id: labelRect.labelId});
            const labelFields = !!labelName ? [
                `\t<object>`,
                `\t\t<name>${labelName.name}</name>`,
                `\t\t<pose>Unspecified</pose>`,
                `\t\t<truncated>Unspecified</truncated>`,
                `\t\t<difficult>Unspecified</difficult>`,
                `\t\t<bndbox>`,
                `\t\t\t<xmin>${Math.round(labelRect.rect.x)}</xmin>`,
                `\t\t\t<ymin>${Math.round(labelRect.rect.y)}</ymin>`,
                `\t\t\t<xmax>${Math.round(labelRect.rect.x + labelRect.rect.width)}</xmax>`,
                `\t\t\t<ymax>${Math.round(labelRect.rect.y + labelRect.rect.height)}</ymax>`,
                `\t\t</bndbox>`,
                `\t</object>`
            ] : [];
            return labelFields.join("\n")
        });
        return labelRectsString.join("\n");
    }

    private static wrapImageIntoVOC(imageData: ImageData): string {
        const labels: string = RectLabelsExporter.wrapRectLabelsIntoVOC(imageData);
        const projectName: string = XMLSanitizerUtil.sanitize(GeneralSelector.getProjectName());

        if (labels) {
            const image: HTMLImageElement = ImageRepository.getById(imageData.id);
            return [
                `<annotation>`,
                `\t<folder>${projectName}</folder>`,
                `\t<filename>${imageData.fileData.name}</filename>`,
                `\t<path>/${projectName}/${imageData.fileData.name}</path>`,
                `\t<source>`,
                `\t\t<database>Unspecified</database>`,
                `\t</source>`,
                `\t<size>`,
                `\t\t<width>${image.width}</width>`,
                `\t\t<height>${image.height}</height>`,
                `\t\t<depth>3</depth>`,
                `\t</size>`,
                labels,
                `</annotation>`
            ].join("\n");
        }
        return null;
    }


    private static exportAsCSV(): void {
        const content: string = LabelsSelector.getImagesData()
            .map((imageData: ImageData) => {
                return RectLabelsExporter.wrapRectLabelsIntoCSV(imageData)})
            .filter((imageLabelData: string) => {
                return !!imageLabelData})
            .join("\n");

        const blob = new Blob([content], {type: "text/plain;charset=utf-8"});
        try {
            saveAs(blob, `${ExporterUtil.getExportFileName()}.csv`);
        } catch (error) {
            // TODO
            throw new Error(error);
        }
    }

    private static wrapRectLabelsIntoCSV(imageData: ImageData): string {
        if (imageData.labelRects.length === 0 || !imageData.loadStatus)
            return null;

        const image: HTMLImageElement = ImageRepository.getById(imageData.id);
        const labelNames: LabelName[] = LabelsSelector.getLabelNames();
        const labelRectsString: string[] = imageData.labelRects.map((labelRect: LabelRect) => {
            const labelName: LabelName = findLast(labelNames, {id: labelRect.labelId});
            const labelFields = !!labelName ? [
                labelName.name,
                Math.round(labelRect.rect.x) + "",
                Math.round(labelRect.rect.y) + "",
                Math.round(labelRect.rect.width) + "",
                Math.round(labelRect.rect.height) + "",
                imageData.fileData.name,
                image.width + "",
                image.height + ""
            ] : [];
            return labelFields.join(",")
        });
        return labelRectsString.join("\n");
    }
}