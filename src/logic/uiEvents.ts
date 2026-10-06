// UI-level event bus for cross-component commands that carry no payload.
// Used for sidebar toggling; review approval lives in reviewWorkflow.ts.
export const TOGGLE_SIDEBARS_EVENT = 'make-sense-toggle-sidebars';

export function requestSidebarToggle(): void {
    window.dispatchEvent(new CustomEvent(TOGGLE_SIDEBARS_EVENT));
}

export type SaveState = 'idle' | 'saving' | 'saved' | 'unsaved' | 'failed';
export const SAVE_STATUS_EVENT = 'make-sense-save-status';

export function emitSaveStatus(state: SaveState, message: string): void {
    window.dispatchEvent(new CustomEvent(SAVE_STATUS_EVENT, {detail: {state, message}}));
}

export type AIStatus = {
    connected: boolean;
    pending: number;
    threshold: number;
    training: boolean;
    latest: string | null;
};
export const AI_STATUS_EVENT = 'make-sense-ai-status';

export function emitAIStatus(status: AIStatus): void {
    window.dispatchEvent(new CustomEvent(AI_STATUS_EVENT, {detail: status}));
}
