import {LabelName, LabelRect} from '../../../store/labels/types';
import {LabelUtil} from '../../../utils/LabelUtil';
import {AnnotationsParsingError, LabelNamesNotUniqueError} from './YOLOErrors';
import {ISize} from '../../../interfaces/ISize';
import {uniq} from 'lodash';

export class YOLOUtils {
    public static parseLabelsNamesFromString(content: string): LabelName[] {
        const labelNames: string[] = content
            .split(/[\r\n]/)
            .filter(Boolean)
            .map((name: string) => name.replace(/\s/g, ''))

        if (uniq(labelNames).length !== labelNames.length) {
            throw new LabelNamesNotUniqueError()
        }

        return labelNames
            .map((name: string) => LabelUtil.createLabelName(name))
    }

    public static loadLabelsList(
        fileData: File,
        onSuccess: (labels: LabelName[]) => void,
        onFailure: (error: Error) => void
    ) {
        const reader = new FileReader();
        reader.onloadend = (evt: ProgressEvent<FileReader>) => {
            try {
                const content: string = evt.target.result as string;
                const labelNames = YOLOUtils.parseLabelsNamesFromString(content);
                onSuccess(labelNames);
            } catch (error) {
                onFailure(error as Error)
            }
        };
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
            ));
    }

    public static parseYOLOAnnotationFromString(
        rawAnnotation: string,
        labelNames: LabelName[],
        imageSize: ISize,
        imageName: string
    ): LabelRect {
        const components = rawAnnotation.split(' ');
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
            x: (rectX - rectWidth /2) * imageSize.width,
            y: (rectY - rectHeight /2) * imageSize.height,
            width: rectWidth * imageSize.width,
            height: rectHeight * imageSize.height
        }
        return LabelUtil.createLabelRect(labelId, rect);
    }

    public static validateYOLOAnnotationComponents(components: string[], labelNamesCount: number): boolean {
        const validateCoordinateValue = (rawValue: string): boolean => {
            const floatValue: number = Number(rawValue);
            return !isNaN(floatValue) && 0.0 <= floatValue && floatValue <= 1.0;
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
