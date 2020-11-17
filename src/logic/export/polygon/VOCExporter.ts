import {ImageData, LabelName} from "../../../store/labels/types";
import {LabelsSelector} from "../../../store/selectors/LabelsSelector";

export class VOCExporter {
    public static export(): void {
        const imagesData: ImageData[] = LabelsSelector.getImagesData();
        const labelNames: LabelName[] = LabelsSelector.getLabelNames();

    }
}