import {RectUtil} from "../RectUtil";
import {IRect} from "../../interfaces/IRect";

describe('RectUtil getRatio method', () => {
    it('should return correct value of rect ratio', () => {
        const rect: IRect = {x: 0, y: 0, width: 10, height: 5};
        expect(RectUtil.getRatio(rect)).toBe(2);
    });

    it('should return null', () => {
        expect(RectUtil.getRatio(null)).toBe(null);
    });
});