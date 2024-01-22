import { CSSHelper } from "../../helpers/CSSHelper";

describe('test make_sense', function () {
    it('test CSSHelper.getLeadingColor', function () {
        expect(CSSHelper.getLeadingColor()).toBe('#009efd');
    });
});