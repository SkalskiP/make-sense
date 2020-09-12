import {AIActions} from "../../actions/AIActions";

describe('AIActions excludeRejectedLabelNames method', () => {
    it('should return list with correct values', () => {
        // GIVEN
        const suggestedLabels: string[] = [
            "label_1",
            "label_2",
            "label_3",
            "label_4",
        ];

        const rejectedLabels: string[] = [
            "label_3",
            "label_4",
            "label_5",
        ];

        // WHEN
        const excludedLabels: string[] = AIActions.excludeRejectedLabelNames(suggestedLabels, rejectedLabels);

        // THEN
        const expectedLabels: string[] = [
            "label_1",
            "label_2",
        ];
        expect(excludedLabels.toString()).toBe(expectedLabels.toString());
    });
});