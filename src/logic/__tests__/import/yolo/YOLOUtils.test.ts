import {YOLOUtils} from "../../../import/yolo/YOLOUtils";
import {isEqual} from "lodash";
import {LabelName, LabelRect} from "../../../../store/labels/types";
import {AnnotationsParsingError, LabelNamesNotUniqueError} from "../../../import/yolo/YOLOErrors";
import uuidv4 from "uuid/v4";
import {ISize} from "../../../../interfaces/ISize";
import {IRect} from "../../../../interfaces/IRect";

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

describe('YOLOUtils parseYOLOAnnotationFromString method', () => {
    it('should return correct LabelRect', () => {
        // given
        const rawAnnotation: string = "1 0.340000 0.540000 0.060000 0.100000";
        const labelId: string = uuidv4();
        const labelNames: LabelName[] = [
            {id: uuidv4(), name: "orange"},
            {id: labelId, name: "apple"},
            {id: uuidv4(), name: "banana"}
        ];
        const imageSize: ISize = {width: 1000, height: 1000};
        const imageName: string = "0000.png";

        // when
        const result: LabelRect = YOLOUtils.parseYOLOAnnotationFromString(
            rawAnnotation, labelNames, imageSize, imageName
        )

        // then
        const rect: IRect = {x: 340, y: 540, width: 60, height: 100}
        expect(result.labelId).toBe(labelId);
        expect(JSON.stringify(result.rect)).toBe(JSON.stringify(rect));
    });

    it('should throw AnnotationsParsingError', () => {
        // given
        const rawAnnotation: string = "4 0.340000 0.540000 0.060000 0.100000";
        const labelId: string = uuidv4();
        const labelNames: LabelName[] = [
            {id: uuidv4(), name: "orange"},
            {id: labelId, name: "apple"},
            {id: uuidv4(), name: "banana"}
        ];
        const imageSize: ISize = {width: 1000, height: 1000};
        const imageName: string = "0000.png";

        // when
        function wrapper() {
            return YOLOUtils.parseYOLOAnnotationFromString(rawAnnotation, labelNames, imageSize, imageName)
        }
        expect(wrapper).toThrowError(new AnnotationsParsingError(imageName));
    });
});