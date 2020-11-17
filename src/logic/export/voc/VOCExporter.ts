import JSZip from "jszip";
import {saveAs} from "file-saver";
import {ExporterUtil} from "../../../utils/ExporterUtil";
import {LabelsSelector} from "../../../store/selectors/LabelsSelector";
import {ImageData} from "../../../store/labels/types";
import {VOCUtils} from "./VOCUtils";
import {VOCAnnotationsExportError} from "./VOCErrors";

export class VOCExporter {
    public static export(): void {
        const zip = new JSZip();
        LabelsSelector.getImagesData().forEach((imageData: ImageData) => {
            const fileContent: string | null = VOCUtils.mapImageDataToVOCXMLAnnotation(imageData);
            const fileName: string= VOCUtils.mapImageDataToAnnotationFileName(imageData);
            console.log(fileContent)
            if (!!fileContent) {
                VOCExporter.appendAnnotationFile(zip, fileName, fileContent);
            }
        });
        VOCExporter.persistAnnotationZip(zip);
    }

    public static appendAnnotationFile(zip: JSZip, fileName: string, fileContent: string): void {
        try {
            zip.file(fileName, fileContent);
        } catch (error) {
            // TODO
            throw new VOCAnnotationsExportError(error);
        }
    }

    public static persistAnnotationZip(zip: JSZip): void {
        try {
            zip.generateAsync({type:"blob"})
                .then(function(content) {
                    saveAs(content, `${ExporterUtil.getExportFileName()}.zip`);
                });
        } catch (error) {
            // TODO
            throw new VOCAnnotationsExportError(error);
        }
    }
}