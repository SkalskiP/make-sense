import {YOLOUtils} from "../../../import/yolo/utils";
import {isEqual} from "lodash";
import {LabelName} from "../../../../store/labels/types";
import {LabelNamesNotUniqueError} from "../../../import/yolo/errors";

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

    it('should raise exception about labels not being unique', () => {
        // given
        const content = "orange\napple\nbanana\napple"

        // then
        expect(function(){ YOLOUtils.parseLabelsNamesFromString(content); }).toThrowError(new LabelNamesNotUniqueError())
    });
});