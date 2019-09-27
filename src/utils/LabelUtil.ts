import {LabelName} from "../store/labels/types";
import uuidv1 from 'uuid/v1';
import {find} from "lodash";

export class LabelUtil {
    public static mapNamesToLabelNames(name: string): LabelName {
        return {
            id: uuidv1(),
            name: name
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