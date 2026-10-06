import {ImageData} from '../../store/labels/types';

export const signature=(image:ImageData)=>JSON.stringify(image.labelRects.map(b=>
    [b.labelId,b.rect.x,b.rect.y,b.rect.width,b.rect.height]));

export function canRefresh(image:ImageData, reviewed:Record<string,string>, activeId:string,
                           dirty:Set<string>, baseline:Record<string,string>,
                           isLocallyReviewed:(name:string)=>boolean=()=>false):boolean {
    return !!image && !reviewed[image.fileData.name] && !isLocallyReviewed(image.fileData.name) &&
        image.id!==activeId &&
        !dirty.has(image.id) && baseline[image.id]!==undefined && baseline[image.id]===signature(image);
}
