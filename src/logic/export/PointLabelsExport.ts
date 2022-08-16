import {AnnotationFormatType} from '../../data/enums/AnnotationFormatType';
import {ImageData, LabelName, LabelPoint} from '../../store/labels/types';
import {ImageRepository} from '../imageRepository/ImageRepository';
import {LabelsSelector} from '../../store/selectors/LabelsSelector';
import {ExporterUtil} from '../../utils/ExporterUtil';
import {findLast} from 'lodash';
import {Settings} from '../../settings/Settings';

export class PointLabelsExporter {
    public static export(exportFormatType: AnnotationFormatType): void {
        switch (exportFormatType) {
            case AnnotationFormatType.CSV:
                PointLabelsExporter.exportAsCSV();
                break;
            default:
                return;
        }
    }

    private static exportAsCSV(): void {
        try {
            const contentEntries: string[] = LabelsSelector.getImagesData()
                .map((imageData: ImageData) => {
                    return PointLabelsExporter.wrapRectLabelsIntoCSV(imageData)})
                .filter((imageLabelData: string) => {
                    return !!imageLabelData})
            contentEntries.unshift(Settings.POINT_LABELS_CSV_COLUMN_NAMES);

            const content: string = contentEntries.join('\n');
            const fileName: string = `${ExporterUtil.getExportFileName()}.csv`;
            ExporterUtil.saveAs(content, fileName);
        } catch (error) {
            // TODO
            throw new Error(error as string);
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
                Math.round(labelPoint.point.x).toString(),
                Math.round(labelPoint.point.y).toString(),
                imageData.fileData.name,
                image.width.toString(),
                image.height.toString()
            ] : [];
            return labelFields.join(',')
        });
        return labelRectsString.join('\n');
    }
}
