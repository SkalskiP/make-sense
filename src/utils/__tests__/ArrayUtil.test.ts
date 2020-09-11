import {ArrayUtil} from "../ArrayUtil";

describe('ArrayUtil partition method', () => {
    it('should return empty PartitionResult if array is empty', () => {
        // when
        const result = ArrayUtil.partition([], (item: any) => true)

        // then
        expect(result.pass.length).toEqual(0);
        expect(result.fail.length).toEqual(0);
    });

    it('should pass even numbers and fail odd numbers', () => {
        // given
        const items = [1, 2, 3, 4, 5, 6]
        const predicate = (item: number) => item % 2 === 0

        // when
        const result = ArrayUtil.partition(items, predicate)

        // then
        expect(result.pass).toEqual([2, 4 ,6]);
        expect(result.fail).toEqual([1, 3, 5]);
    });

    it('should pass items with key name from list', () => {
        // given
        type MockObject = {
            name: string
        }

        const nameList = ['aaa', 'bbb', 'ccc']
        const items = [
            {name: 'aaa'},
            {name: 'aab'},
            {name: 'abb'},
            {name: 'bbb'}
        ]
        const predicate = (item: MockObject) => nameList.includes(item.name)

        // when
        const result = ArrayUtil.partition(items, predicate)

        // then
        expect(result.pass.length).toEqual(2);
        expect(result.fail.length).toEqual(2);
        expect(result.pass.map((item: MockObject) => item.name)).toEqual(['aaa', 'bbb']);
        expect(result.fail.map((item: MockObject) => item.name)).toEqual(['aab', 'abb']);
    });
});

describe('ArrayUtil match method', () => {
    it('should return empty array', () => {
        // when
        const result = ArrayUtil.match([], [], (k, v) => true)

        // then
        expect(result.length).toEqual(0);
    });

    it('should return correct array when number of keys and values is even', () => {
        // when
        const result = ArrayUtil.match([4, 2, 1, 3], [1, 2, 4, 3], (k, v) => k === v)

        // then
        const expectedResult = [[4, [4]], [2, [2]], [1, [1]], [3, [3]]];
        expect(result.length).toEqual(4);
        expect(JSON.stringify(result)).toEqual(JSON.stringify(expectedResult));
    });

    it('should return correct array when number of keys smaller than values', () => {
        // when
        const result = ArrayUtil.match(
            ["aa", "bb", "cc",],
            ["bb1", "aa2", "cc4", "cc3", "aa1", "bb2", "aa3"],
            (k, v) => v.startsWith(k))

        // then
        const expectedResult = [["aa", ["aa2", "aa1", "aa3"]], ["bb", ["bb1", "bb2"]], ["cc", ["cc4", "cc3"]]];
        expect(result.length).toEqual(3);
        expect(JSON.stringify(result)).toEqual(JSON.stringify(expectedResult));
    });
});