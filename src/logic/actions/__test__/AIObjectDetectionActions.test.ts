import {LabelName} from "../../../store/labels/types";
import {DetectedObject} from "@tensorflow-models/coco-ssd";
import {AIObjectDetectionActions} from "../AIObjectDetectionActions";

describe('AIObjectDetectionActions extractNewSuggestedLabelNames method', () => {
    const mockLabelNames: LabelName[] = [
        {
            id: "id_1",
            name: "label_1"
        },
        {
            id: "id_2",
            name: "label_2"
        },
        {
            id: "id_3",
            name: "label_3"
        }
    ];

    it('should return list with correct values', () => {
        // GIVEN
        const labelNames: LabelName[] = mockLabelNames;
        const predictions: DetectedObject[] = [
            {
                bbox: [],
                class: "label_3",
                score: 0
            },
            {
                bbox: [],
                class: "label_4",
                score: 0
            },
            {
                bbox: [],
                class: "label_5",
                score: 0
            }
        ];

        // WHEN
        const suggestedLabels: string[] = AIObjectDetectionActions.extractNewSuggestedLabelNames(labelNames, predictions);

        // THEN
        expect(suggestedLabels.toString()).toBe(["label_4", "label_5"].toString());
    });

    it('should return empty list', () => {
        // GIVEN
        const labelNames: LabelName[] = mockLabelNames;
        const predictions: DetectedObject[] = [
            {
                bbox: [],
                class: "label_3",
                score: 0
            },
            {
                bbox: [],
                class: "label_1",
                score: 0
            }
        ];

        // WHEN
        const suggestedLabels: string[] = AIObjectDetectionActions.extractNewSuggestedLabelNames(labelNames, predictions);

        // THEN
        expect(suggestedLabels.toString()).toBe([].toString());
    });
});