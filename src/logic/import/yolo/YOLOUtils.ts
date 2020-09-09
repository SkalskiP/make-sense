import {LabelName, LabelRect} from "../../../store/labels/types";
import {LabelUtil} from "../../../utils/LabelUtil";
import {AnnotationsParsingError, LabelNamesNotUniqueError} from "./YOLOErrors";
import {ArrayUtil} from "../../../utils/ArrayUtil";
import {ISize} from "../../../interfaces/ISize";

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

    public static parseYOLOAnnotationsFromString(
        rawAnnotations: string,
        labelNames: LabelName[],
        imageSize: ISize,
        imageName: string
    ): LabelRect[] {
        return rawAnnotations
            .split(/[\r\n]/)
            .filter(Boolean)
            .map((rawAnnotation: string) => YOLOUtils.parseYOLOAnnotationFromString(
                rawAnnotation, labelNames, imageSize, imageName
            ))
    }

    public static parseYOLOAnnotationFromString(
        rawAnnotation: string,
        labelNames: LabelName[],
        imageSize: ISize,
        imageName: string
    ): LabelRect {
        const components = rawAnnotation.split(" ");
        if (!YOLOUtils.validateYOLOAnnotationComponents(components, labelNames.length)) {
            throw new AnnotationsParsingError(imageName);
        }
        const labelIndex: number = parseInt(components[0]);
        const labelId: string = labelNames[labelIndex].id;
        const rectX: number = parseFloat(components[1]);
        const rectY: number = parseFloat(components[2]);
        const rectWidth: number = parseFloat(components[3]);
        const rectHeight: number = parseFloat(components[4]);
        const rect = {
            x: rectX * imageSize.width,
            y: rectY * imageSize.height,
            width: rectWidth * imageSize.width,
            height: rectHeight * imageSize.height
        }
        return LabelUtil.createLabelRect(labelId, rect);
    }

    public static validateYOLOAnnotationComponents(components: string[], labelNamesCount: number): boolean {
        const validateCoordinateValue = (rawValue: string): boolean => {
            const floatValue: number = parseFloat(rawValue);
            return !!floatValue &&  0.0 <= floatValue && floatValue <= 1.0;
        }
        const validateLabelIdx = (rawValue: string): boolean => {
            const intValue: number = parseInt(rawValue);
            return !isNaN(intValue) && 0 <= intValue && intValue < labelNamesCount;
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