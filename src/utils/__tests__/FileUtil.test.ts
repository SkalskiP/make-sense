import {FileUtil} from "../FileUtil";

describe('FileUtil extractFileExtension method', () => {
    it('should return file extension', () => {
        // given
        const name: string = "labels.txt";

        // when
        const result = FileUtil.extractFileExtension(name);

        // then
        const expectedResult = "txt";
        expect(result).toEqual(expectedResult);
    });

    it('should return file extension even with multiple dots', () => {
        // given
        const name: string = "custom.file-name.12.labels.txt";

        // when
        const result = FileUtil.extractFileExtension(name);

        // then
        const expectedResult = "txt";
        expect(result).toEqual(expectedResult);
    });

    it('should return null', () => {
        // given
        const name: string = "labels";

        // when
        const result = FileUtil.extractFileExtension(name);

        // then
        const expectedResult = null;
        expect(result).toEqual(expectedResult);
    });
});

describe('FileUtil extractFileName method', () => {
    it('should return file name', () => {
        // given
        const name: string = "labels.txt";

        // when
        const result = FileUtil.extractFileName(name);

        // then
        const expectedResult = "labels";
        expect(result).toEqual(expectedResult);
    });

    it('should return file name even with multiple dots', () => {
        // given
        const name: string = "custom.file-name.12.labels.txt";

        // when
        const result = FileUtil.extractFileName(name);

        // then
        const expectedResult = "custom.file-name.12.labels";
        expect(result).toEqual(expectedResult);
    });
});