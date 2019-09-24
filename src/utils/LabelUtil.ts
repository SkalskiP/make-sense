import {LabelName} from "../store/labels/types";
import uuidv1 from 'uuid/v1';

export class LabelUtil {
    public static mapNamesToLabelNames(name: string): LabelName {
        return {
            id: uuidv1(),
            name: name
        }
    }
}