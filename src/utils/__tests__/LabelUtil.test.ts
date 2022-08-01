import { IRect } from '../../interfaces/IRect';
import { LabelUtil } from '../LabelUtil';
import {LabelLine, LabelPoint, LabelPolygon, LabelRect} from '../../store/labels/types';
import {LabelStatus} from '../../data/enums/LabelStatus';
import {IPoint} from '../../interfaces/IPoint';
import {ImageData} from '../../store/labels/types';

const mockUUID: string = '123e4567-e89b-12d3-a456-426614174000'

jest.mock('uuid', () => ({ v4: () => mockUUID }));

const mockImageData = (
    labelRects: LabelRect[] = [],
    labelPoints: LabelPoint[] = [],
    labelLines: LabelLine[] = [],
    labelPolygons: LabelPolygon[] = []
): ImageData => {
    return {
        id: mockUUID,
        fileData: null,
        loadStatus: true,
        labelRects,
        labelPoints,
        labelLines,
        labelPolygons,
        labelNameIds: [],
        isVisitedByObjectDetector: false,
        isVisitedByPoseDetector: false
    }
}

describe('LabelUtil createLabelRect method', () => {
    it('return correct LabelRect object', () => {
        // given
        const labelId: string = '1';
        const rect: IRect = {
            x: 100,
            y: 100,
            width: 100,
            height: 100
        };

        // when
        const result = LabelUtil.createLabelRect(labelId, rect);

        // then
        const expectedResult: LabelRect = {
            id: mockUUID,
            labelId,
            rect,
            isVisible: true,
            isCreatedByAI: false,
            status: LabelStatus.ACCEPTED,
            suggestedLabel: null
        }
        expect(result).toEqual(expectedResult);
    });
});

describe('LabelUtil createLabelPolygon method', () => {
    it('return correct LabelPolygon object', () => {
        // given
        const labelId: string = '1';
        const vertices: IPoint[] = [
            {
                x: 100,
                y: 100
            },
            {
                x: 100,
                y: 200
            },
            {
                x: 200,
                y: 100
            }
        ];

        // when
        const result = LabelUtil.createLabelPolygon(labelId, vertices);

        // then
        const expectedResult: LabelPolygon = {
            id: mockUUID,
            labelId,
            vertices,
            isVisible: true
        }
        expect(result).toEqual(expectedResult);
    });
});

describe('LabelUtil createLabelPoint method', () => {
    it('return correct LabelPoint object', () => {
        // given
        const labelId: string = '1';
        const point: IPoint = {
            x: 100,
            y: 100
        };

        // when
        const result = LabelUtil.createLabelPoint(labelId, point);

        // then
        const expectedResult: LabelPoint = {
            id: mockUUID,
            labelId,
            point,
            isVisible: true,
            isCreatedByAI: false,
            status: LabelStatus.ACCEPTED,
            suggestedLabel: null
        }
        expect(result).toEqual(expectedResult);
    });
});

describe('LabelUtil.calculateMissingLabelNamesIds tests', () => {
    test('return empty list when oldLabelNames and newLabelNames are empty', () => {
        // given
        const oldLabelNames = [];
        const newLabelNames = [];

        // when
        const result = LabelUtil.calculateMissingLabelNamesIds(oldLabelNames, newLabelNames);

        // then
        const expectedResult = [];
        expect(result).toEqual(expectedResult);
    });

    test('return correct result when oldLabelNames contains items and newLabelNames is empty', () => {
        // given
        const oldLabelNames = [
            {
                id: 'label-id-1',
                name: 'label-name-1'
            },
            {
                id: 'label-id-2',
                name: 'label-name-2'
            },
            {
                id: 'label-id-3',
                name: 'label-name-3'
            }
        ];
        const newLabelNames = [];

        // when
        const result = LabelUtil.calculateMissingLabelNamesIds(oldLabelNames, newLabelNames);

        // then
        const expectedResult = ['label-id-1', 'label-id-2', 'label-id-3'];
        expect(result).toEqual(expectedResult);
    });

    test('return empty list when oldLabelNames is empty and newLabelNames contains items', () => {
        // given
        const oldLabelNames = [];
        const newLabelNames = [
            {
                id: 'label-id-1',
                name: 'label-name-1'
            },
            {
                id: 'label-id-2',
                name: 'label-name-2'
            },
            {
                id: 'label-id-3',
                name: 'label-name-3'
            }
        ];


        // when
        const result = LabelUtil.calculateMissingLabelNamesIds(oldLabelNames, newLabelNames);

        // then
        const expectedResult = [];
        expect(result).toEqual(expectedResult);
    });

    test('return empty list when oldLabelNames and newLabelNames are the same', () => {
        // given
        const oldLabelNames = [
            {
                id: 'label-id-1',
                name: 'label-name-1'
            },
            {
                id: 'label-id-2',
                name: 'label-name-2'
            },
            {
                id: 'label-id-3',
                name: 'label-name-3'
            }
        ];
        const newLabelNames = [
            {
                id: 'label-id-1',
                name: 'label-name-1'
            },
            {
                id: 'label-id-2',
                name: 'label-name-2'
            },
            {
                id: 'label-id-3',
                name: 'label-name-3'
            }
        ];

        // when
        const result = LabelUtil.calculateMissingLabelNamesIds(oldLabelNames, newLabelNames);

        // then
        const expectedResult = [];
        expect(result).toEqual(expectedResult);
    });

    test('return correct list with oldLabelNames and newLabelNames ids diff', () => {
        // given
        const oldLabelNames = [
            {
                id: 'label-id-1',
                name: 'label-name-1'
            },
            {
                id: 'label-id-2',
                name: 'label-name-2'
            },
            {
                id: 'label-id-3',
                name: 'label-name-3'
            }
        ];
        const newLabelNames = [
            {
                id: 'label-id-1',
                name: 'label-name-1'
            },
            {
                id: 'label-id-3',
                name: 'label-name-3'
            },
            {
                id: 'label-id-4',
                name: 'label-name-3'
            }
        ];

        // when
        const result = LabelUtil.calculateMissingLabelNamesIds(oldLabelNames, newLabelNames);

        // then
        const expectedResult = ['label-id-2'];
        expect(result).toEqual(expectedResult);
    });
});

describe('LabelUtil.calculateLabelCountSummary tests', () => {
    test('return empty summary object when labelNames is empty', () => {
        // given
        const labelNames = [];
        const imagesData = [];

        // when
        const result = LabelUtil.calculateLabelCountSummary(labelNames, imagesData);

        // then
        const expectedResult = {};
        expect(result).toEqual(expectedResult);
    });

    test('return summary object with empty counts when imagesData is empty', () => {
        // given
        const labelNames = [
            {
                id: 'label-id-1',
                name: 'label-name-1'
            },
            {
                id: 'label-id-2',
                name: 'label-name-2'
            },
            {
                id: 'label-id-3',
                name: 'label-name-3'
            }
        ];
        const imagesData = [];

        // when
        const result = LabelUtil.calculateLabelCountSummary(labelNames, imagesData);

        // then
        const expectedResult = {
            'label-id-1': { point: 0, line: 0, polygon: 0, rect: 0},
            'label-id-2': { point: 0, line: 0, polygon: 0, rect: 0},
            'label-id-3': { point: 0, line: 0, polygon: 0, rect: 0},
        };
        expect(result).toEqual(expectedResult);
    });

    test('return summary object with empty counts when imagesData does not contain any annotations', () => {
        // given
        const labelNames = [
            {
                id: 'label-id-1',
                name: 'label-name-1'
            },
            {
                id: 'label-id-2',
                name: 'label-name-2'
            },
            {
                id: 'label-id-3',
                name: 'label-name-3'
            }
        ];
        const imagesData = [
            mockImageData(),
            mockImageData(),
            mockImageData()
        ];

        // when
        const result = LabelUtil.calculateLabelCountSummary(labelNames, imagesData);

        // then
        const expectedResult = {
            'label-id-1': { point: 0, line: 0, polygon: 0, rect: 0},
            'label-id-2': { point: 0, line: 0, polygon: 0, rect: 0},
            'label-id-3': { point: 0, line: 0, polygon: 0, rect: 0},
        };
        expect(result).toEqual(expectedResult);
    });
});
