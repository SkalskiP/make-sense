import {EditorSelector} from "../store/selectors/EditorSelector";
import moment from 'moment';

export class ExporterUtil {
    public static getExportFileName(): string {
        const projectName: string = EditorSelector.getProjectName();
        const date: string = moment().format('YYYYMMDDhhmmss');
        return `labels_${projectName}_${date}`
    }
}