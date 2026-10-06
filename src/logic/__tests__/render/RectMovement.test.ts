import {RectRenderEngine} from '../../render/RectRenderEngine';
import {LabelsSelector} from '../../../store/selectors/LabelsSelector';
import {store} from '../../..';
import {EditorData} from '../../../data/EditorData';
import {LabelStatus} from '../../../data/enums/LabelStatus';
jest.mock('../../..', () => ({store: {dispatch: jest.fn()}}));
jest.mock('../../actions/EditorActions', () => ({EditorActions: {setViewPortActionsDisabledStatus: jest.fn()}}));

const box = {id:'box',labelId:'tyre',isVisible:true,status:LabelStatus.ACCEPTED,
    rect:{x:100,y:100,width:200,height:100}};
const data = (x:number,y:number, button=0, shiftKey=false) => ({
    mousePositionOnViewPortContent:{x,y}, realImageSize:{width:1000,height:800},
    viewPortContentImageRect:{x:10,y:20,width:500,height:400},
    viewPortContentSize:{width:600,height:500}, event:{button,shiftKey}
} as unknown as EditorData);
let engine:RectRenderEngine;
beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(LabelsSelector,'getActiveImageData').mockReturnValue({id:'image',labelRects:[box]} as any);
    jest.spyOn(LabelsSelector,'getActiveLabelId').mockReturnValue('box');
    jest.spyOn(LabelsSelector,'getHighlightedLabelId').mockReturnValue(null);
    engine=new RectRenderEngine(document.createElement('canvas'));
});
afterEach(()=>jest.restoreAllMocks());
it('moves at image scale, preserves dimensions and commits on release',()=>{
    engine.mouseDownHandler(data(90,90));
    engine.mouseMoveHandler(data(110,105));
    expect((engine as any).getMovedRect(data(110,105))).toEqual({x:140,y:130,width:200,height:100});
    engine.mouseUpHandler(data(110,105));
    expect(JSON.stringify((store.dispatch as jest.Mock).mock.calls)).toContain('"x":140');
    expect(engine.isInProgress()).toBe(false);
    expect(box.rect.x).toBe(100);
});
it('clamps movement without shrinking at all image edges',()=>{
    engine.mouseDownHandler(data(90,90));
    expect((engine as any).getMovedRect(data(-500,-500))).toEqual({x:0,y:0,width:200,height:100});
    expect((engine as any).getMovedRect(data(1000,1000))).toEqual({x:800,y:700,width:200,height:100});
});
it('prefers smaller overlapping boxes and ignores hidden boxes',()=>{
    const small={...box,id:'small',rect:{x:140,y:120,width:60,height:50}};
    jest.spyOn(LabelsSelector,'getActiveImageData').mockReturnValue({id:'image',labelRects:[box,small,{...small,id:'hidden',isVisible:false}]} as any);
    expect((engine as any).getRectUnderMouse(data(95,95)).id).toBe('small');
});
it('keeps handle resizing and Shift-drag creation separate from movement',()=>{
    engine.mouseDownHandler(data(60,70));
    expect((engine as any).startResizeRectAnchor).toBeTruthy();
    expect((engine as any).movingRect).toBeUndefined();
    engine=new RectRenderEngine(document.createElement('canvas'));
    engine.mouseDownHandler(data(90,90,0,true));
    expect((engine as any).startCreateRectPoint).toEqual({x:90,y:90});
    expect((engine as any).movingRect).toBeUndefined();
});
it('ignores right mouse button',()=>{
    engine.mouseDownHandler(data(90,90,2));
    expect(engine.isInProgress()).toBe(false);
});
