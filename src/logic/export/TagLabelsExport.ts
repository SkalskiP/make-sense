import {ExportFormatType} from "../../data/enums/ExportFormatType";
import {LabelsSelector} from "../../store/selectors/LabelsSelector";
import {ImageData, LabelName} from "../../store/labels/types";
import {ExporterUtil} from "../../utils/ExporterUtil";
import {ImageRepository} from "../imageRepository/ImageRepository";
import {findLast} from "lodash";

export class TagLabelsExporter {
    public static export(exportFormatType: ExportFormatType): void {
        switch (exportFormatType) {
            case ExportFormatType.CSV:
                TagLabelsExporter.exportAsCSV();
                break;
            default:
                return;
        }
    }

    private static exportAsCSV(): void {
        const content: string = LabelsSelector.getImagesData()
            .map((imageData: ImageData) => {
                return TagLabelsExporter.wrapLineLabelsIntoCSV(imageData)})
            .filter((imageLabelData: string) => {
                return !!imageLabelData})
            .join("\n");
        const fileName: string = `${ExporterUtil.getExportFileName()}.csv`;
        ExporterUtil.saveAs(content, fileName);
    }

    private static wrapLineLabelsIntoCSV(imageData: ImageData): string {
        if (imageData.labelTagId === null || !imageData.loadStatus)
            return null;

        const image: HTMLImageElement = ImageRepository.getById(imageData.id);
        const labelNames: LabelName[] = LabelsSelector.getLabelNames();
        const labelName: LabelName = findLast(labelNames, {id: imageData.labelTagId});
        const labelFields = !!labelName ? [
            labelName.name,
            imageData.fileData.name,
            image.width.toString(),
            image.height.toString()
        ] : [];
        return labelFields.join(",")

    }
}