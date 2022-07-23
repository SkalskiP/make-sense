import { YOLOUtils } from '../../../import/yolo/YOLOUtils';
import { isEqual } from 'lodash';
import { LabelName, LabelRect } from '../../../../store/labels/types';
import { AnnotationsParsingError, LabelNamesNotUniqueError } from '../../../import/yolo/YOLOErrors';
import { v4 as uuidv4 } from 'uuid';
import { ISize } from '../../../../interfaces/ISize';
import { IRect } from '../../../../interfaces/IRect';

describe('YOLOUtils parseLabelsFile method', () => {
    it('should return list of label names', () => {
        // given
        const content = 'orange\napple\nbanana\ncarrot';

        // when
        const result = YOLOUtils.parseLabelsNamesFromString(content);

        // then
        const expectedNames = ['orange', 'apple', 'banana', 'carrot'];
        const resultNames = result.map((item: LabelName) => item.name);
        expect(result.length).toEqual(4);
        expect(isEqual(resultNames, expectedNames)).toBe(true);
    });

    it('should return list of label names without white characters', () => {
        // given
        const content = 'orange \napple \nbanana    \ncarrot';

        // when
        const result = YOLOUtils.parseLabelsNamesFromString(content);

        // then
        const expectedNames = ['orange', 'apple', 'banana', 'carrot'];
        const resultNames = result.map((item: LabelName) => item.name);
        expect(result.length).toEqual(4);
        expect(isEqual(resultNames, expectedNames)).toBe(true);
    });

    it('should return list of label names without empty strings', () => {
        // given
        const content = 'orange\n\napple\nbanana\n\ncarrot';

        // when
        const result = YOLOUtils.parseLabelsNamesFromString(content);

        // then
        const expectedNames = ['orange', 'apple', 'banana', 'carrot'];
        const resultNames = result.map((item: LabelName) => item.name);
        expect(result.length).toEqual(4);
        expect(isEqual(resultNames, expectedNames)).toBe(true);
    });

    it('should throw exception about labels not being unique', () => {
        // given
        const content = 'orange\napple\nbanana\napple';

        // then
        expect(() => { YOLOUtils.parseLabelsNamesFromString(content); }).toThrowError(new LabelNamesNotUniqueError());
    });
});

describe('YOLOUtils validateYOLOAnnotationComponents method', () => {
    it('should return false when incorrect number of components given', () => {
        // given
        const components: string[] = ['2', '0.342238', '0.054099', '0.069556'];

        // when
        const result = YOLOUtils.validateYOLOAnnotationComponents(components, 3);

        // then
        expect(result).toBe(false);
    });

    it('should return false when label name index higher than number of label names', () => {
        // given
        const components: string[] = ['2', '0.342238', '0.054099', '0.069556', '0.108199'];

        // when
        const result = YOLOUtils.validateYOLOAnnotationComponents(components, 1);

        // then
        expect(result).toBe(false);
    });

    it('should return false when one of coordinates values have value higher than one', () => {
        // given
        const components: string[] = ['2', '0.342238', '1.054099', '0.069556', '0.108199'];

        // when
        const result = YOLOUtils.validateYOLOAnnotationComponents(components, 3);

        // then
        expect(result).toBe(false);
    });

    it('should return false when one of coordinates values have value smaller than zero', () => {
        // given
        const components: string[] = ['2', '0.342238', '-0.054099', '0.069556', '0.108199'];

        // when
        const result = YOLOUtils.validateYOLOAnnotationComponents(components, 3);

        // then
        expect(result).toBe(false);
    });

    it('should return true', () => {
        // given
        const components: string[] = ['2', '0.342238', '0.054099', '0.069556', '0.108199'];

        // when
        const result = YOLOUtils.validateYOLOAnnotationComponents(components, 3);

        // then
        expect(result).toBe(true);
    });

    it('should return true', () => {
        // given
        const components: string[] = ['6', '0.557911', '0.924187', '0.000673', '0.000000'];

        // when
        const result = YOLOUtils.validateYOLOAnnotationComponents(components, 10);

        // then
        expect(result).toBe(true);
    });
});

describe('YOLOUtils parseYOLOAnnotationFromString method', () => {
    it('should return correct LabelRect', () => {
        // given
        const rawAnnotation: string = '1 0.300000 0.200000 0.300000 0.200000';
        const labelId: string = uuidv4();
        const labelNames: LabelName[] = [
            {
                id: uuidv4(),
                name: 'orange',
                color: '#000000'
            },
            {
                id: labelId,
                name: 'apple',
                color: '#000000'
            },
            {
                id: uuidv4(),
                name: 'banana',
                color: '#000000'
            }
        ];
        const imageSize: ISize = { width: 1000, height: 1000 };
        const imageName: string = '0000.png';

        // when
        const result: LabelRect = YOLOUtils.parseYOLOAnnotationFromString(
            rawAnnotation, labelNames, imageSize, imageName
        );

        // then
        const rect: IRect = { x: 150, y: 100, width: 300, height: 200 };
        expect(result.labelId).toBe(labelId);
        expect(JSON.stringify(result.rect)).toBe(JSON.stringify(rect));
    });

    it('should throw AnnotationsParsingError', () => {
        // given
        const rawAnnotation: string = '4 0.340000 0.540000 0.060000 0.100000';
        const labelId: string = uuidv4();
        const labelNames: LabelName[] = [
            {
                id: uuidv4(),
                name: 'orange',
                color: '#000000'
            },
            {
                id: labelId,
                name: 'apple',
                color: '#000000'
            },
            {
                id: uuidv4(),
                name: 'banana',
                color: '#000000'
            }
        ];
        const imageSize: ISize = { width: 1000, height: 1000 };
        const imageName: string = '0000.png';

        // when
        function wrapper() {
            return YOLOUtils.parseYOLOAnnotationFromString(rawAnnotation, labelNames, imageSize, imageName);
        }
        expect(wrapper).toThrowError(new AnnotationsParsingError(imageName));
    });
});

describe('YOLOUtils parseYOLOAnnotationsFromString method', () => {
    it('should return correct array of LabelRect', () => {
        // given
        const rawAnnotations: string = '1 0.200000 0.200000 0.200000 0.200000\n0 0.300000 0.200000 0.300000 0.200000\n2 0.200000 0.300000 0.200000 0.300000';
        const labelId: string = uuidv4();
        const labelNames: LabelName[] = [
            {
                id: uuidv4(),
                name: 'orange',
                color: '#000000'
            },
            {
                id: uuidv4(),
                name: 'apple',
                color: '#000000'
            },
            {
                id: labelId,
                name: 'banana',
                color: '#000000'
            }
        ];
        const imageSize: ISize = { width: 1000, height: 1000 };
        const imageName: string = '0000.png';

        // when
        const result: LabelRect[] = YOLOUtils.parseYOLOAnnotationsFromString(
            rawAnnotations, labelNames, imageSize, imageName
        );

        // then
        const rect: IRect = { x: 100, y: 150, width: 200, height: 300 };
        expect(result.length).toBe(3);
        expect(result[2].labelId).toBe(labelId);
        expect(JSON.stringify(result[2].rect)).toBe(JSON.stringify(rect));
    });

    it('should throw AnnotationsParsingError', () => {
        // given
        const rawAnnotations: string = '1 0.200000 0.200000 0.200000 0.200000\n0 0.300000 0.200000 0.300000 0.200000\n4 0.200000 0.300000 0.200000 0.300000';
        const labelId: string = uuidv4();
        const labelNames: LabelName[] = [
            {
                id: uuidv4(),
                name: 'orange',
                color: '#000000'
            },
            {
                id: uuidv4(),
                name: 'apple',
                color: '#000000'
            },
            {
                id: labelId,
                name: 'banana',
                color: '#000000'
            }
        ];
        const imageSize: ISize = { width: 1000, height: 1000 };
        const imageName: string = '0000.png';

        // when
        function wrapper() {
            return YOLOUtils.parseYOLOAnnotationsFromString(rawAnnotations, labelNames, imageSize, imageName);
        }
        expect(wrapper).toThrowError(new AnnotationsParsingError(imageName));
    });
});
