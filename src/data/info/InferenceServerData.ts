import { InferenceServerType } from '../enums/InferenceServerType';

export interface IInferenceServer {
    name: string
    imageSrc: string
    imageAlt: string
}

export const InferenceServerDataMap: Record<InferenceServerType, IInferenceServer> = {
    [InferenceServerType.ROBOFLOW]: {
        name: 'Roboflow Inference Server',
        imageSrc: 'ico/roboflow-logo.png',
        imageAlt: 'roboflow-inference-server'
    },
    [InferenceServerType.MAKESENSE]: {
        name: 'Make Sense Inference Server',
        imageSrc: 'ico/make-sense-ico-transparent.png',
        imageAlt: 'make-sense-inference-server'
    }
}