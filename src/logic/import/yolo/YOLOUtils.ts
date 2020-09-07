import {LabelName} from "../../../store/labels/types";
import {LabelUtil} from "../../../utils/LabelUtil";
import {LabelNamesNotUniqueError} from "./YOLOErrors";
import {ArrayUtil} from "../../../utils/ArrayUtil";

export class YOLOUtils {
    public static parseLabelsNamesFromString(content: string): LabelName[] {
        const labelNames: string[] = content
            .split(/[\r\n]/)
            .filter(Boolean)
            .map((name: string) => name.replace(/\s/g, ""))

        if (ArrayUtil.unique(labelNames).length !== labelNames.length) {
            throw new LabelNamesNotUniqueError()
        }

        return labelNames
            .map((name: string) => LabelUtil.createLabelName(name))
    }

    public static loadLabelsList(fileData: File, onSuccess: (labels: LabelName[]) => any, onFailure: () => any) {
        const reader = new FileReader();
        reader.onloadend = function (evt: any) {
            const content: string = evt.target.result;
            const labelNames = YOLOUtils.parseLabelsNamesFromString(content);
            onSuccess(labelNames);
        };
        reader.onerror = () => onFailure();
        reader.readAsText(fileData);
    }
}