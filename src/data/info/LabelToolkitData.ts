import {LabelType} from "../enums/LabelType";

export interface ILabelToolkit {
    labelType: LabelType;
    headerText:string;
    imageSrc:string;
    imageAlt:string;
}

export const LabelToolkitData: ILabelToolkit[] = [
    {
        labelType: LabelType.NAME,
        headerText: "Image recognition",
        imageSrc: "ico/object.png",
        imageAlt: "object",
    },
    {
        labelType: LabelType.RECTANGLE,
        headerText: "Bounding box",
        imageSrc: "ico/rectangle.png",
        imageAlt: "rectangle",
    },
    {
        labelType: LabelType.POINT,
        headerText: "Point",
        imageSrc: "ico/point.png",
        imageAlt: "point",
    },
    {
        labelType: LabelType.POLYGON,
        headerText: "Polygon",
        imageSrc: "ico/polygon.png",
        imageAlt: "polygon",
    },
];