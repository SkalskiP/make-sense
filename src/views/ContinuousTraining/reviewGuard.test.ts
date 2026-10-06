import {canRefresh,signature} from './reviewGuard';
import {ImageData} from '../../store/labels/types';
const im={id:'image',fileData:{name:'scan.png'},labelRects:[{labelId:'tyre',rect:{x:1,y:2,width:3,height:4}}]} as ImageData;
it('allows only untouched unreviewed inactive images',()=>{
    const baseline={[im.id]:signature(im)};
    expect(canRefresh(im,{},'other',new Set(),baseline)).toBe(true);
    expect(canRefresh(im,{'scan.png':'train'},'other',new Set(),baseline)).toBe(false);
    expect(canRefresh(im,{},im.id,new Set(),baseline)).toBe(false);
    expect(canRefresh(im,{},'other',new Set([im.id]),baseline)).toBe(false);
    expect(canRefresh(im,{},'other',new Set(),{})).toBe(false);
});
it('rejects an image edited while predictions were in flight',()=>{
    const baseline={[im.id]:signature(im)};
    const edited={...im,labelRects:im.labelRects.map(b=>({...b,rect:{...b.rect,x:20}}))};
    expect(canRefresh(edited,{},'other',new Set(),baseline)).toBe(false);
});
it('protects locally approved images even when the server never saw them',()=>{
    const baseline={[im.id]:signature(im)};
    expect(canRefresh(im,{},'other',new Set(),baseline,name=>name==='scan.png')).toBe(false);
    expect(canRefresh(im,{},'other',new Set(),baseline,()=>false)).toBe(true);
});
it('allows empty predictions to replace untouched boxes but never treats emptiness as review',()=>{
    const empty={...im,labelRects:[]};
    expect(canRefresh(empty,{},'other',new Set(),{[im.id]:signature(empty)})).toBe(true);
    expect(canRefresh(empty,{'scan.png':'train'},'other',new Set(),{[im.id]:signature(empty)})).toBe(false);
});
