import {LabelType} from '../data/enums/LabelType';

// Canvas tools. Select is the default: hover, click, drag, resize and delete
// work through direct manipulation without switching tools.
export type CanvasToolId = 'select' | 'box' | 'polygon' | 'line' | 'pan';

export type CanvasToolDef = {
    id: CanvasToolId;
    label: string;
    shortcut: string;
    // Label type activated when drawing with this tool; null for non-drawing tools.
    labelType: LabelType | null;
};

export const CANVAS_TOOLS: CanvasToolDef[] = [
    {id: 'select', label: 'Select', shortcut: 'V', labelType: null},
    {id: 'box', label: 'Bounding box', shortcut: 'B', labelType: LabelType.RECT},
    {id: 'polygon', label: 'Polygon', shortcut: null, labelType: LabelType.POLYGON},
    {id: 'line', label: 'Line', shortcut: null, labelType: LabelType.LINE},
    {id: 'pan', label: 'Pan', shortcut: null, labelType: null},
];

export function resolveTool(activeLabelType: LabelType, imageDragMode: boolean): CanvasToolId {
    if (imageDragMode) return 'pan';
    const drawing = CANVAS_TOOLS.find(tool => tool.labelType !== null && tool.labelType === activeLabelType);
    return drawing ? drawing.id : 'select';
}
