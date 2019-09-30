import {ExportFormatType} from "../../data/enums/ExportFormatType";
import {ImageData, LabelName, LabelPoint} from "../../store/labels/types";
import {saveAs} from "file-saver";
import {ImageRepository} from "../imageRepository/ImageRepository";
import {LabelsSelector} from "../../store/selectors/LabelsSelector";
import {ExporterUtil} from "../../utils/ExporterUtil";
import {findLast} from "lodash";

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
        const content: string = LabelsSelector.getImagesData()
            .map((imageData: ImageData) => {
                return PointLabelsExporter.wrapRectLabelsIntoCSV(imageData)})
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
        if (imageData.labelPoints.length === 0 || !imageData.loadStatus)
            return null;

        const image: HTMLImageElement = ImageRepository.getById(imageData.id);
        const labelNames: LabelName[] = LabelsSelector.getLabelNames();
        const labelRectsString: string[] = imageData.labelPoints.map((labelPoint: LabelPoint) => {
            const labelName: LabelName = findLast(labelNames, {id: labelPoint.labelId});
            const labelFields = !!labelName ? [
                labelName.name,
                Math.round(labelPoint.point.x) + "",
                Math.round(labelPoint.point.y) + "",
                imageData.fileData.name,
                image.width + "",
                image.height + ""
            ] : [];
            return labelFields.join(",")
        });
        return labelRectsString.join("\n");
    }
}