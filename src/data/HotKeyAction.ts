export type HotKeyAction = {
    keyCombo: string[];
    action: (event: KeyboardEvent) => any;
}