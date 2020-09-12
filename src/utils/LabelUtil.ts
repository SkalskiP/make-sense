import {LabelName, LabelPolygon, LabelRect} from "../store/labels/types";
import uuidv4 from 'uuid/v4';
import {find} from "lodash";
import {IRect} from "../interfaces/IRect";
import {LabelStatus} from "../data/enums/LabelStatus";
import {IPoint} from "../interfaces/IPoint";

export class LabelUtil {
    public static createLabelName(name: string): LabelName {
        return {
            id: uuidv4(),
            name: name
        }
    }

    public static createLabelRect(labelId: string, rect: IRect): LabelRect {
        return {
            id: uuidv4(),
            labelId: labelId,
            rect,
            isCreatedByAI: false,
            status: LabelStatus.ACCEPTED,
            suggestedLabel: null
        }
    }

    public static createLabelPolygon(labelId: string, vertices: IPoint[]): LabelPolygon {
        return {
            id: uuidv4(),
            labelId: labelId,
            vertices: vertices
        }
    }

    public static convertLabelNamesListToMap(labelNames: LabelName[]): any {
        return labelNames.reduce((map: any, labelNameRecord: LabelName) => {
            map[labelNameRecord.id] = labelNameRecord.name;
            return map;
        }, {})
    }

    public static convertMapToLabelNamesList(object: any): LabelName[] {
        const labelNamesList: LabelName[] = [];
        Object.keys(object).forEach((key) => {
            if (!!object[key]) {
                labelNamesList.push({
                    id: key,
                    name: object[key]
                })
            }
        });
        return labelNamesList;
    }

    public static labelNamesIdsDiff(oldLabelNames: LabelName[], newLabelNames: LabelName[]): string[] {
        return oldLabelNames.reduce((missingIds: string[], labelName: LabelName) => {
            if (!find(newLabelNames, { 'id': labelName.id })) {
                missingIds.push(labelName.id);
            }
            return missingIds
        }, [])
    }
}