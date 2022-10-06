
import { ImageData, LabelName, LabelRect} from '../../../../store/labels/types';
import { AcceptedFileType } from '../../../../data/enums/AcceptedFileType';
import { v4 as uuidv4 } from 'uuid';
import { VOCImporter } from '../../../import/voc/VOCImporter';
import { isEqual } from 'lodash';

const getDummyImageData = (fileName: string): ImageData => {
    return {
        id: uuidv4(),
        fileData: new File([''], fileName, { type: AcceptedFileType.IMAGE }),
        loadStatus: true,
        labelRects: [],
        labelPoints: [],
        labelLines: [],
        labelPolygons: [],
        labelNameIds: [],
        isVisitedByYOLOObjectDetector: false,
        isVisitedBySSDObjectDetector: false,
        isVisitedByPoseDetector: false
    };
};

const getDummyFileData = (fileName: string): File => {
    return new File([''], fileName, { type: AcceptedFileType.TEXT });
};

class TestableVOCImporter extends VOCImporter {
    public static testableParseAnnotationsFromFileString(document: Document, labelNames: Record<string, LabelName>)
    :[LabelRect[], Record<string, LabelName>] {
        return TestableVOCImporter.parseAnnotationsFromFileString(document, labelNames);
    }
}

const parser = new DOMParser();
const validTestDocument = parser.parseFromString(
    `
    <annotation>
        <filename>test1.jpeg</filename>
        <path>\\some-test-path\\test1.jpeg</path>
        <size>
            <width>100</width>
            <height>200</height>
            <depth>3</depth>
        </size>
        <segmented>0</segmented>
        <object>
            <name>annotation1</name>
            <pose>Unspecified</pose>
            <truncated>0</truncated>
            <difficult>0</difficult>
            <bndbox>
                <xmin>10</xmin>
                <ymin>20</ymin>
                <xmax>30</xmax>
                <ymax>50</ymax>
            </bndbox>
        </object>
        <object>
            <name>annotation2</name>
            <pose>Unspecified</pose>
            <truncated>0</truncated>
            <difficult>0</difficult>
            <bndbox>
                <xmin>20</xmin>
                <ymin>30</ymin>
                <xmax>30</xmax>
                <ymax>50</ymax>
            </bndbox>
        </object>    
    </annotation>
    `,
    'application/xml'
);

describe('VOCImporter parseAnnotationsFromFileString method', () => {
    it('should return correctly for multiple annotations', () => {
        // given
        const emptyRecordSet: Record<string, LabelName> = {};

        // when
        const [annotations, newRecordSet] = TestableVOCImporter.testableParseAnnotationsFromFileString(validTestDocument, emptyRecordSet);

        // then
        expect(Object.keys(emptyRecordSet).length).toBe(0);
        expect(newRecordSet).toEqual(expect.objectContaining({
            'annotation1': expect.objectContaining({ name: 'annotation1'}),
            'annotation2': expect.objectContaining({ name: 'annotation2'}),
        }))
        expect(annotations).toEqual([
            expect.objectContaining({
                rect: {
                    x: 10,
                    y: 20,
                    height: 30,
                    width: 20
                },
                labelId: newRecordSet['annotation1'].id
            }),
            expect.objectContaining({
                rect: {
                    x: 20,
                    y: 30,
                    height: 20,
                    width: 10
                },
                labelId: newRecordSet['annotation2'].id
            })
        ]);
    });

    it('should reuse existing labels', () => {
        // given
        const existingRecordSet: Record<string, LabelName> = {
            'annotation2': {
                id: 'foobar',
                name: 'annotation2'
            }
        };

        // when
        const [annotations, newRecordSet] = TestableVOCImporter.testableParseAnnotationsFromFileString(validTestDocument, existingRecordSet);

        // then
        expect(Object.keys(existingRecordSet).length).toBe(1);
        expect(newRecordSet).toEqual(expect.objectContaining({
            'annotation1': expect.objectContaining({ name: 'annotation1' }),
            'annotation2': expect.objectContaining({ name: 'annotation2', id: 'foobar' }),
        }));
        expect(annotations.length).toBe(2);
        expect(annotations).toEqual(expect.arrayContaining([
            expect.objectContaining({
                labelId: 'foobar'
            })
        ]));
    });
});
