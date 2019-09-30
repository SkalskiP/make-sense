import {ExportFormatType} from "../../data/enums/ExportFormatType";
import {IPoint} from "../../interfaces/IPoint";
import {VGGFileData, VGGObject, VGGPolygon, VGGRegionsData} from "../../data/VGG/IVGG";
import {ImageData, LabelName, LabelPolygon} from "../../store/labels/types";
import {LabelsSelector} from "../../store/selectors/LabelsSelector";
import {saveAs} from "file-saver";
import {ExporterUtil} from "../../utils/ExporterUtil";
import {findLast} from "lodash";

export class PolygonLabelsExporter {
    public static export(exportFormatType: ExportFormatType): void {
        switch (exportFormatType) {
            case ExportFormatType.VGG_JSON:
                PolygonLabelsExporter.exportAsVGGJson();
                break;
            default:
                return;
        }
    }

    private static exportAsVGGJson(): void {
        const imagesData: ImageData[] = LabelsSelector.getImagesData();
        const labelNames: LabelName[] = LabelsSelector.getLabelNames();
        const content: string = JSON.stringify(PolygonLabelsExporter.mapImagesDataToVGGObject(imagesData, labelNames));
        const blob = new Blob([content], {type: "text/plain;charset=utf-8"});
        try {
            saveAs(blob, `${ExporterUtil.getExportFileName()}.json`);
        } catch (error) {
            // TODO
            throw new Error(error);
        }
    }

    private static mapImagesDataToVGGObject(imagesData: ImageData[], labelNames: LabelName[]): VGGObject {
        return imagesData.reduce((data: VGGObject, image: ImageData) => {
            const fileData: VGGFileData = PolygonLabelsExporter.mapImageDataToVGGFileData(image, labelNames);
            if (!!fileData) {
                data[image.fileData.name] = fileData
            }
            return data;
        }, {});
    }

    private static mapImageDataToVGGFileData(imageData: ImageData, labelNames: LabelName[]): VGGFileData {
        const regionsData: VGGRegionsData = PolygonLabelsExporter.mapImageDataToVGG(imageData, labelNames);
        if (!regionsData) return null;
        return {
            fileref: "",
            size: imageData.fileData.size,
            filename: imageData.fileData.name,
            base64_img_data: "",
            file_attributes: {},
            regions: regionsData
        }
    }

    public static mapImageDataToVGG(imageData: ImageData, labelNames: LabelName[]): VGGRegionsData {
        if (!imageData.loadStatus || !imageData.labelPolygons || !imageData.labelPolygons.length ||
            !labelNames || !labelNames.length) return null;

        const validLabels: LabelPolygon[] = PolygonLabelsExporter.getValidPolygonLabels(imageData);

        if (!validLabels.length) return null;

        return validLabels.reduce((data: VGGRegionsData, label: LabelPolygon, index: number) => {
            const labelName: LabelName = findLast(labelNames, {id: label.labelId});
            if (!!labelName) {
                data[index.toString()] = {
                    shape_attributes: PolygonLabelsExporter.mapPolygonToVGG(label.vertices),
                    region_attributes: {
                        label: labelName.name
                    }
                };
            }
            return data;
        }, {})
    }

    public static getValidPolygonLabels(imageData: ImageData): LabelPolygon[] {
        return imageData.labelPolygons.filter((label: LabelPolygon) =>
            label.labelId !== null && !!label.vertices.length);
    }

    public static mapPolygonToVGG(path: IPoint[]): VGGPolygon {
        if (!path || !path.length) return null;

        const all_points_x: number[] = path.map((point: IPoint) => point.x).concat(path[0].x);
        const all_points_y: number[] = path.map((point: IPoint) => point.y).concat(path[0].y);
        return {
            name: "polygon",
            all_points_x,
            all_points_y
        }
    }
}