import {ExportFormatType} from "../../data/ExportFormatType";
import {IPoint} from "../../interfaces/IPoint";
import {VGGFileData, VGGObject, VGGPolygon, VGGRegionsData} from "../../data/VGG/IVGG";
import {ImageData, LabelPolygon} from "../../store/editor/types";
import {EditorSelector} from "../../store/selectors/EditorSelector";
import {saveAs} from "file-saver";
import moment from 'moment';

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
        const imagesData: ImageData[] = EditorSelector.getImagesData();
        const labelNames: string[] = EditorSelector.getLabelNames();
        const outputObject: VGGObject = imagesData.reduce((data: VGGObject, image: ImageData) => {
            const fileData: VGGFileData = PolygonLabelsExporter.mapImageDataToVGGFileData(image, labelNames);
            if (!!fileData) {
                data[image.fileData.name] = fileData
            }
            return data;
        }, {});
        const content: string = JSON.stringify(outputObject);
        const projectName: string = EditorSelector.getProjectName();
        const date: string = moment().format('YYYYMMDDhhmmss');
        const blob = new Blob([content], {type: "text/plain;charset=utf-8"});
        try {
            saveAs(blob, `labels_${projectName}_${date}.json`);
        } catch (error) {
            // TODO
            throw new Error(error);
        }
    }

    private static mapImageDataToVGGFileData(imageData: ImageData, labelNames: string[]): VGGFileData {
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

    public static mapImageDataToVGG(imageData: ImageData, labelNames: string[]): VGGRegionsData {
        if (!imageData.loadStatus || !imageData.labelPolygons || !imageData.labelPolygons.length ||
            !labelNames || !labelNames.length) return null;

        const validLabels = imageData.labelPolygons.filter((label: LabelPolygon) =>
            label.labelIndex !== null && !!label.vertices.length);

        if (!validLabels.length) return null;

        return validLabels.reduce((data: VGGRegionsData, label: LabelPolygon, index: number) => {
            data['' + index] = {
                shape_attributes: PolygonLabelsExporter.mapPolygonToVGG(label.vertices),
                region_attributes: {
                    label: labelNames[label.labelIndex]
                }
            };
            return data;
        }, {})
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