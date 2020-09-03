import {LabelFormatType} from "../../data/enums/LabelFormatType";
import {LabelsSelector} from "../../store/selectors/LabelsSelector";
import {ImageData, LabelLine, LabelName} from "../../store/labels/types";
import {ExporterUtil} from "../../utils/ExporterUtil";
import {ImageRepository} from "../imageRepository/ImageRepository";
import {findLast} from "lodash";

export class LineLabelsExporter {
    public static export(exportFormatType: LabelFormatType): void {
        switch (exportFormatType) {
            case LabelFormatType.CSV:
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
        const fileName: string = `${ExporterUtil.getExportFileName()}.csv`;
        ExporterUtil.saveAs(content, fileName);
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
                Math.round(labelLine.line.start.x).toString(),
                Math.round(labelLine.line.start.y).toString(),
                Math.round(labelLine.line.end.x).toString(),
                Math.round(labelLine.line.end.y).toString(),
                imageData.fileData.name,
                image.width.toString(),
                image.height.toString()
            ] : [];
            return labelFields.join(",")
        });
        return labelLinesString.join("\n");
    }
}