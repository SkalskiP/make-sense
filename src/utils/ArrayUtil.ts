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

    public static match<T, P>(keys: T[], values: P[], predicate: (key: T, value: P) => boolean): [T, P[]][] {
        return keys.reduce((acc: [T, P[]][], key: T) => {
            acc.push([key, values.filter((value: P) => predicate(key, value))])
            return acc
        }, [])
    }
}