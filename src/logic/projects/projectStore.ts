import {AppState} from '../../store';
import {LearningState} from './learningState';

export type SavedProject = {
    version:1; id:string; name:string; updated:string;
    project:AppState['general']['projectData']; labels:AppState['labels']; learning:LearningState|null;
};
const DB='make-sense-projects-v1';
function database():Promise<IDBDatabase> {
    return new Promise((resolve,reject)=>{
        const req=indexedDB.open(DB,1);
        req.onupgradeneeded=()=>{req.result.createObjectStore('projects',{keyPath:'id'});req.result.createObjectStore('images');};
        req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);
    });
}
export async function listProjects():Promise<SavedProject[]> {
    const db=await database();
    try{return await new Promise((resolve,reject)=>{
        const req=db.transaction('projects').objectStore('projects').getAll();
        req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);
    });}finally{db.close();}
}
export function snapshot(state:AppState,id:string,name:string,learning:LearningState|null):SavedProject {
    // Deep-copy editable data before async persistence; File bytes live in a separate store.
    const labels=JSON.parse(JSON.stringify({...state.labels,imagesData:state.labels.imagesData.map(im=>({...im,fileData:null,loadStatus:false}))}));
    labels.activeLabelId=null;labels.highlightedLabelId=null;
    return {version:1,id,name,updated:new Date().toISOString(),project:{...state.general.projectData,name},labels,
        learning:learning?JSON.parse(JSON.stringify(learning)):null};
}
export async function saveProject(record:SavedProject,files:AppState['labels']['imagesData'],progress:(n:number)=>void=()=>{}) {
    const db=await database();
    try {
        // Commit blobs in bounded transactions; publish metadata only when every image exists.
        for(let start=0;start<files.length;start+=50) {
            const batch=files.slice(start,start+50);
            await new Promise<void>((resolve,reject)=>{
                const tx=db.transaction('images','readwrite'),os=tx.objectStore('images');
                for(const im of batch) {
                    const key=record.id+'/'+im.id;
                    const check=os.getKey(key);
                    check.onsuccess=()=>{if(check.result===undefined)os.put(im.fileData,key);};
                }
                tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error || new Error('Image save aborted'));
            });
            progress(Math.min(start+50,files.length));
        }
        await new Promise<void>((resolve,reject)=>{
            const tx=db.transaction('projects','readwrite');tx.objectStore('projects').put(record);
            tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error || new Error('Project save aborted'));
        });
    } finally {db.close();}
}
export async function loadProject(id:string):Promise<SavedProject> {
    const db=await database();
    try{return await new Promise((resolve,reject)=>{
        const tx=db.transaction(['projects','images']);let record:SavedProject;
        const req=tx.objectStore('projects').get(id);
        req.onsuccess=()=>{
            record=req.result;
            if(!record || record.version!==1 || !record.labels.imagesData.length){reject(new Error('Unsupported or empty project'));return;}
            for(const im of record.labels.imagesData){
                const image=tx.objectStore('images').get(id+'/'+im.id);
                image.onsuccess=()=>{
                    if(!image.result){reject(new Error('Missing stored image; current project was not replaced'));return;}
                    im.fileData=image.result;im.loadStatus=false;
                };
            }
        };
        tx.oncomplete=()=>resolve(record);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error || new Error('Load aborted'));
    });}finally{db.close();}
}
