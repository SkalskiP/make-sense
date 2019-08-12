import {store} from "..";

export class ExportUtil {
    public static getProjectName(): string {
        return store.getState().editor.projectName
            .toLowerCase()
            .replace(' ', '-')
            .replace('<', '&lt;')
            .replace('>', '&gt;')
            .replace('&', '&amp;')
            .replace("'", '&#39;')
            .replace("/", '&#x2F;')
    }
}