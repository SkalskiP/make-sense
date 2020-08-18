import {ExportFormatType} from "../../data/enums/ExportFormatType";
import {LabelsSelector} from "../../store/selectors/LabelsSelector";
import {ImageData, LabelName} from "../../store/labels/types";
import {ExporterUtil} from "../../utils/ExporterUtil";
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
        if (imageData.labelNameIds.length === 0 || !imageData.loadStatus)
            return null;

        const labelNames: LabelName[] = LabelsSelector.getLabelNames();
        const annotations: string[] = imageData.labelNameIds.map((labelNameId: string) => {
            return findLast(labelNames, {id: labelNameId}).name;
        })
        const labelFields = annotations.length !== 0 ? [
            imageData.fileData.name,
            `"[${annotations.toString()}]"`
        ] : [];
        return labelFields.join(",")
    }
}