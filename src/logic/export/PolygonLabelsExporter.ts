import {ExportFormatType} from "../../data/ExportFormatType";
import {IPoint} from "../../interfaces/IPoint";
import {VGGPolygon} from "../../data/VGG/IVGG";

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

    }

    private static mapImageDataToVGGObject() {

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