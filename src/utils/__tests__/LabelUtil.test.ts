import {IRect} from '../../interfaces/IRect';
import {LabelUtil} from '../LabelUtil';
import {ImageData, LabelLine, LabelPoint, LabelPolygon, LabelRect} from '../../store/labels/types';
import {LabelStatus} from '../../data/enums/LabelStatus';
import {IPoint} from '../../interfaces/IPoint';
import {ILine} from '../../interfaces/ILine';

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

describe('LabelUtil.createLabelRect tests', () => {
    test('return correct LabelRect object', () => {
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

describe('LabelUtil.createLabelPolygon tests', () => {
    test('return correct LabelPolygon object', () => {
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

describe('LabelUtil.createLabelPoint tests', () => {
    test('return correct LabelPoint object', () => {
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

describe('LabelUtil.createLabelLine tests', () => {
    test('return correct LabelLine object', () => {
        // given
        const labelId: string = '1';
        const line: ILine = {
            start: {x: 0, y: 0},
            end: {x: 10, y: 10}
        };

        // when
        const result = LabelUtil.createLabelLine(labelId, line);

        // then
        const expectedResult: LabelLine = {
            id: mockUUID,
            labelId,
            line,
            isVisible: true
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

describe('LabelUtil.calculatePerLabelIdCountSummary tests', () => {
    test('return empty summary object when labelNames is empty', () => {
        // given
        const labelNames = [];
        const imagesData = [];

        // when
        const result = LabelUtil.calculatePerLabelIdCountSummary(labelNames, imagesData);

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
        const result = LabelUtil.calculatePerLabelIdCountSummary(labelNames, imagesData);

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
        const result = LabelUtil.calculatePerLabelIdCountSummary(labelNames, imagesData);

        // then
        const expectedResult = {
            'label-id-1': { point: 0, line: 0, polygon: 0, rect: 0},
            'label-id-2': { point: 0, line: 0, polygon: 0, rect: 0},
            'label-id-3': { point: 0, line: 0, polygon: 0, rect: 0},
        };
        expect(result).toEqual(expectedResult);
    });

    test('return summary object with only rect counts when imagesData does contain only rect annotations', () => {
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
            mockImageData(
                [
                    LabelUtil.createLabelRect('label-id-1', {x: 0, y: 0, width: 1, height: 1}),
                    LabelUtil.createLabelRect('label-id-1', {x: 0, y: 0, width: 1, height: 1}),
                    LabelUtil.createLabelRect('label-id-2', {x: 0, y: 0, width: 1, height: 1}),
                ]
            ),
            mockImageData(
                [
                    LabelUtil.createLabelRect('label-id-1', {x: 0, y: 0, width: 1, height: 1}),
                    LabelUtil.createLabelRect('label-id-2', {x: 0, y: 0, width: 1, height: 1}),
                    LabelUtil.createLabelRect('label-id-2', {x: 0, y: 0, width: 1, height: 1}),
                    LabelUtil.createLabelRect('label-id-3', {x: 0, y: 0, width: 1, height: 1}),
                ]
            ),
            mockImageData()
        ];

        // when
        const result = LabelUtil.calculatePerLabelIdCountSummary(labelNames, imagesData);

        // then
        const expectedResult = {
            'label-id-1': { point: 0, line: 0, polygon: 0, rect: 3},
            'label-id-2': { point: 0, line: 0, polygon: 0, rect: 3},
            'label-id-3': { point: 0, line: 0, polygon: 0, rect: 1},
        };
        expect(result).toEqual(expectedResult);
    });

    test('return summary object with only rect counts when imagesData does contain only rect annotations but some labelIds are null', () => {
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
            mockImageData(
                [
                    LabelUtil.createLabelRect(null, {x: 0, y: 0, width: 1, height: 1}),
                    LabelUtil.createLabelRect('label-id-1', {x: 0, y: 0, width: 1, height: 1}),
                    LabelUtil.createLabelRect('label-id-2', {x: 0, y: 0, width: 1, height: 1}),
                ]
            ),
            mockImageData(
                [
                    LabelUtil.createLabelRect('label-id-1', {x: 0, y: 0, width: 1, height: 1}),
                    LabelUtil.createLabelRect('label-id-2', {x: 0, y: 0, width: 1, height: 1}),
                    LabelUtil.createLabelRect(null, {x: 0, y: 0, width: 1, height: 1}),
                    LabelUtil.createLabelRect('label-id-3', {x: 0, y: 0, width: 1, height: 1}),
                ]
            ),
            mockImageData()
        ];

        // when
        const result = LabelUtil.calculatePerLabelIdCountSummary(labelNames, imagesData);

        // then
        const expectedResult = {
            'label-id-1': { point: 0, line: 0, polygon: 0, rect: 2},
            'label-id-2': { point: 0, line: 0, polygon: 0, rect: 2},
            'label-id-3': { point: 0, line: 0, polygon: 0, rect: 1},
        };
        expect(result).toEqual(expectedResult);
    });

    test('return summary object with only rect counts when imagesData does contain only rect annotations but labels are rejected', () => {
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
            mockImageData(
                [
                    LabelUtil.createLabelRect('label-id-1', {x: 0, y: 0, width: 1, height: 1}, LabelStatus.REJECTED),
                    LabelUtil.createLabelRect('label-id-1', {x: 0, y: 0, width: 1, height: 1}),
                    LabelUtil.createLabelRect('label-id-2', {x: 0, y: 0, width: 1, height: 1}),
                ]
            ),
            mockImageData(
                [
                    LabelUtil.createLabelRect('label-id-1', {x: 0, y: 0, width: 1, height: 1}),
                    LabelUtil.createLabelRect('label-id-2', {x: 0, y: 0, width: 1, height: 1}),
                    LabelUtil.createLabelRect('label-id-2', {x: 0, y: 0, width: 1, height: 1}, LabelStatus.REJECTED),
                    LabelUtil.createLabelRect('label-id-3', {x: 0, y: 0, width: 1, height: 1}),
                ]
            ),
            mockImageData()
        ];

        // when
        const result = LabelUtil.calculatePerLabelIdCountSummary(labelNames, imagesData);

        // then
        const expectedResult = {
            'label-id-1': { point: 0, line: 0, polygon: 0, rect: 2},
            'label-id-2': { point: 0, line: 0, polygon: 0, rect: 2},
            'label-id-3': { point: 0, line: 0, polygon: 0, rect: 1},
        };
        expect(result).toEqual(expectedResult);
    });

    test('return summary object with only point counts when imagesData does contain only point annotations', () => {
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
            mockImageData([],
                [
                    LabelUtil.createLabelPoint('label-id-1', {x: 0, y: 0}),
                    LabelUtil.createLabelPoint('label-id-2', {x: 0, y: 0}),
                ]
            ),
            mockImageData(),
            mockImageData([],
                [
                    LabelUtil.createLabelPoint('label-id-3', {x: 0, y: 0}),
                    LabelUtil.createLabelPoint('label-id-2', {x: 0, y: 0}),
                    LabelUtil.createLabelPoint('label-id-2', {x: 0, y: 0}),
                ]
            ),
        ];

        // when
        const result = LabelUtil.calculatePerLabelIdCountSummary(labelNames, imagesData);

        // then
        const expectedResult = {
            'label-id-1': { point: 1, line: 0, polygon: 0, rect: 0},
            'label-id-2': { point: 3, line: 0, polygon: 0, rect: 0},
            'label-id-3': { point: 1, line: 0, polygon: 0, rect: 0},
        };
        expect(result).toEqual(expectedResult);
    });

    test('return summary object with only line counts when imagesData does contain only line annotations', () => {
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
            mockImageData([], [],
                [
                    LabelUtil.createLabelLine('label-id-1', {start: {x: 0, y: 0}, end: {x: 1, y: 1}}),
                    LabelUtil.createLabelLine('label-id-1', {start: {x: 0, y: 0}, end: {x: 1, y: 1}}),
                    LabelUtil.createLabelLine('label-id-1', {start: {x: 0, y: 0}, end: {x: 1, y: 1}}),
                ]
            ),
            mockImageData([], [],
                [
                    LabelUtil.createLabelLine('label-id-2', {start: {x: 0, y: 0}, end: {x: 1, y: 1}}),
                    LabelUtil.createLabelLine('label-id-2', {start: {x: 0, y: 0}, end: {x: 1, y: 1}})
                ]
            ),
        ];

        // when
        const result = LabelUtil.calculatePerLabelIdCountSummary(labelNames, imagesData);

        // then
        const expectedResult = {
            'label-id-1': { point: 0, line: 3, polygon: 0, rect: 0},
            'label-id-2': { point: 0, line: 2, polygon: 0, rect: 0},
            'label-id-3': { point: 0, line: 0, polygon: 0, rect: 0},
        };
        expect(result).toEqual(expectedResult);
    });

    test('return summary object with only polygon counts when imagesData does contain only polygon annotations', () => {
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
            mockImageData([], [], [],
                [
                    LabelUtil.createLabelPolygon('label-id-1', [{x: 0, y: 0}, {x: 1, y: 0}, {x: 0, y: 1}]),
                    LabelUtil.createLabelPolygon('label-id-2', [{x: 0, y: 0}, {x: 1, y: 0}, {x: 0, y: 1}]),
                    LabelUtil.createLabelPolygon('label-id-3', [{x: 0, y: 0}, {x: 1, y: 0}, {x: 0, y: 1}]),
                ]
            )
        ];

        // when
        const result = LabelUtil.calculatePerLabelIdCountSummary(labelNames, imagesData);

        // then
        const expectedResult = {
            'label-id-1': { point: 0, line: 0, polygon: 1, rect: 0},
            'label-id-2': { point: 0, line: 0, polygon: 1, rect: 0},
            'label-id-3': { point: 0, line: 0, polygon: 1, rect: 0},
        };
        expect(result).toEqual(expectedResult);
    });
});
