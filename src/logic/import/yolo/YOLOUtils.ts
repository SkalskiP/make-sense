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
}