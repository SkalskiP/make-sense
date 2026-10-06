import {ImageData} from '../../store/labels/types';

// Fired by the review bar and the `A` shortcut. ContinuousTraining listens for
// it, saves the active image as ground truth when connected, then advances to
// the next unreviewed image. Works offline too: without a service connection
// it only advances.
export const APPROVE_EVENT = 'make-sense-approve-image';

export function requestApproval(): void {
    window.dispatchEvent(new CustomEvent(APPROVE_EVENT));
}

// Wrap-around search for the next image that is not reviewed. Returns -1 when
// every image is reviewed (or the list is empty).
export function findNextUnreviewedIndex(
    fileNames: string[],
    isReviewed: (name: string) => boolean,
    fromIndex: number
): number {
    const total = fileNames.length;
    if (!total) return -1;
    for (let step = 1; step <= total; step++) {
        const index = (fromIndex + step) % total;
        if (!isReviewed(fileNames[index])) return index;
    }
    return -1;
}

export function countUnverifiedAI(image: ImageData | null | undefined): number {
    if (!image) return 0;
    return image.labelRects.filter(box => box.isCreatedByAI).length;
}

export function countManual(image: ImageData | null | undefined): number {
    if (!image) return 0;
    return image.labelRects.filter(box => !box.isCreatedByAI).length;
}

export const LOW_CONFIDENCE_THRESHOLD = 0.6;
export const ACCEPT_CONFIDENCE_THRESHOLD = 0.9;

export type AIBox = {isCreatedByAI: boolean; confidence?: number | null};

export function isLowConfidence(box: AIBox, threshold: number = LOW_CONFIDENCE_THRESHOLD): boolean {
    return box.isCreatedByAI && box.confidence != null && box.confidence < threshold;
}

// Approving a whole image verifies every box on it: AI suggestions become
// manual boxes (solid borders). Geometry is untouched.
export function withAIFlagsCleared<T extends AIBox>(boxes: T[]): T[] {
    return boxes.map(box => box.isCreatedByAI ? {...box, isCreatedByAI: false} : box);
}

// Compact canvas/panel label: "Tyre", "Tyre · 93%", "Tyre · 43% ⚠".
export function confidenceText(labelName: string, box: AIBox, showConfidence: boolean): string {
    if (!box.isCreatedByAI || box.confidence == null || !showConfidence) return labelName;
    const percent = `${Math.round(box.confidence * 100)}%`;
    return isLowConfidence(box) ? `${labelName} · ${percent} ⚠` : `${labelName} · ${percent}`;
}

// Scroll offsets that center an image-space box in the viewport. All inputs
// are plain rects/sizes, so the math stays unit-testable.
export function centerScrollForRect(
    box: {x: number; y: number; width: number; height: number},
    imageRect: {x: number; y: number; width: number; height: number},
    imageSize: {width: number; height: number},
    viewportSize: {width: number; height: number}
): {x: number; y: number} {
    const scale = imageSize.width > 0 ? imageRect.width / imageSize.width : 1;
    const centerX = imageRect.x + (box.x + box.width / 2) * scale;
    const centerY = imageRect.y + (box.y + box.height / 2) * scale;
    return {
        x: Math.max(0, centerX - viewportSize.width / 2),
        y: Math.max(0, centerY - viewportSize.height / 2),
    };
}

export type ImageFilter = 'all' | 'todo' | 'review' | 'done';
export type ImageFilterStatus = 'todo' | 'review' | 'done';

// done = approved ground truth; review = annotated but unreviewed; todo = empty.
export function imageFilterStatus(isReviewed: boolean, hasBoxes: boolean): ImageFilterStatus {
    if (isReviewed) return 'done';
    return hasBoxes ? 'review' : 'todo';
}

export function matchImageFilter(
    status: ImageFilterStatus,
    filter: ImageFilter,
    fileName: string,
    query: string
): boolean {
    if (filter !== 'all' && status !== filter) return false;
    const q = query.trim().toLowerCase();
    return !q || fileName.toLowerCase().includes(q);
}
