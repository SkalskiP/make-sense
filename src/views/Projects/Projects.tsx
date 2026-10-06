import React,{useEffect,useRef,useState} from 'react';
import {store} from '../..';
import {SavedProject,listProjects,loadProject,saveProject,snapshot} from '../../logic/projects/projectStore';
import {learningState} from '../../logic/projects/learningState';
import {emitSaveStatus} from '../../logic/uiEvents';
import './Projects.scss';

export default function Projects() {
    const [open,setOpen]=useState(false),[entries,setEntries]=useState<SavedProject[]>([]),[message,setMessage]=useState('');
    const [name,setName]=useState(''),[busy,setBusy]=useState(false);
    const active=useRef<string|null>(null),saving=useRef(false),dirty=useRef(false),revision=useRef(0),timer=useRef<number>();
    const projectName=useRef(''),restore=useRef(false);
    async function refresh(){setEntries((await listProjects()).sort((a,b)=>b.updated.localeCompare(a.updated)));}
    async function save(asNew=false) {
        if(saving.current)return;
        const state=store.getState();if(!state.labels.imagesData.length || !state.general.projectData.type){setMessage('Open an annotation project first.');return;}
        saving.current=true;setBusy(true);const captured=revision.current;
        const id=asNew || !active.current?crypto.randomUUID():active.current;
        const title=(asNew?name:projectName.current || name).trim() || state.general.projectData.name;
        emitSaveStatus('saving', 'Saving…');
        try {
            const record=snapshot(state,id,title,learningState.capture());
            await saveProject(record,state.labels.imagesData,n=>{if(!active.current || asNew)setMessage(`Saving images ${n}/${state.labels.imagesData.length}…`);});
            active.current=id;projectName.current=title;dirty.current=revision.current!==captured;
            setMessage(`Saved ${title} · image ${record.labels.activeImageIndex+1}/${record.labels.imagesData.length} · ${new Date().toLocaleTimeString()}`);
            emitSaveStatus(dirty.current?'unsaved':'saved', dirty.current?'Unsaved changes':'✓ Saved');
            navigator.storage?.persist?.().catch(()=>false);await refresh();
        }catch(e){setMessage(`Save failed; keep this tab open and export your labels. ${String(e)}`);dirty.current=true;emitSaveStatus('failed','⚠ Save failed');}
        finally{saving.current=false;setBusy(false);}
    }
    useEffect(()=>{
        let prior=store.getState().labels;
        const unsubscribe=store.subscribe(()=>{
            const state=store.getState(),next=state.labels;
            if(next.imagesData===prior.imagesData && next.labels===prior.labels && next.activeImageIndex===prior.activeImageIndex &&
               next.activeLabelType===prior.activeLabelType && next.activeLabelNameId===prior.activeLabelNameId)return;
            prior=next;if(restore.current)return;
            revision.current++;dirty.current=true;emitSaveStatus('unsaved','Unsaved changes');
            if(active.current){window.clearTimeout(timer.current);timer.current=window.setTimeout(()=>save(),1500);}
        });
        const interval=window.setInterval(()=>{if(active.current && dirty.current && !saving.current)save();},10000);
        const warn=(e:BeforeUnloadEvent)=>{if(dirty.current || saving.current){e.preventDefault();e.returnValue='';}};
        window.addEventListener('beforeunload',warn);
        return ()=>{unsubscribe();window.clearTimeout(timer.current);window.clearInterval(interval);window.removeEventListener('beforeunload',warn);};
    },[]);
    async function resume(id:string) {
        if(saving.current)return;
        // Never replace in-memory edits without saving an existing project or explicit confirmation.
        if(dirty.current){
            if(active.current){await save();if(dirty.current)return;}
            else if(!window.confirm('Replace the open unsaved project? Cancel to save it first.'))return;
        }
        setBusy(true);
        try {
            const record=await loadProject(id);restore.current=true;
            window.dispatchEvent(new CustomEvent('make-sense-project-load',{detail:record}));
            learningState.restored=record.learning;
            store.dispatch({type:'RESTORE_LOCAL_PROJECT',payload:record} as any);
            active.current=id;projectName.current=record.name;setName(record.name);dirty.current=false;
            setMessage(`Resumed ${record.name} at image ${record.labels.activeImageIndex+1}. Autosave enabled.`);
            setOpen(false);
        }catch(e){setMessage(String(e));}finally{restore.current=false;setBusy(false);}
    }
    return <div className="project-library" onKeyDown={e=>e.stopPropagation()}>
        <button onClick={()=>{setOpen(!open);refresh().catch(e=>setMessage(String(e)));}}>Projects</button>
        {open && <section><h3>Local projects</h3>
            <p>Save images, annotations and your place. After saving once, edits autosave in this browser.</p>
            <input aria-label="Project name" value={name} placeholder="Project name" onChange={e=>setName(e.target.value)}/>
            <button disabled={busy} onClick={()=>save()}>Save project</button>
            <button disabled={busy} onClick={()=>save(true)}>Save as new project</button>
            <p role="status">{message}</p>
            {entries.map(p=><article key={p.id}><strong>{p.name}</strong><br/>{p.labels.imagesData.length} images · resume at {p.labels.activeImageIndex+1}<br/>{new Date(p.updated).toLocaleString()} <button disabled={busy} onClick={()=>resume(p.id)}>Load / resume</button></article>)}
            <p>Stored on this browser profile and address (use http://127.0.0.1:3000 consistently). Clearing site data deletes projects. Keep annotation exports as backups. YOLO26 run history stays in the separate local service.</p>
        </section>}
        {!open && message && <span className="project-save-status" title={message}>{busy?'Saving…':dirty.current?'Unsaved changes':active.current?'Project saved':''}</span>}
    </div>;
}
