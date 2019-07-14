import {ExportFormatType} from "../data/ExportFormatType";
import {ImageData, LabelRect} from "../store/editor/types";
import {ImageRepository} from "./ImageRepository";
import {store} from "../index";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import moment from 'moment';

export class RectLabelsExporter {
    public static export(exportFormatType: ExportFormatType): void {
        switch (exportFormatType) {
            case ExportFormatType.YOLO:
                RectLabelsExporter.exportAsYOLO();
                break;
            default:
                return;
        }
    }

    private static exportAsYOLO(): void {
        let zip = new JSZip();
        store.getState().editor.imagesData.forEach((imageData: ImageData) => {
            const fileContent: string = RectLabelsExporter.wrapRectLabelsIntoYOLO(imageData);
            if (fileContent) {
                const fileName : string = imageData.fileData.name.replace(/\.[^/.]+$/, ".txt");
                zip.file(fileName, fileContent);
            }
        });
        const date: string = moment().format('YYYYMMDDhhmmss');
        zip.generateAsync({type:"blob"})
            .then(function(content) {
                saveAs(content, "labels_yolo_" + date + ".zip");
            });
    }

    private static wrapRectLabelsIntoYOLO(imageData: ImageData): string {
        if (imageData.labelRects.length === 0 || !imageData.loadStatus)
            return null;

        const image: HTMLImageElement = ImageRepository.getById(imageData.id);
        const labelRectsString: string[] = imageData.labelRects.map((labelRect: LabelRect) => {
            const labelFields = [
                labelRect.labelIndex + "",
                ((labelRect.rect.x + labelRect.rect.width / 2) / image.width).toFixed(6) + "",
                ((labelRect.rect.y + labelRect.rect.height / 2) / image.height).toFixed(6) + "",
                (labelRect.rect.width / image.width).toFixed(6) + "",
                (labelRect.rect.height / image.height).toFixed(6) + ""
            ];
            return labelFields.join(" ")
        });
        return labelRectsString.join("\n");
    }
}