import {EditorActions} from '../EditorActions';
import {EditorModel} from '../../../staticModels/EditorModel';

describe('EditorActions.canRender', () => {
    const prior = EditorModel.image;
    afterEach(() => {
        EditorModel.image = prior;
    });
    it('is false while the active image blob is still loading (resumed project)', () => {
        EditorModel.image = undefined;
        expect(EditorActions.canRender()).toBe(false);
    });
    it('is true once the active image is set', () => {
        EditorModel.image = {width: 100, height: 100} as HTMLImageElement;
        expect(EditorActions.canRender()).toBe(true);
    });
});
