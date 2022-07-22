import {NumberUtil} from "../NumberUtil";

describe('NumberUtil snapValueToRange method', () => {
    it('should return value rounded to the upper bound', () => {
        const result: number = NumberUtil.snapValueToRange(1.0000005, 0, 1)
        expect(result).toBe(1);
    });
    it('should return value rounded to the lower bound', () => {
        const result: number = NumberUtil.snapValueToRange(-0.0000005, 0, 1)
        expect(result).toBe(0);
    });
    it('should return unmodified value', () => {
        const result: number = NumberUtil.snapValueToRange(0.5, 0, 1)
        expect(result).toBe(0.5);
    });
});
