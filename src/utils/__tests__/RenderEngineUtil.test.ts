import {ILine} from '../../interfaces/ILine';
import {IPoint} from '../../interfaces/IPoint';
import {RenderEngineUtil} from '../RenderEngineUtil';

describe('RenderEngineUtil.isMouseOverLine tests', () => {
    test('return true when mouse directly over start point', () => {
        // given
        const mouse: IPoint = { x: 10, y: 10 };
        const line: ILine = {
            start: { x: 10, y: 10 },
            end: { x: 10, y: 20 }
        }
        const radius = 1;

        // when
        const result = RenderEngineUtil.isMouseOverLine(mouse, line, radius);

        // then
        expect(result).toBe(true);
    });

    test('return true when mouse directly over end point', () => {
        // given
        const mouse: IPoint = { x: 10, y: 20 };
        const line: ILine = {
            start: { x: 10, y: 10 },
            end: { x: 10, y: 20 }
        }
        const radius = 1;

        // when
        const result = RenderEngineUtil.isMouseOverLine(mouse, line, radius);

        // then
        expect(result).toBe(true);
    });

    test('return true when mouse within radius from start point vertically', () => {
        // given
        const mouse: IPoint = { x: 10, y: 10 - 0.99 };
        const line: ILine = {
            start: { x: 10, y: 10 },
            end: { x: 10, y: 20 }
        }
        const radius = 1;

        // when
        const result = RenderEngineUtil.isMouseOverLine(mouse, line, radius);

        // then
        expect(result).toBe(true);
    });

    test('return false when mouse outside radius from start point vertically', () => {
        // given
        const mouse: IPoint = { x: 10, y: 10 - 1.01 };
        const line: ILine = {
            start: { x: 10, y: 10 },
            end: { x: 10, y: 20 }
        }
        const radius = 1;

        // when
        const result = RenderEngineUtil.isMouseOverLine(mouse, line, radius);

        // then
        expect(result).toBe(false);
    });

    test('return true when mouse within radius from start point horizontally', () => {
        // given
        const mouse: IPoint = { x: 10 - 0.99, y: 10 };
        const line: ILine = {
            start: { x: 10, y: 10 },
            end: { x: 10, y: 20 }
        }
        const radius = 1;

        // when
        const result = RenderEngineUtil.isMouseOverLine(mouse, line, radius);

        // then
        expect(result).toBe(true);
    });

    test('return false when mouse outside radius from start point horizontally', () => {
        // given
        const mouse: IPoint = { x: 10 - 1.01, y: 10 };
        const line: ILine = {
            start: { x: 10, y: 10 },
            end: { x: 10, y: 20 }
        }
        const radius = 1;

        // when
        const result = RenderEngineUtil.isMouseOverLine(mouse, line, radius);

        // then
        expect(result).toBe(false);
    });

    test('return true when mouse within radius from end point vertically', () => {
        // given
        const mouse: IPoint = { x: 10, y: 20 + 0.99 };
        const line: ILine = {
            start: { x: 10, y: 10 },
            end: { x: 10, y: 20 }
        }
        const radius = 1;

        // when
        const result = RenderEngineUtil.isMouseOverLine(mouse, line, radius);

        // then
        expect(result).toBe(true);
    });

    test('return false when mouse outside radius from end point vertically', () => {
        // given
        const mouse: IPoint = { x: 10, y: 20 + 1.01 };
        const line: ILine = {
            start: { x: 10, y: 10 },
            end: { x: 10, y: 20 }
        }
        const radius = 1;

        // when
        const result = RenderEngineUtil.isMouseOverLine(mouse, line, radius);

        // then
        expect(result).toBe(false);
    });

    test('return true when mouse within radius from end point horizontally', () => {
        // given
        const mouse: IPoint = { x: 10 - 0.99, y: 20 };
        const line: ILine = {
            start: { x: 10, y: 10 },
            end: { x: 10, y: 20 }
        }
        const radius = 1;

        // when
        const result = RenderEngineUtil.isMouseOverLine(mouse, line, radius);

        // then
        expect(result).toBe(true);
    });

    test('return false when mouse outside radius from end point horizontally', () => {
        // given
        const mouse: IPoint = { x: 10 - 1.01, y: 20 };
        const line: ILine = {
            start: { x: 10, y: 10 },
            end: { x: 10, y: 20 }
        }
        const radius = 1;

        // when
        const result = RenderEngineUtil.isMouseOverLine(mouse, line, radius);

        // then
        expect(result).toBe(false);
    });

    test('return true when mouse within radius from line horizontally', () => {
        // given
        const mouse: IPoint = { x: 10 - 0.99, y: 15 };
        const line: ILine = {
            start: { x: 10, y: 10 },
            end: { x: 10, y: 20 }
        }
        const radius = 1;

        // when
        const result = RenderEngineUtil.isMouseOverLine(mouse, line, radius);

        // then
        expect(result).toBe(true);
    });

    test('return false when mouse outside radius from line horizontally', () => {
        // given
        const mouse: IPoint = { x: 10 - 1.01, y: 15 };
        const line: ILine = {
            start: { x: 10, y: 10 },
            end: { x: 10, y: 20 }
        }
        const radius = 1;

        // when
        const result = RenderEngineUtil.isMouseOverLine(mouse, line, radius);

        // then
        expect(result).toBe(false);
    });

    test('return true when mouse within radius from line vertically', () => {
        // given
        const mouse: IPoint = { x: 15, y: 10 - 0.99 };
        const line: ILine = {
            start: { x: 10, y: 10 },
            end: { x: 20, y: 10 }
        }
        const radius = 1;

        // when
        const result = RenderEngineUtil.isMouseOverLine(mouse, line, radius);

        // then
        expect(result).toBe(true);
    });

    test('return false when mouse outside radius from line vertically', () => {
        // given
        const mouse: IPoint = { x: 15, y: 10 - 1.01 };
        const line: ILine = {
            start: { x: 10, y: 10 },
            end: { x: 20, y: 10 }
        }
        const radius = 1;

        // when
        const result = RenderEngineUtil.isMouseOverLine(mouse, line, radius);

        // then
        expect(result).toBe(false);
    });
});
