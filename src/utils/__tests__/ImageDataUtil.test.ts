import {ImageData} from "../../store/labels/types";
import uuidv1 from 'uuid/v1';
import {LabelUtil} from "../LabelUtil";
import {ImageDataUtil} from "../ImageDataUtil";


describe('ImageDataUtil cleanAnnotation method', () => {
    it('should return new ImageData object without annotations', () => {
        // given
        const item: ImageData = {
            id: uuidv1(),
            fileData: new File([""], "filename", { type: 'text/html' }),
            loadStatus: true,
            labelRects: [
                LabelUtil.createLabelRect('label-id', {x: 1, y: 1, width: 1, height: 1}),
                LabelUtil.createLabelRect('label-id', {x: 1, y: 1, width: 1, height: 1})
            ],
            labelPoints: [],
            labelLines: [],
            labelPolygons: [],
            labelNameIds: [],
            isVisitedByObjectDetector: false,
            isVisitedByPoseDetector: false
        }

        // when
        const result = ImageDataUtil.cleanAnnotations(item);

        // then
        expect(result.labelRects.length).toEqual(0);
        expect(item.labelRects.length).toEqual(2);
    });
});