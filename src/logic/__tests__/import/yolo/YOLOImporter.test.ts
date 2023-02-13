
import { ImageData } from '../../../../store/labels/types';
import { AcceptedFileType } from '../../../../data/enums/AcceptedFileType';
import { v4 as uuidv4 } from 'uuid';
import { YOLOImporter } from '../../../import/yolo/YOLOImporter';
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
        isVisitedByPoseDetector: false,
        isVisitedByRoboflowAPI: false
    };
};

const getDummyFileData = (fileName: string): File => {
    return new File([''], fileName, { type: AcceptedFileType.TEXT });
};

describe('YOLOImporter filterFilesData method', () => {
    it('should return correct fileData partition', () => {
        // given
        const imageFileNames = [
            '00000.png',
            '00001.png',
            '00002.png',
            '00003.png',
            '00004.png'
        ];
        const imagesData: ImageData[] = imageFileNames.map((fileName: string) => getDummyImageData(fileName));
        const annotationFileNames = [
            '00002.txt',
            '00003.txt',
            '00004.txt',
            '00005.txt',
            '00006.txt'
        ];
        const annotationFiles: File[] = annotationFileNames.map((fileName: string) => getDummyFileData(fileName));
        const labelFileNames = [
            'labels.txt'
        ];
        const labelFiles: File[] = labelFileNames.map((fileName: string) => getDummyFileData(fileName));
        const filesData: File[] = [...annotationFiles, ...labelFiles];
        const expectedAnnotationFileNames = [
            '00002.txt',
            '00003.txt',
            '00004.txt'
        ];

        // when
        const result = YOLOImporter.filterFilesData(filesData, imagesData);

        // then
        const resultNames = result.annotationFiles.map((item: File) => item.name);
        expect(result.labelNameFile.name).toEqual('labels.txt');
        expect(result.annotationFiles.length).toEqual(3);
        expect(isEqual(resultNames, expectedAnnotationFileNames)).toBe(true);
    });
});
