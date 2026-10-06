import {LabelType} from '../data/enums/LabelType';
import {CANVAS_TOOLS, resolveTool} from './tools';

describe('resolveTool', () => {
    it('prefers pan while image drag mode is on', () => {
        expect(resolveTool(LabelType.RECT, true)).toBe('pan');
    });
    it('resolves drawing tools from the active label type', () => {
        expect(resolveTool(LabelType.RECT, false)).toBe('box');
        expect(resolveTool(LabelType.POLYGON, false)).toBe('polygon');
        expect(resolveTool(LabelType.LINE, false)).toBe('line');
    });
    it('falls back to select for non-drawing label types', () => {
        expect(resolveTool(LabelType.POINT, false)).toBe('select');
        expect(resolveTool(LabelType.IMAGE_RECOGNITION, false)).toBe('select');
    });
    it('documents every tool with a label', () => {
        for (const tool of CANVAS_TOOLS) {
            expect(tool.label.length).toBeGreaterThan(0);
        }
    });
});
