import {RectUtil} from '../RectUtil';
import {ILine} from '../../interfaces/ILine';
import {LineUtil} from '../LineUtil';
import {IPoint} from '../../interfaces/IPoint';

describe('LineUtil getCenter method', () => {
    it('should return correct value for horizontal line', () => {
        const givenLine: ILine = {
            start: {x: -10, y: 0},
            end: {x: 10, y: 0},
        };
        const expectedPoint: IPoint = {
            x: 0,
            y: 0
        };
        expect(LineUtil.getCenter(givenLine)).toEqual(expectedPoint);
    });

    it('should return correct value for vertical line', () => {
        const givenLine: ILine = {
            start: {x: 1, y: 0},
            end: {x: 1, y: 5},
        };
        const expectedPoint: IPoint = {
            x: 1,
            y: 2.5
        };
        expect(LineUtil.getCenter(givenLine)).toEqual(expectedPoint);
    });

    it('should return correct value for biased line', () => {
        const givenLine: ILine = {
            start: {x: 0, y: 0},
            end: {x: -10, y: -5},
        };
        const expectedPoint: IPoint = {
            x: -5,
            y: -2.5
        };
        expect(LineUtil.getCenter(givenLine)).toEqual(expectedPoint);
    });

    it('should return null', () => {
        expect(RectUtil.getRatio(null)).toBe(null);
    });
});

describe('LineUtil getDistanceFromLine method', () => {
    it('should return correct value for horizontal line', () => {
        const givenLine: ILine = {
            start: {x: -10, y: 0},
            end: {x: 10, y: 0},
        };
        const givenPoint: IPoint = {
            x: 0,
            y: 3
        };
        const expectedDistance: number = 3;
        expect(LineUtil.getDistanceFromLine(givenLine, givenPoint)).toBe(expectedDistance);
    });

    it('should return correct value for vertical line', () => {
        const givenLine: ILine = {
            start: {x: 1, y: 0},
            end: {x: 1, y: 5},
        };
        const givenPoint: IPoint = {
            x: 10,
            y: 2.5
        };
        const expectedDistance: number = 9;
        expect(LineUtil.getDistanceFromLine(givenLine, givenPoint)).toBe(expectedDistance);
    });

    it('should return correct value for biased line', () => {
        const givenLine: ILine = {
            start: {x: 0, y: 0},
            end: {x: 8, y: 6},
        };
        const givenPoint: IPoint = {
            x: 1,
            y: 7
        };
        const expectedDistance: number = 5;
        expect(LineUtil.getDistanceFromLine(givenLine, givenPoint)).toBe(expectedDistance);
    });

    it('should return null', () => {
        const givenLine: ILine = {
            start: {x: 1, y: 0},
            end: {x: 1, y: 0},
        };
        const givenPoint: IPoint = {
            x: 10,
            y: 2.5
        };

        expect(LineUtil.getDistanceFromLine(givenLine, givenPoint)).toBe(null);
    });
});