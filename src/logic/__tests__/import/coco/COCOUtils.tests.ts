import {COCOUtils} from "../../../import/coco/COCOUtils";
import {isEqual} from "lodash";

describe('COCOUtils bbox2rect method', () => {
    it('should return valid IRect', () => {
        // given
        const x = 10, y = 20, width= 30, height = 40;
        const bbox: [number, number, number, number] = [x, y, width, height]

        // when
        const result = COCOUtils.bbox2rect(bbox);

        // then
        const expectedResult = {
            x: x,
            y: y,
            width: width,
            height: height
        }
        expect(result).toEqual(expectedResult);
    });
});

describe('COCOUtils segmentation2vertices method', () => {
    it('should return valid array of polygon vertices', () => {
        // given
        const p1x = 10, p1y = 20, p2x = 30, p2y = 40, p3x = 50, p3y = 60;
        const segmentation: number[][] = [[p1x, p1y, p2x, p2y, p3x, p3y]];

        // when
        const result = COCOUtils.segmentation2vertices(segmentation);

        // then
        const expectedResult = [[
            {x: p1x, y: p1y},
            {x: p2x, y: p2y},
            {x: p3x, y: p3y}
        ]]
        expect(isEqual(result, expectedResult)).toBe(true);
    });
});