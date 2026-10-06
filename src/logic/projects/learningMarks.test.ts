import {isReviewedFile, reviewedFileNames, syncReviewedFiles} from './learningMarks';

describe('learningMarks', () => {
    it('reports files as unreviewed until synced', () => {
        expect(isReviewedFile('never-seen-scan.png')).toBe(false);
    });
    it('syncs only newly seen files', () => {
        expect(syncReviewedFiles(['scan-a.png', 'scan-b.png'])).toEqual(['scan-a.png', 'scan-b.png']);
        expect(syncReviewedFiles(['scan-a.png', 'scan-c.png'])).toEqual(['scan-c.png']);
        expect(isReviewedFile('scan-a.png')).toBe(true);
        expect(isReviewedFile('scan-b.png')).toBe(true);
    });
    it('persists reviewed files across module reloads', async () => {
        syncReviewedFiles(['persisted-scan.png']);
        expect(reviewedFileNames()).toContain('persisted-scan.png');
        expect(JSON.parse(localStorage.getItem('make-sense-reviewed-files')).length)
            .toBeGreaterThan(0);
        jest.resetModules();
        const reloaded = await import('./learningMarks');
        expect(reloaded.isReviewedFile('persisted-scan.png')).toBe(true);
    });
});
