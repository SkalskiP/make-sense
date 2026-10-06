// Shared thumbnail marks for the YOLO26 learning loop (module singleton, not redux).
// ContinuousTraining syncs server-reviewed file names here; ImagesList reads them
// at render time. Green = approved ground truth, blue = boxes present (drafts/edits).
// Names persist in localStorage so approvals survive a refresh, including
// offline approves the training service has never seen.
const STORAGE_KEY = 'make-sense-reviewed-files';

const reviewedFiles = new Set<string>();

function persist(): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(reviewedFiles)));
    } catch {
        // Storage unavailable (private mode, quota): marks still work in memory.
    }
}

(function restore(): void {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        for (const name of JSON.parse(raw) as string[]) reviewedFiles.add(name);
    } catch {
        // Corrupt entry: start fresh rather than crash the panel.
    }
})();

export function syncReviewedFiles(names: Iterable<string>): string[] {
    const added: string[] = [];
    for (const name of names) {
        if (!reviewedFiles.has(name)) {
            reviewedFiles.add(name);
            added.push(name);
        }
    }
    if (added.length) persist();
    return added;
}

export function markReviewedFile(name: string): void {
    if (!reviewedFiles.has(name)) {
        reviewedFiles.add(name);
        persist();
    }
}

export function isReviewedFile(name: string): boolean {
    return reviewedFiles.has(name);
}

export function reviewedCount(): number {
    return reviewedFiles.size;
}

export function reviewedFileNames(): string[] {
    return Array.from(reviewedFiles);
}
