import {ExportFormatType} from "../../data/enums/ExportFormatType";
import {LabelsSelector} from "../../store/selectors/LabelsSelector";
import {ImageData, LabelLine, LabelName, LabelPoint} from "../../store/labels/types";
import {saveAs} from "file-saver";
import {ExporterUtil} from "../../utils/ExporterUtil";
import {ImageRepository} from "../imageRepository/ImageRepository";
import {findLast} from "lodash";

export class LineLabelsExporter {
    public static export(exportFormatType: ExportFormatType): void {
        switch (exportFormatType) {
            case ExportFormatType.CSV:
                LineLabelsExporter.exportAsCSV();
                break;
            default:
                return;
        }
    }

    private static exportAsCSV(): void {
        const content: string = LabelsSelector.getImagesData()
            .map((imageData: ImageData) => {
                return LineLabelsExporter.wrapLineLabelsIntoCSV(imageData)})
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

    private static wrapLineLabelsIntoCSV(imageData: ImageData): string {
        if (imageData.labelLines.length === 0 || !imageData.loadStatus)
            return null;

        const image: HTMLImageElement = ImageRepository.getById(imageData.id);
        const labelNames: LabelName[] = LabelsSelector.getLabelNames();
        const labelLinesString: string[] = imageData.labelLines.map((labelLine: LabelLine) => {
            const labelName: LabelName = findLast(labelNames, {id: labelLine.labelId});
            const labelFields = !!labelName ? [
                labelName.name,
                Math.round(labelLine.line.start.x) + "",
                Math.round(labelLine.line.start.y) + "",
                Math.round(labelLine.line.end.x) + "",
                Math.round(labelLine.line.end.y) + "",
                imageData.fileData.name,
                image.width + "",
                image.height + ""
            ] : [];
            return labelFields.join(",")
        });
        return labelLinesString.join("\n");
    }
}