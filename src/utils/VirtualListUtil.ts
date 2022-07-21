import {ISize} from "../interfaces/ISize";
import {IPoint} from "../interfaces/IPoint";

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

    public static calculateAnchorPoints(listSize: ISize, childSize: ISize, childCount: number): IPoint[] {
        const gridSize: ISize = VirtualListUtil.calculateGridSize(listSize, childSize, childCount);
        const contentWrapperSize: ISize = VirtualListUtil.calculateContentSize(listSize, childSize, gridSize);
        const horizontalMargin = (contentWrapperSize.width - gridSize.width * childSize.width) / (gridSize.width + 1);

        const anchors = [];
        for (let i = 0; i < childCount; i++) {
            const rowCount: number = Math.floor(i / gridSize.width);
            const columnCount: number = i % gridSize.width;

            const anchor: IPoint = {
                x: rowCount * horizontalMargin + columnCount * childSize.width,
                y: rowCount * childSize.height
            };
            anchors.push(anchor);
        }
        return anchors;
    }
}