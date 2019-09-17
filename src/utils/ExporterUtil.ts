import moment from 'moment';
import {GeneralSelector} from "../store/selectors/GeneralSelector";

export class ExporterUtil {
    public static getExportFileName(): string {
        const projectName: string = GeneralSelector.getProjectName();
        const date: string = moment().format('YYYYMMDDhhmmss');
        return `labels_${projectName}_${date}`
    }
}