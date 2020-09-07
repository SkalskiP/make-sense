export type PartitionResult<T> = {
    pass: T[]
    fail: T[]
}

export class ArrayUtil {
    public static partition<T>(array: T[], predicate: (T) => boolean): PartitionResult<T> {
        return array.reduce((acc: PartitionResult<T>, item: T) => {
            if (predicate(item))
                acc.pass.push(item)
            else
                acc.fail.push(item)
            return acc
        }, {pass: [], fail: []})
    }

    public static unique<T>(array: T[]): T[] {
        return [...new Set(array)];
    }
}