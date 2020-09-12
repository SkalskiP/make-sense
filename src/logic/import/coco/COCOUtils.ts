import {COCOBBox, COCOSegmentation} from "../../../data/labels/COCO";
import {IRect} from "../../../interfaces/IRect";
import {IPoint} from "../../../interfaces/IPoint";
import {chunk} from "lodash";

export class COCOUtils {
    public static bbox2rect(bbox: COCOBBox): IRect {
        return {
            x: bbox[0],
            y: bbox[1],
            width: bbox[2],
            height: bbox[3]
        }
    }

    public static segmentation2vertices(segmentation: COCOSegmentation): IPoint[][] {
        return segmentation.map((segment: number[]) => {
            return chunk(segment, 2).map((pair: number[]) => {
                return {x: pair[0], y: pair[1]}
            })
        })
    }
}