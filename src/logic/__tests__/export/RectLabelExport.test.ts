import {LabelName, LabelRect} from '../../../store/labels/types';
import {LabelStatus} from '../../../data/enums/LabelStatus';
import {ISize} from '../../../interfaces/ISize';
import {RectLabelsExporter} from '../../export/RectLabelsExporter';

const imageSize: ISize = {
    width: 1920,
    height: 1080
}
const labelNames: LabelName[] = [
    {
        id: 'label-000',
        name: 'label-name-000',
        color: '#000000'
    },
    {
        id: 'label-001',
        name: 'label-name-001',
        color: '#000000'
    },
    {
        id: 'label-002',
        name: 'label-name-002',
        color: '#000000'
    },
    {
        id: 'label-003',
        name: 'label-name-003',
        color: '#000000'
    },
]

describe('RectLabelsExporter wrapRectLabelIntoYOLO method', () => {
    it('should produce correct single label entry given issue #171 example 1', () => {
        // given
        const labelRect: LabelRect = {
            id: 'label-rect-000',
            labelId: 'label-002',
            rect: {
                x: 444,
                y: 998,
                width: 90,
                height: 82
            },
            isCreatedByAI: false,
            status: LabelStatus.ACCEPTED,
            suggestedLabel: 'label-000'
        }
        // when
        const result = RectLabelsExporter.wrapRectLabelIntoYOLO(labelRect, labelNames, imageSize)
        // then
        const [classIdx, x, y, width, height] = result.split(' ').map((value: string) => parseFloat(value))
        expect(classIdx).toBe(2)
        expect(x + width / 2 <= 1).toBeTruthy()
        expect(x - width / 2 >= 0).toBeTruthy()
        expect(y + height / 2 <= 1).toBeTruthy()
        expect(y - height / 2 >= 0).toBeTruthy()
    })

    it('should produce correct single label entry given issue #171 example 2', () => {
        // given
        const labelRect: LabelRect = {
            id: 'label-rect-000',
            labelId: 'label-002',
            rect: {
                x: 1828,
                y: 710,
                width: 92,
                height: 104
            },
            isCreatedByAI: false,
            status: LabelStatus.ACCEPTED,
            suggestedLabel: 'label-000'
        }
        // when
        const result = RectLabelsExporter.wrapRectLabelIntoYOLO(labelRect, labelNames, imageSize)
        // then
        const [classIdx, x, y, width, height] = result.split(' ').map((value: string) => parseFloat(value))
        expect(classIdx).toBe(2)
        expect(x + width / 2 <= 1).toBeTruthy()
        expect(x - width / 2 >= 0).toBeTruthy()
        expect(y + height / 2 <= 1).toBeTruthy()
        expect(y - height / 2 >= 0).toBeTruthy()
    })

    it('should produce correct single label entry given issue #171 example 3', () => {
        // given
        const labelRect: LabelRect = {
            id: 'label-rect-000',
            labelId: 'label-002',
            rect: {
                x: 0,
                y: 138,
                width: 80,
                height: 70
            },
            isCreatedByAI: false,
            status: LabelStatus.ACCEPTED,
            suggestedLabel: 'label-000'
        }
        // when
        const result = RectLabelsExporter.wrapRectLabelIntoYOLO(labelRect, labelNames, imageSize)
        // then
        const [classIdx, x, y, width, height] = result.split(' ').map((value: string) => parseFloat(value))
        expect(classIdx).toBe(2)
        expect(x + width / 2 <= 1).toBeTruthy()
        expect(x - width / 2 >= 0).toBeTruthy()
        expect(y + height / 2 <= 1).toBeTruthy()
        expect(y - height / 2 >= 0).toBeTruthy()
    })
})
