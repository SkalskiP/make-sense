import {ISize} from "../interfaces/ISize";

export class VirtualListUtil {
    public static calculateGridSize(listSize: ISize, childSize: ISize, childCount: number): ISize {
        const columnCount: number = Math.floor(listSize.width / childSize.width);
        const rowCount: number = Math.ceil(childCount / columnCount);
        return {width: columnCount, height: rowCount};
    }

    public static calculateContentSize(listSize: ISize, childSize: ISize, gridSize: ISize): ISize {
        const sizeFromGrid:ISize = {
            width: childSize.width * gridSize.width,
            height: childSize.height * gridSize.height
        };

        return {
            width: Math.max(listSize.width, sizeFromGrid.width),
            height: sizeFromGrid.height
        }
    }
}