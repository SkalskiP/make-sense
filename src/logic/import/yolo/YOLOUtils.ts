import {LabelName, LabelRect} from "../../../store/labels/types";
import {LabelUtil} from "../../../utils/LabelUtil";
import {AnnotationsParsingError, LabelNamesNotUniqueError} from "./YOLOErrors";
import {ArrayUtil} from "../../../utils/ArrayUtil";
import {ISize} from "../../../interfaces/ISize";
import {ProjectType} from "../../../data/enums/ProjectType";

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

    // public static parseYOLOAnnotationsFromString(content: string, labelNames: LabelName[], fileName: string): LabelRect[] {
    //     const labelRect = content
    //         .split(/[\r\n]/)
    //         .filter(Boolean)
    //     return []
    // }

    // public static parseYOLOAnnotationFromString(
    //     content: string,
    //     labelNames: LabelName[],
    //     imageSize: ISize,
    //     imageName: string
    // ): LabelRect {
    //     const components = content.split(" ");
    //     if (components.length !== 5) {
    //         throw new AnnotationsParsingError(imageName);
    //     }
    // }

    public static validateYOLOAnnotationComponents(components: string[], labelNamesCount: number): boolean {
        const validateCoordinateValue = (rawValue: string): boolean => {
            const floatValue: number = parseFloat(rawValue);
            return !!floatValue &&  0.0 <= floatValue && floatValue <= 1.0;
        }
        const validateLabelIdx = (rawValue: string): boolean => {
            const intValue: number = parseInt(rawValue);
            return !!intValue && 0 <= intValue && intValue < labelNamesCount;
        }
        return [
            components.length === 5,
            validateLabelIdx(components[0]),
            validateCoordinateValue(components[1]),
            validateCoordinateValue(components[2]),
            validateCoordinateValue(components[3]),
            validateCoordinateValue(components[4])
        ].every(Boolean)
    }
}