import {YOLOUtils} from "../../../import/yolo/YOLOUtils";
import {isEqual} from "lodash";
import {LabelName} from "../../../../store/labels/types";
import {LabelNamesNotUniqueError} from "../../../import/yolo/YOLOErrors";

describe('YOLOUtils parseLabelsFile method', () => {
    it('should return list of label names', () => {
        // given
        const content = "orange\napple\nbanana\ncarrot"

        // when
        const result = YOLOUtils.parseLabelsNamesFromString(content)

        // then
        const expectedNames = ['orange', 'apple', 'banana', 'carrot'];
        const resultNames = result.map((item: LabelName) => item.name);
        expect(result.length).toEqual(4);
        expect(isEqual(resultNames, expectedNames)).toBe(true);
    });

    it('should return list of label names without white characters', () => {
        // given
        const content = "orange \napple \nbanana    \ncarrot"

        // when
        const result = YOLOUtils.parseLabelsNamesFromString(content)

        // then
        const expectedNames = ['orange', 'apple', 'banana', 'carrot'];
        const resultNames = result.map((item: LabelName) => item.name);
        expect(result.length).toEqual(4);
        expect(isEqual(resultNames, expectedNames)).toBe(true);
    });

    it('should return list of label names without empty strings', () => {
        // given
        const content = "orange\n\napple\nbanana\n\ncarrot"

        // when
        const result = YOLOUtils.parseLabelsNamesFromString(content)

        // then
        const expectedNames = ['orange', 'apple', 'banana', 'carrot'];
        const resultNames = result.map((item: LabelName) => item.name);
        expect(result.length).toEqual(4);
        expect(isEqual(resultNames, expectedNames)).toBe(true);
    });

    it('should throw exception about labels not being unique', () => {
        // given
        const content = "orange\napple\nbanana\napple"

        // then
        expect(function(){ YOLOUtils.parseLabelsNamesFromString(content); }).toThrowError(new LabelNamesNotUniqueError())
    });
});

describe('YOLOUtils validateYOLOAnnotationComponents method', () => {
    it('should return false when incorrect number of components given', () => {
        // given
        const components: string[] = ["2", "0.342238", "0.054099", "0.069556"]

        // when
        const result = YOLOUtils.validateYOLOAnnotationComponents(components, 3);

        // then
        expect(result).toBe(false);
    });

    it('should return false when label name index higher than number of label names', () => {
        // given
        const components: string[] = ["2", "0.342238", "0.054099", "0.069556", "0.108199"]

        // when
        const result = YOLOUtils.validateYOLOAnnotationComponents(components, 1);

        // then
        expect(result).toBe(false);
    });

    it('should return false when one of coordinates values have value higher than one', () => {
        // given
        const components: string[] = ["2", "0.342238", "1.054099", "0.069556", "0.108199"]

        // when
        const result = YOLOUtils.validateYOLOAnnotationComponents(components, 3);

        // then
        expect(result).toBe(false);
    });

    it('should return false when one of coordinates values have value smaller than zero', () => {
        // given
        const components: string[] = ["2", "0.342238", "-0.054099", "0.069556", "0.108199"]

        // when
        const result = YOLOUtils.validateYOLOAnnotationComponents(components, 3);

        // then
        expect(result).toBe(false);
    });

    it('should return true', () => {
        // given
        const components: string[] = ["2", "0.342238", "0.054099", "0.069556", "0.108199"]

        // when
        const result = YOLOUtils.validateYOLOAnnotationComponents(components, 3);

        // then
        expect(result).toBe(true);
    });
});