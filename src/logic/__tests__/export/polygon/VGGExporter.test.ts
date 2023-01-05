import {IPoint} from '../../../../interfaces/IPoint';
import {VGGPolygon, VGGRegionsData} from '../../../../data/labels/VGG';
import {ImageData, LabelName} from '../../../../store/labels/types';
import {VGGExporter} from '../../../export/polygon/VGGExporter';

describe('VGGExporter mapPolygonToVGG method', () => {
    it('should return correct VGGPolygon object', () => {
        const givenPath: IPoint[] = [
            {x: 1, y: 1},
            {x: 5, y: 1},
            {x: 6, y: 10},
            {x: 0, y: 10},
        ];

        const expectedPolygon: VGGPolygon = {
            name: 'polygon',
            all_points_x: [1, 5, 6, 0, 1],
            all_points_y: [1, 1, 10, 10, 1]
        };
        expect(VGGExporter.mapPolygonToVGG(givenPath)).toEqual(expectedPolygon);
    });

    it('should return null', () => {
        const givenPath: IPoint[] = [];
        expect(VGGExporter.mapPolygonToVGG(givenPath)).toBeNull();
    });
});

describe('VGGExporter mapImageDataToVGG method', () => {
    it('should return null', () => {
        const givenImageData: ImageData = {
            id: '1',
            loadStatus: false,
            labelPoints: [],
            labelRects: [],
            labelPolygons: [],
            labelLines: [],
            labelNameIds: [],
            fileData: {} as File,
            isVisitedByYOLOObjectDetector: false,
            isVisitedBySSDObjectDetector: false,
            isVisitedByPoseDetector: true,
            isVisitedByRoboflowAPI: false
        };
        expect(VGGExporter.mapImageDataToVGG(givenImageData, [])).toBeNull();
    });

    it('should return valid VGGRegionsData', () => {
        const givenImageData: ImageData = {
            id: '1',
            loadStatus: true,
            labelPoints: [],
            labelRects: [],
            labelPolygons: [
                {
                    id: '1',
                    labelId: 'label_1',
                    vertices: [
                        {x: 1, y: 1},
                        {x: 5, y: 1},
                        {x: 6, y: 10},
                        {x: 0, y: 10}
                    ],
                    isVisible: true
                },
                {
                    id: '2',
                    labelId: 'label_2',
                    vertices: [
                        {x: 1, y: 1},
                        {x: 5, y: 1},
                        {x: 6, y: 10},
                        {x: 10, y: 10},
                        {x: 0, y: 10}
                    ],
                    isVisible: true
                }
            ],
            labelLines: [],
            labelNameIds: [],
            fileData: {} as File,
            isVisitedByYOLOObjectDetector: false,
            isVisitedBySSDObjectDetector: false,
            isVisitedByPoseDetector: true,
            isVisitedByRoboflowAPI: false
        };

        const givenLabelNames: LabelName[] = [
            {
                id: 'label_1',
                name: 'banana',
                color: '#ffffff'
            },
            {
                id: 'label_2',
                name: 'kiwi',
                color: '#ffffff'
            }
        ];

        const expectedVGGRegionData: VGGRegionsData = {
            '0': {
                shape_attributes: {
                    name: 'polygon',
                    all_points_x: [1, 5, 6, 0, 1],
                    all_points_y: [1, 1, 10, 10, 1]
                },
                region_attributes: {
                    label: 'banana'
                }
            },
            '1': {
                shape_attributes: {
                    name: 'polygon',
                    all_points_x: [1, 5, 6, 10, 0, 1],
                    all_points_y: [1, 1, 10, 10, 10, 1]
                },
                region_attributes: {
                    label: 'kiwi'
                }
            }
        };
        expect(VGGExporter.mapImageDataToVGG(givenImageData, givenLabelNames)).toEqual(expectedVGGRegionData);
    });

    it('should return valid VGGRegionsData', () => {
        const givenImageData: ImageData = {
            id: '1',
            loadStatus: true,
            labelPoints: [],
            labelRects: [],
            labelPolygons: [
                {
                    id: '1',
                    labelId: 'label_1',
                    vertices: [
                        {x: 1, y: 1},
                        {x: 5, y: 1},
                        {x: 6, y: 10},
                        {x: 0, y: 10}
                    ],
                    isVisible: true
                },
                {
                    id: '2',
                    labelId: null,
                    vertices: [
                        {x: 1, y: 1},
                        {x: 5, y: 1},
                        {x: 6, y: 10},
                        {x: 10, y: 10},
                        {x: 0, y: 10}
                    ],
                    isVisible: true
                }
            ],
            labelLines: [],
            labelNameIds: [],
            fileData: {} as File,
            isVisitedByYOLOObjectDetector: false,
            isVisitedBySSDObjectDetector: false,
            isVisitedByPoseDetector: true,
            isVisitedByRoboflowAPI: false
        };

        const givenLabelNames: LabelName[] = [
            {
                id: 'label_1',
                name: 'banana',
                color: '#ffffff'
            },
            {
                id: 'label_2',
                name: 'kiwi',
                color: '#ffffff'
            }
        ];

        const expectedVGGRegionData: VGGRegionsData = {
            '0': {
                shape_attributes: {
                    name: 'polygon',
                    all_points_x: [1, 5, 6, 0, 1],
                    all_points_y: [1, 1, 10, 10, 1]
                },
                region_attributes: {
                    label: 'banana'
                }
            }
        };
        expect(VGGExporter.mapImageDataToVGG(givenImageData, givenLabelNames)).toEqual(expectedVGGRegionData);
    });
});
