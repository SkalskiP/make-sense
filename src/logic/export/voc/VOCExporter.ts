import {ImageData, LabelName} from "../../../store/labels/types";
import {LabelsSelector} from "../../../store/selectors/LabelsSelector";
import JSZip from "jszip";

export class VOCExporter {
    public static export(): void {
        const imagesData: ImageData[] = LabelsSelector.getImagesData();
        const labelNames: LabelName[] = LabelsSelector.getLabelNames();
        const zip = new JSZip();
    }

    public static appendAnnotationFile(zip: JSZip, fileName: string, fileContent: string): void {

    }

    public static saveAnnotationZip(zip: JSZip): void {

    }
}