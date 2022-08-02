import {Annotation, ImageData, LabelLine, LabelName, LabelPoint, LabelPolygon, LabelRect} from '../store/labels/types';
import {v4 as uuidv4} from 'uuid';
import {find, sample} from 'lodash';
import {IRect} from '../interfaces/IRect';
import {LabelStatus} from '../data/enums/LabelStatus';
import {IPoint} from '../interfaces/IPoint';
import {Settings} from '../settings/Settings';
import {ILine} from 'src/interfaces/ILine';

export type LabelCount = {
    point: number;
    line: number;
    polygon: number;
    rect: number;
}

export type LabelCountSummary = Record<string, LabelCount>;

export class LabelUtil {
    public static createLabelName(name: string): LabelName {
        return {
            id: uuidv4(),
            name,
            color: sample(Settings.LABEL_COLORS_PALETTE)
        }
    }

    public static createLabelRect(labelId: string | null, rect: IRect, status: LabelStatus = LabelStatus.ACCEPTED): LabelRect {
        return {
            id: uuidv4(),
            labelId,
            rect,
            isVisible: true,
            isCreatedByAI: false,
            status,
            suggestedLabel: null
        }
    }

    public static createLabelPolygon(labelId: string | null, vertices: IPoint[]): LabelPolygon {
        return {
            id: uuidv4(),
            labelId,
            vertices,
            isVisible: true
        }
    }

    public static createLabelPoint(labelId: string | null, point: IPoint, status: LabelStatus = LabelStatus.ACCEPTED): LabelPoint {
        return {
            id: uuidv4(),
            labelId,
            point,
            isVisible: true,
            isCreatedByAI: false,
            status,
            suggestedLabel: null
        }
    }

    public static createLabelLine(labelId: string | null, line: ILine): LabelLine {
        return {
            id: uuidv4(),
            labelId,
            line,
            isVisible: true
        }
    }

    public static toggleAnnotationVisibility<AnnotationType extends Annotation>(annotation: AnnotationType): AnnotationType {
        return {
            ...annotation,
            isVisible: !annotation.isVisible
        }
    }

    public static calculateLabelCountSummary(labels: LabelName[], imagesData: ImageData[]): LabelCountSummary {
        let labelCount = labels.reduce((acc: LabelCountSummary, label: LabelName) => {
            acc[label.id] = { point: 0, line: 0, polygon: 0, rect: 0}
            return acc;
        }, {});
        labelCount = imagesData.reduce((acc: LabelCountSummary, imageData: ImageData) => {
            for (const labelRect of imageData.labelRects) {
                if (labelRect.labelId !== null && labelRect.status === LabelStatus.ACCEPTED)
                    acc[labelRect.labelId].rect += 1
            }
            for (const labelPoint of imageData.labelPoints) {
                if (labelPoint.labelId !== null  && labelPoint.status === LabelStatus.ACCEPTED)
                    acc[labelPoint.labelId].point += 1
            }
            for (const labelLine of imageData.labelLines) {
                if (labelLine.labelId !== null) acc[labelLine.labelId].line += 1
            }
            for (const labelPolygon of imageData.labelPolygons) {
                if (labelPolygon.labelId !== null) acc[labelPolygon.labelId].polygon += 1
            }
            return acc;
        }, labelCount)
        return labelCount
    }

    public static calculateMissingLabelNamesIds(oldLabelNames: LabelName[], newLabelNames: LabelName[]): string[] {
        return oldLabelNames.reduce((missingIds: string[], labelName: LabelName) => {
            if (!find(newLabelNames, { 'id': labelName.id })) {
                missingIds.push(labelName.id);
            }
            return missingIds
        }, [])
    }
}
