import {IPoint} from "../../../interfaces/IPoint";
import {PolygonLabelsExporter} from "../PolygonLabelsExporter";
import {VGGPolygon} from "../../../data/VGG/IVGG";

describe('PolygonLabelsExporter mapPolygonToVGG method', () => {
    it('should return correct VGGPolygon object', () => {
        const givenPath: IPoint[] = [
            {x: 1, y: 1},
            {x: 5, y: 1},
            {x: 6, y: 10},
            {x: 0, y: 10},
        ];

        const expectedPolygon: VGGPolygon = {
            name: "polygon",
            all_points_x: [1, 5, 6, 0, 1],
            all_points_y: [1, 1, 10, 10, 1]
        };
        expect(PolygonLabelsExporter.mapPolygonToVGG(givenPath)).toEqual(expectedPolygon);
    });

    it('should return null', () => {
        const givenPath: IPoint[] = [];
        expect(PolygonLabelsExporter.mapPolygonToVGG(givenPath)).toBeNull();
    });
});