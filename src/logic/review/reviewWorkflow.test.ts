import {centerScrollForRect, confidenceText, countManual, countUnverifiedAI, findNextUnreviewedIndex, imageFilterStatus, isLowConfidence, matchImageFilter, withAIFlagsCleared} from './reviewWorkflow';
import {ImageData} from '../../store/labels/types';

const reviewed = new Set(['done-a.png', 'done-b.png']);
const names = ['done-a.png', 'todo-c.png', 'done-b.png', 'todo-d.png'];
const isReviewed = (name: string) => reviewed.has(name);

describe('findNextUnreviewedIndex', () => {
    it('returns the next unreviewed image after the current index', () => {
        expect(findNextUnreviewedIndex(names, isReviewed, 0)).toBe(1);
    });
    it('skips reviewed images and wraps around the end of the list', () => {
        expect(findNextUnreviewedIndex(names, isReviewed, 2)).toBe(3);
        expect(findNextUnreviewedIndex(names, isReviewed, 3)).toBe(1);
    });
    it('returns -1 when every image is reviewed or the list is empty', () => {
        expect(findNextUnreviewedIndex(names, () => true, 0)).toBe(-1);
        expect(findNextUnreviewedIndex([], isReviewed, 0)).toBe(-1);
    });
    it('returns the only image when nothing is reviewed yet', () => {
        expect(findNextUnreviewedIndex(['solo.png'], () => false, 0)).toBe(0);
    });
});

describe('issue counters', () => {
    const image = {
        labelRects: [
            {isCreatedByAI: true},
            {isCreatedByAI: true},
            {isCreatedByAI: false},
        ],
    } as ImageData;
    it('counts unverified AI and manual boxes separately', () => {
        expect(countUnverifiedAI(image)).toBe(2);
        expect(countManual(image)).toBe(1);
    });
    it('handles a missing image', () => {
        expect(countUnverifiedAI(null)).toBe(0);
        expect(countManual(undefined)).toBe(0);
    });
});

describe('confidence helpers', () => {
    it('flags AI boxes below the threshold only', () => {
        expect(isLowConfidence({isCreatedByAI: true, confidence: 0.43})).toBe(true);
        expect(isLowConfidence({isCreatedByAI: true, confidence: 0.93})).toBe(false);
        expect(isLowConfidence({isCreatedByAI: true, confidence: null})).toBe(false);
        expect(isLowConfidence({isCreatedByAI: false, confidence: 0.1})).toBe(false);
    });
    it('formats compact labels with optional confidence', () => {
        expect(confidenceText('Tyre', {isCreatedByAI: false}, true)).toBe('Tyre');
        expect(confidenceText('Tyre', {isCreatedByAI: true, confidence: 0.936}, true)).toBe('Tyre · 94%');
        expect(confidenceText('Tyre', {isCreatedByAI: true, confidence: 0.43}, true)).toBe('Tyre · 43% ⚠');
        expect(confidenceText('Tyre', {isCreatedByAI: true, confidence: 0.93}, false)).toBe('Tyre');
    });
});

describe('withAIFlagsCleared', () => {
    it('verifies every AI box while keeping manual boxes and geometry', () => {
        const boxes = [
            {isCreatedByAI: true, confidence: 0.8, rect: {x: 1, y: 2, width: 3, height: 4}},
            {isCreatedByAI: false, confidence: null, rect: {x: 5, y: 6, width: 7, height: 8}},
        ];
        const result = withAIFlagsCleared(boxes);
        expect(result[0].isCreatedByAI).toBe(false);
        expect(result[0].rect).toEqual({x: 1, y: 2, width: 3, height: 4});
        expect(result[1]).toEqual(boxes[1]);
    });
});

describe('centerScrollForRect', () => {
    it('centers the box in the viewport', () => {
        const scroll = centerScrollForRect(
            {x: 100, y: 100, width: 20, height: 20},
            {x: 0, y: 0, width: 1000, height: 500},
            {width: 2000, height: 1000},
            {width: 800, height: 600});
        expect(scroll).toEqual({x: 0, y: 0});
    });
    it('offsets large viewports without going negative', () => {
        const scroll = centerScrollForRect(
            {x: 1500, y: 800, width: 100, height: 60},
            {x: 0, y: 0, width: 2000, height: 1000},
            {width: 2000, height: 1000},
            {width: 800, height: 600});
        expect(scroll).toEqual({x: 1150, y: 530});
    });
});

describe('image filters', () => {
    it('derives todo/review/done from reviewed state and box presence', () => {
        expect(imageFilterStatus(true, true)).toBe('done');
        expect(imageFilterStatus(true, false)).toBe('done');
        expect(imageFilterStatus(false, true)).toBe('review');
        expect(imageFilterStatus(false, false)).toBe('todo');
    });
    it('matches status filters and case-insensitive filename search', () => {
        expect(matchImageFilter('review', 'all', 'scan.png', '')).toBe(true);
        expect(matchImageFilter('review', 'review', 'scan.png', '')).toBe(true);
        expect(matchImageFilter('todo', 'review', 'scan.png', '')).toBe(false);
        expect(matchImageFilter('done', 'done', 'LIEP__2023.png', 'liep')).toBe(true);
        expect(matchImageFilter('done', 'done', 'LIEP__2023.png', 'vent')).toBe(false);
    });
});
