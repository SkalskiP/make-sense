import {ImageData, LabelName} from '../../store/labels/types';
import {LabelType} from '../../data/enums/LabelType';

export type ImportResult = {
    imagesData: ImageData[]
    labelNames: LabelName[]
}

export class AnnotationImporter {
    public labelType: LabelType[]

    constructor(labelType: LabelType[]) {
        this.labelType = labelType;
    }

    public import(
        filesData: File[],
        onSuccess: (imagesData: ImageData[], labelNames: LabelName[]) => any,
        onFailure: (error?:Error) => any
    ): void {
        throw new Error('Method not implemented.');
    }
}