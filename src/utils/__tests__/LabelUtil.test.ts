import { IRect } from '../../interfaces/IRect';
import { LabelUtil } from '../LabelUtil';
import {LabelRect} from '../../store/labels/types';
import {LabelStatus} from '../../data/enums/LabelStatus';

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
        }

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
