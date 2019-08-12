import {ExportFormatType} from "../../data/ExportFormatType";
import {store} from "../../index";
import {ImageData, LabelPoint} from "../../store/editor/types";
import {saveAs} from "file-saver";
import {ImageRepository} from "../imageRepository/ImageRepository";
import moment from 'moment';
import {ExportUtil} from "../../utils/ExportUtil";

export class PointLabelsExporter {
    public static export(exportFormatType: ExportFormatType): void {
        switch (exportFormatType) {
            case ExportFormatType.CSV:
                PointLabelsExporter.exportAsCSV();
                break;
            default:
                return;
        }
    }

    private static exportAsCSV(): void {
        const content: string = store.getState().editor.imagesData
            .map((imageData: ImageData) => {
                return PointLabelsExporter.wrapRectLabelsIntoCSV(imageData)})
            .filter((imageLabelData: string) => {
                return !!imageLabelData})
            .join("\n");

        const projectName: string = ExportUtil.getProjectName();
        const date: string = moment().format('YYYYMMDDhhmmss');
        const blob = new Blob([content], {type: "text/plain;charset=utf-8"});
        try {
            saveAs(blob, `labels_${projectName}_${date}.csv`);
        } catch (error) {
            // TODO
            throw new Error(error);
        }
    }

    private static wrapRectLabelsIntoCSV(imageData: ImageData): string {
        if (imageData.labelRects.length === 0 || !imageData.loadStatus)
            return null;

        const image: HTMLImageElement = ImageRepository.getById(imageData.id);
        const labelNamesList: string[] = store.getState().editor.labelNames;
        const labelRectsString: string[] = imageData.labelPoints.map((labelPoint: LabelPoint) => {
            const labelFields = [
                labelNamesList[labelPoint.labelIndex],
                Math.round(labelPoint.point.x) + "",
                Math.round(labelPoint.point.y) + "",
                imageData.fileData.name,
                image.width + "",
                image.height + ""
            ];
            return labelFields.join(",")
        });
        return labelRectsString.join("\n");
    }
}