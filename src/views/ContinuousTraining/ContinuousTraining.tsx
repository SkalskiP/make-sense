import React, {useEffect, useRef, useState} from 'react';
import {store} from '../..';
import {ImageActions} from '../../logic/actions/ImageActions';
import {LabelsSelector} from '../../store/selectors/LabelsSelector';
import {updateImageDataById, updateLabelNames} from '../../store/labels/actionCreators';
import {LabelUtil} from '../../utils/LabelUtil';
import {ImageData} from '../../store/labels/types';
import './ContinuousTraining.scss';
import {learningState} from '../../logic/projects/learningState';
import {isReviewedFile, markReviewedFile, reviewedFileNames, syncReviewedFiles} from '../../logic/projects/learningMarks';
import {APPROVE_EVENT, findNextUnreviewedIndex, withAIFlagsCleared} from '../../logic/review/reviewWorkflow';
import {emitAIStatus} from '../../logic/uiEvents';
import {signature, canRefresh} from './reviewGuard';

type Box = {label:string; x:number; y:number; width:number; height:number; confidence?:number};
type Run = {id:string; status:string; error?:string; metrics?:Record<string,number>};
type Status = {project:string; pending:number; threshold:number; reviewed:Record<string,string>; latest:string|null; runs:Run[]};
const API='http://127.0.0.1:8765';
const normalize=(s:string)=>({'chassy':'chassis','spare tyre':'spare_tyre'}[s] || s);
async function api(path:string, body?:unknown) {
    const r=await fetch(API+path,body===undefined?{}:{method:'POST',headers:{'Content-Type':'application/json','X-MakeSense-Local':'1'},body:JSON.stringify(body)});
    const result=await r.json(); if(!r.ok) throw new Error(result.error || `Service error ${r.status}`); return result;
}
function boxes(image:ImageData):Box[] {
    const labels=LabelsSelector.getLabelNames();
    return image.labelRects.map(b=>{
        const label=labels.find(l=>l.id===b.labelId);
        if(!label) throw new Error('Assign a class to every box before reviewing');
        return {label:normalize(label.name),...b.rect};
    });
}
async function sha256(file:File) {
    const hash=await crypto.subtle.digest('SHA-256',await file.arrayBuffer());
    return Array.from(new Uint8Array(hash)).map(b=>b.toString(16).padStart(2,'0')).join('');
}

export default function ContinuousTraining({embedded}: {embedded?: boolean}) {
    const [open,setOpen]=useState(false),[connected,setConnected]=useState(false),[status,setStatus]=useState<Status|null>(null);
    const [message,setMessage]=useState(''),[busy,setBusy]=useState(false),[,setTick]=useState(0);
    const [left,setLeft]=useState(''),[right,setRight]=useState(''),[loadId,setLoadId]=useState('');
    const [progress,setProgress]=useState<{done:number;total:number}|null>(null);
    // Push newly reviewed file names to the thumbnail marks and refresh those
    // thumbnails so the sidebar shows green checks without a page reload.
    // Reviewed means approved ground truth, so this also clears stale AI flags
    // (dashed borders) left from approves made before that behavior existed.
    function syncMarks(s:Status) {
        const added=syncReviewedFiles(Object.keys(s.reviewed));
        if(!added.length)return;
        const images=LabelsSelector.getImagesData();
        for(const name of added) {
            const im=images.find(i=>i.fileData.name===name);
            if(!im)continue;
            const cleared=withAIFlagsCleared(im.labelRects);
            const changed=cleared.some((b,i)=>b.isCreatedByAI!==im.labelRects[i].isCreatedByAI);
            store.dispatch(updateImageDataById(im.id,changed?{...im,labelRects:cleared}:{...im}));
        }
    }
    const [comparison,setComparison]=useState<{name:string;url:string;left:Box[];right:Box[];leftId:string;rightId:string;width:number;height:number}|null>(null);
    const baseline=useRef<Record<string,string>>({}), dirty=useRef(new Set<string>()), applied=useRef<Record<string,string>>({});
    const current=LabelsSelector.getActiveImageData();
    const session=useRef(0);
    // Refs mirror state for the approval event listener, which is registered once.
    const busyRef=useRef(false),connectedRef=useRef(false),reviewImageRef=useRef<(im:ImageData)=>Promise<void>>(async ()=>{});
    useEffect(()=>{let previous=LabelsSelector.getImagesData();let active=LabelsSelector.getActiveImageData()?.id;
        return store.subscribe(()=>{
        const images=LabelsSelector.getImagesData(), nextActive=LabelsSelector.getActiveImageData()?.id;
        if(images===previous && active===nextActive)return;
        previous=images;active=nextActive;
        if(connected) for(const im of images) {
            if(baseline.current[im.id]!==undefined && baseline.current[im.id]!==signature(im)) dirty.current.add(im.id);
        }
        setTick(n=>n+1);
    });},[connected]);
    useEffect(()=>()=>{if(comparison)URL.revokeObjectURL(comparison.url);},[comparison]);
    function establishBaseline(allowExisting:boolean) {
        baseline.current={};dirty.current.clear();applied.current={};
        for(const im of LabelsSelector.getImagesData()) {
            baseline.current[im.id]=signature(im);
            if(im.labelRects.length && !allowExisting) dirty.current.add(im.id);
        }
    }
    useEffect(()=>{
        learningState.capture=()=>status?{project:status.project,baseline:baseline.current,dirty:Array.from(dirty.current),applied:applied.current}:learningState.restored;
        return ()=>{learningState.capture=()=>learningState.restored;};
    },[status]);
    // Approves made while offline live only in this browser. On (re)connect,
    // upload every locally approved image the service has never seen, so no
    // ground truth is ever lost. Unknown and validation images are skipped.
    async function uploadMissingReviews(s:Status) {
        const missing=reviewedFileNames().filter(name=>!s.reviewed[name]);
        if(!missing.length)return;
        const images=LabelsSelector.getImagesData();
        let uploaded=0;
        for(const name of missing) {
            const im=images.find(i=>i.fileData.name===name);
            if(!im)continue;
            try {
                const next:Status=await api('/review',{name,boxes:boxes(im),sha256:await sha256(im.fileData)});
                setStatus(next);syncMarks(next);uploaded++;
            }catch { /* validation/unknown image or busy service: stays local */ }
        }
        if(uploaded)setMessage(`Uploaded ${uploaded} offline-approved image(s) as ground truth.`);
    }
    // Mirror connection/training state to the top bar.
    useEffect(()=>{
        emitAIStatus({
            connected,
            pending: status?.pending ?? 0,
            threshold: status?.threshold ?? 10,
            training: status?.runs.some(r=>r.status==='running') ?? false,
            latest: status?.latest ?? null,
        });
    },[status, connected]);
    // Review-bar approval: save the active image as ground truth when connected
    // (offline it only advances), then open the next unreviewed image.
    useEffect(()=>{
        async function onApprove() {
            const im=LabelsSelector.getActiveImageData();
            if(!im || busyRef.current)return;
            setBusy(true);
            try {
                if(connectedRef.current)await reviewImageRef.current(im);
            }catch(e){setMessage(String(e));setBusy(false);return;}
            // Approving the whole image approves every box on it, including
            // offline approves that never reach the training service. Record it
            // locally either way so predictions can never overwrite it.
            markReviewedFile(im.fileData.name);
            acceptAllBoxes(im);
            const images=LabelsSelector.getImagesData();
            const current=images.findIndex(i=>i.id===im.id);
            const next=findNextUnreviewedIndex(images.map(i=>i.fileData.name),isReviewedFile,current);
            setBusy(false);
            if(next<0)setMessage('All loaded images are reviewed.');
            else ImageActions.getImageByIndex(next);
        }
        window.addEventListener(APPROVE_EVENT,onApprove);
        return ()=>window.removeEventListener(APPROVE_EVENT,onApprove);
    },[]);
    async function connect() {
        try {const s=await api('/status');if(learningState.restored?.project===s.project){
            baseline.current=learningState.restored.baseline;dirty.current=new Set(learningState.restored.dirty);applied.current=learningState.restored.applied;
            learningState.restored=null;
        }else establishBaseline(false);setStatus(s);syncMarks(s);setConnected(true);setMessage('Connected. Existing boxes are protected until you enable draft refresh. Green sidebar checks are approved ground truth; blue checks are unreviewed annotations.');
        uploadMissingReviews(s);}
        catch(e){setMessage(String(e));}
    }
    useEffect(()=>{
        if(!connected)return undefined;
        let stopped=false,working=false;
        const epoch=++session.current;
        async function poll() {
            if(working)return;working=true;
            try {
                const s:Status=await api('/status');if(stopped)return;setStatus(s);syncMarks(s);
                if(s.latest) {
                    const active=LabelsSelector.getActiveImageData()?.id;
                    const eligible=LabelsSelector.getImagesData().filter(im=>canRefresh(im,s.reviewed,active,dirty.current,baseline.current,isReviewedFile) && applied.current[im.id]!==s.latest);
                    // Small requests keep the UI responsive on projects with thousands of scans.
                    for(let i=0;i<eligible.length;i+=100) {
                        const batch=eligible.slice(i,i+100);
                        const predictions:Record<string,{boxes:Box[];sha256:string}>=await api('/predictions/'+s.latest,{names:batch.map(im=>im.fileData.name)});
                        if(stopped || session.current!==epoch)return;
                        // Recheck review state and edits after the network request.
                        const fresh:Status=await api('/status');if(stopped)return;syncMarks(fresh);
                        let labels=LabelsSelector.getLabelNames();
                        const required=Array.from(new Set(Object.values(predictions).flatMap(p=>p.boxes).map(b=>b.label)));
                        const additions=required.filter(n=>!labels.some(l=>normalize(l.name)===n)).map(n=>LabelUtil.createLabelName(n));
                        if(additions.length){labels=[...labels,...additions];store.dispatch(updateLabelNames(labels));}
                        for(const old of batch) {
                            const prediction=predictions[old.fileData.name];
                            if(!prediction)continue;
                            const digest=await sha256(old.fileData);
                            if(digest!==prediction.sha256){setMessage('Skipped image with mismatched content: '+old.fileData.name);continue;}
                            if(stopped)return;
                            const im=LabelsSelector.getImageDataById(old.id), bs=prediction.boxes;
                            if(!bs || !canRefresh(im,fresh.reviewed,LabelsSelector.getActiveImageData()?.id,dirty.current,baseline.current,isReviewedFile))continue;
                            const updated={...im,labelRects:bs.map(b=>({...LabelUtil.createLabelRect(labels.find(l=>normalize(l.name)===b.label).id,
                                {x:b.x,y:b.y,width:b.width,height:b.height},b.confidence ?? null),isCreatedByAI:true}))};
                            baseline.current[im.id]=signature(updated);applied.current[im.id]=s.latest;
                            store.dispatch(updateImageDataById(im.id,updated));
                        }
                    }
                }
            }catch(e){if(!stopped)setMessage(String(e));}finally{working=false;}
        }
        poll();const timer=window.setInterval(poll,4000);
        return ()=>{stopped=true;session.current++;window.clearInterval(timer);};
    },[connected]);
    // Approved boxes are verified ground truth: drop the AI flag so their dashed
    // borders render solid. The signature only covers label geometry, so this
    // never disturbs draft-refresh protection.
    function acceptAllBoxes(im:ImageData) {
        const fresh=LabelsSelector.getImageDataById(im.id);
        if(fresh.labelRects.some(b=>b.isCreatedByAI)) {
            store.dispatch(updateImageDataById(im.id,{...fresh,
                labelRects:withAIFlagsCleared(fresh.labelRects)}));
        }
    }
    async function reviewImage(im:ImageData) {
        dirty.current.add(im.id);
        const content=boxes(im),sig=signature(im),digest=await sha256(im.fileData);
        const s:Status=await api('/review',{name:im.fileData.name,boxes:content,sha256:digest});setStatus(s);
        markReviewedFile(im.fileData.name);syncMarks(s);
        acceptAllBoxes(im);
        setMessage(signature(LabelsSelector.getImageDataById(im.id))===sig?'Review saved: edits are now ground truth.':'Snapshot saved; further edits need another review save.');
    }
    busyRef.current=busy;connectedRef.current=connected;reviewImageRef.current=reviewImage;
    async function review() {
        if(!current)return;setBusy(true);
        try {await reviewImage(current);}
        catch(e){setMessage(String(e));}finally{setBusy(false);}
    }
    function applyBoxes(im:ImageData, bs:Box[], source:string) {
        let labels=LabelsSelector.getLabelNames();
        const required=Array.from(new Set(bs.map(b=>b.label)));
        const additions=required.filter(n=>!labels.some(l=>normalize(l.name)===n)).map(n=>LabelUtil.createLabelName(n));
        if(additions.length){labels=[...labels,...additions];store.dispatch(updateLabelNames(labels));}
        const updated={...im,labelRects:bs.map(b=>({...LabelUtil.createLabelRect(labels.find(l=>normalize(l.name)===b.label).id,
            {x:b.x,y:b.y,width:b.width,height:b.height},b.confidence ?? null),isCreatedByAI:true}))};
        baseline.current[im.id]=signature(updated);applied.current[im.id]=source;dirty.current.add(im.id);
        store.dispatch(updateImageDataById(im.id,updated));
    }
    async function loadPrevious() {
        const im=LabelsSelector.getActiveImageData();
        if(!im || !loadId)return;setBusy(true);
        try {
            const data:Record<string,{boxes:Box[];sha256:string}>=await api('/predictions/'+loadId,{names:[im.fileData.name]});
            const prediction=data[im.fileData.name];
            if(!prediction)throw new Error('This image has no boxes in run '+loadId);
            if(await sha256(im.fileData)!==prediction.sha256)throw new Error('Image content differs from run '+loadId);
            applyBoxes(LabelsSelector.getImageDataById(im.id),prediction.boxes,loadId);
            setMessage(`Loaded ${prediction.boxes.length} boxes from run ${loadId}. Edit or save them as ground truth.`);
        }catch(e){setMessage(String(e));}finally{setBusy(false);}
    }
    // Approved images whose browser boxes were wiped (empty predictions applied
    // before offline-approve protection existed) still have their ground truth
    // on the service. Restore them where the local copy is empty and untouched;
    // images with local edits or non-empty boxes are never touched.
    async function restoreReviews() {
        if(!connected)return;setBusy(true);
        try {
            const reviews:Record<string,{boxes:Box[];sha256:string}>=await api('/reviews',{});
            const images=LabelsSelector.getImagesData();
            let restored=0;
            for(const im of images) {
                const entry=reviews[im.fileData.name];
                if(!entry || !entry.boxes.length)continue;
                if(dirty.current.has(im.id) || im.labelRects.length)continue;
                if(await sha256(im.fileData)!==entry.sha256)continue;
                const fresh=LabelsSelector.getImageDataById(im.id);
                if(dirty.current.has(im.id) || fresh.labelRects.length)continue;
                const updated={...fresh,labelRects:entry.boxes.map(b=>{
                    const labels=LabelsSelector.getLabelNames();
                    let label=labels.find(l=>normalize(l.name)===b.label);
                    if(!label){label=LabelUtil.createLabelName(b.label);store.dispatch(updateLabelNames([...labels,label]));}
                    return LabelUtil.createLabelRect(label.id,
                        {x:b.x,y:b.y,width:b.width,height:b.height},b.confidence ?? null);
                })};
                baseline.current[im.id]=signature(updated);
                store.dispatch(updateImageDataById(im.id,updated));
                markReviewedFile(im.fileData.name);
                restored++;
            }
            const s:Status=await api('/status');setStatus(s);syncMarks(s);
            setMessage(restored?`Restored ${restored} approved image(s) from service ground truth.`:'Nothing to restore: no approved image is missing its boxes.');
        }catch(e){setMessage(String(e));}finally{setBusy(false);}
    }
    async function runInference() {
        if(!status)return;setBusy(true);setProgress({done:0,total:0});
        try {
            const images=LabelsSelector.getImagesData();
            const eligible=images.filter(im=>!status.reviewed[im.fileData.name] && !isReviewedFile(im.fileData.name) && !dirty.current.has(im.id) &&
                baseline.current[im.id]!==undefined && baseline.current[im.id]===signature(im));
            setProgress({done:0,total:eligible.length});
            let done=0;
            for(let i=0;i<eligible.length;i+=25) {
                const batch=eligible.slice(i,i+25);
                const predictions:Record<string,{boxes:Box[];sha256:string}>=await api('/infer',{names:batch.map(im=>im.fileData.name)});
                for(const old of batch) {
                    const prediction=predictions[old.fileData.name];
                    if(!prediction)continue;
                    if(await sha256(old.fileData)!==prediction.sha256)continue;
                    const fresh=LabelsSelector.getImageDataById(old.id);
                    if(status.reviewed[old.fileData.name] || isReviewedFile(old.fileData.name) || dirty.current.has(old.id) ||
                        baseline.current[old.id]===undefined || baseline.current[old.id]!==signature(fresh))continue;
                    const updated={...fresh,labelRects:prediction.boxes.map(b=>{
                        const labels=LabelsSelector.getLabelNames();
                        let label=labels.find(l=>normalize(l.name)===b.label);
                        if(!label){label=LabelUtil.createLabelName(b.label);store.dispatch(updateLabelNames([...labels,label]));}
                        return {...LabelUtil.createLabelRect(label.id,{x:b.x,y:b.y,width:b.width,height:b.height},b.confidence ?? null),isCreatedByAI:true};
                    })};
                    baseline.current[old.id]=signature(updated);
                    if(status.latest)applied.current[old.id]=status.latest;
                    store.dispatch(updateImageDataById(old.id,updated));
                }
                done+=batch.length;setProgress({done,total:eligible.length});
                const s:Status=await api('/status');setStatus(s);syncMarks(s);
            }
            setMessage(eligible.length?`Inference applied to ${eligible.length} images. Correct them; edits become ground truth on review.`:'Nothing to infer: every loaded image is reviewed or edited.');
        }catch(e){setMessage(String(e));}finally{setProgress(null);setBusy(false);}
    }
    async function compare(image:ImageData=current) {
        if(!image || !left || !right)return;setBusy(true);
        try {
            const name=image.fileData.name;
            const [a,b]=await Promise.all([api('/predictions/'+left,{names:[name]}),api('/predictions/'+right,{names:[name]})]);
            if(!a[name] || !b[name])throw new Error('This image is not present in both runs');
            const digest=await sha256(image.fileData);
            if(a[name].sha256!==digest || b[name].sha256!==digest)throw new Error('Historical image content differs');
            const bitmap=await createImageBitmap(image.fileData);
            setComparison({name,leftId:left,rightId:right,url:URL.createObjectURL(image.fileData),left:a[name]?.boxes||[],right:b[name]?.boxes||[],width:bitmap.width,height:bitmap.height});bitmap.close();
        }catch(e){setMessage(String(e));}finally{setBusy(false);}
    }
    async function navigate(direction:number, history=false) {
        // Any edited image counts as ground truth: save it before leaving.
        const leaving=LabelsSelector.getActiveImageData();
        if(leaving && dirty.current.has(leaving.id) && connected && !busy) {
            try {await reviewImage(leaving);}catch(e){setMessage(String(e));}
        }
        if(direction<0)ImageActions.getPreviousImage();else ImageActions.getNextImage();
        if(history)compare(LabelsSelector.getActiveImageData());
    }
    const navigation=(history=false)=><div className="image-navigation">
        <button aria-label="Previous picture" disabled={busy || LabelsSelector.getActiveImageIndex()<=0} onClick={()=>navigate(-1,history)}>← Previous</button>
        <span>{LabelsSelector.getActiveImageIndex()+1} / {LabelsSelector.getImagesData().length}</span>
        <button aria-label="Next picture" disabled={busy || LabelsSelector.getActiveImageIndex()>=LabelsSelector.getImagesData().length-1} onClick={()=>navigate(1,history)}>Next →</button>
    </div>;
    const complete=status?.runs.filter(r=>r.status==='complete')||[];
    return <div className={embedded ? "continuous-training embedded" : "continuous-training"} onKeyDown={e=>e.stopPropagation()}>
        <button onClick={()=>setOpen(!open)}>YOLO26 learning {status?`(${status.pending}/${status.threshold})`:''}</button>
        {open && <section>
            <h3>Continuous YOLO26 fine-tuning</h3>
            {navigation()}
            {!connected?<button onClick={connect}>Connect local training service</button>:<>
                <p>{status?.project} · {status?.pending}/{status?.threshold} newly reviewed training images</p>
                <p>{current?.fileData.name}<br/>{current && status?.reviewed[current.fileData.name] ?
                    `Saved ${status.reviewed[current.fileData.name]} review` : 'Unreviewed'}{current && dirty.current.has(current.id)?' · protected local boxes':''}</p>
                <button disabled={busy || !current || status?.reviewed[current.fileData.name]==='val'} onClick={review}>Mark reviewed / save corrections</button>
                <button disabled={busy || status?.runs.some(r=>r.status==='running')} onClick={async()=>{try{await api('/train',{});setMessage('Training requested.');}catch(e){setMessage(String(e));}}}>Train now / retry</button>
                <button disabled={busy || status?.runs.some(r=>r.status==='running')} onClick={runInference}>Run preannotation inference</button>
                <button disabled={busy || !connected} onClick={restoreReviews}>Restore approved boxes from service</button>
                <button onClick={()=>{establishBaseline(true);setMessage('Current unreviewed boxes are now eligible for automatic refresh. Further edits will protect an image.');}}>Allow refresh of current unreviewed drafts</button>
                {progress && progress.total>0 && <div className="inference-progress" role="status">
                    <div className="track"><div className="bar" style={{width:`${Math.round(100*progress.done/progress.total)}%`}}/></div>
                    <p>Inferring {progress.done}/{progress.total} untouched unreviewed images…</p>
                </div>}
                <p>Preannotation pipeline: inference drafts boxes from the latest model → you correct them → any edited image counts as ground truth (saved when you press ←/→ or Mark reviewed, empty images included) → every 10 new training reviews triggers fine-tuning → the new model re-predicts untouched unreviewed images. Reviewed images and your edits are never overwritten. The active image refreshes after you leave it.</p>
                <h4>Load previous preannotations</h4>
                <select aria-label="Run to load" value={loadId} onChange={e=>setLoadId(e.target.value)}><option value="">Select run</option>{complete.map(r=><option key={r.id}>{r.id}</option>)}</select>
                <button disabled={busy || !loadId || !current} onClick={loadPrevious}>Load run boxes into editor</button>
                <h4>Run history</h4>
                {status?.runs.map(r=><p key={r.id}>{r.id}: {r.status} {r.error}{r.metrics && ` · mAP50 ${((r.metrics['metrics/mAP50(B)']||0)*100).toFixed(1)}%`}</p>)}
                <select aria-label="Earlier run" value={left} onChange={e=>setLeft(e.target.value)}><option value="">Earlier run</option>{complete.map(r=><option key={r.id}>{r.id}</option>)}</select>
                <select aria-label="Later run" value={right} onChange={e=>setRight(e.target.value)}><option value="">Later run</option>{complete.map(r=><option key={r.id}>{r.id}</option>)}</select>
                <button disabled={busy || !left || !right || !current} onClick={()=>compare()}>Compare current image</button>
                <button onClick={()=>setConnected(false)}>Disconnect</button>
            </>}
            <p role="status">{message}</p>
        </section>}
        {comparison && <div className="comparison"><button onClick={()=>setComparison(null)}>Close comparison</button>{navigation(true)}<p>{comparison.name} · read-only historical predictions</p><div className="pair">
            {[comparison.left,comparison.right].map((bs,i)=><div key={i}><p>{i===0?comparison.leftId:comparison.rightId}</p><div className="overlay"><img src={comparison.url}/>{bs.map((b,j)=><div key={j} className="box" style={{left:`${100*b.x/comparison.width}%`,top:`${100*b.y/comparison.height}%`,width:`${100*b.width/comparison.width}%`,height:`${100*b.height/comparison.height}%`}}><span>{b.label} {b.confidence?.toFixed(2)}</span></div>)}</div></div>)}
        </div></div>}
    </div>;
}
