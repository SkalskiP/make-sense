export type LearningState = {project:string; baseline:Record<string,string>; dirty:string[]; applied:Record<string,string>};
export const learningState:{capture:()=>LearningState|null; restored:LearningState|null}={capture:()=>null,restored:null};
