import { IRect } from '../../interfaces/IRect';
import { LabelUtil } from '../LabelUtil';
import {LabelPoint, LabelPolygon, LabelRect} from '../../store/labels/types';
import {LabelStatus} from '../../data/enums/LabelStatus';
import {IPoint} from '../../interfaces/IPoint';

const mockUUID: string = '123e4567-e89b-12d3-a456-426614174000'

jest.mock('uuid', () => ({ v4: () => mockUUID }));

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
