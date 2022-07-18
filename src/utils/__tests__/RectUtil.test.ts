import {RectUtil} from '../RectUtil';
import {IRect} from '../../interfaces/IRect';
import {IPoint} from '../../interfaces/IPoint';
import {ISize} from '../../interfaces/ISize';

describe('RectUtil getRatio method', () => {
    it('should return correct value of rect ratio', () => {
        // given
        const rect: IRect = {x: 0, y: 0, width: 10, height: 5};
        // when
        const result = RectUtil.getRatio(rect)
        // then
        expect(result).toBe(2);
    });

    it('should return null', () => {
        expect(RectUtil.getRatio(null)).toBe(null);
    });
});

describe('RectUtil getCenter method', () => {
    it('should return correct center value', () => {
        // given
        const rect: IRect = {x: 0, y: 0, width: 10, height: 20};
        const expectedResult: IPoint = {x: 5, y: 10};
        // when
        const result = RectUtil.getCenter(rect)
        // then
        expect(result).toMatchObject(expectedResult);
    })
})

describe('RectUtil getSize method', () => {
    it('should return correct size value', () => {
        // given
        const rect: IRect = {x: 0, y: 0, width: 10, height: 20};
        const expectedSize: ISize = {width: 10, height: 20};
        // when
        const result = RectUtil.getSize(rect)
        // then
        expect(result).toMatchObject(expectedSize);
    })
})
