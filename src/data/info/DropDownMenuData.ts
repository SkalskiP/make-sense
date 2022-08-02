import {updateActivePopupType} from '../../store/general/actionCreators';
import {PopupWindowType} from '../enums/PopupWindowType';
import {store} from '../../index';
import {LabelsSelector} from '../../store/selectors/LabelsSelector';

export type DropDownMenuNode = {
    name: string
    description?: string
    imageSrc: string
    imageAlt: string
    disabled: (() => boolean) | boolean
    onClick?: () => void
    children?: DropDownMenuNode[]
}

export const DropDownMenuData: DropDownMenuNode[] = [
    {
        name: 'Actions',
        imageSrc: 'ico/actions.png',
        imageAlt: 'actions',
        disabled: false,
        children: [
            {
                name: 'Edit Labels',
                description: 'Modify labels list',
                imageSrc: 'ico/tags.png',
                imageAlt: 'labels',
                disabled: false,
                onClick: () => store.dispatch(updateActivePopupType(PopupWindowType.UPDATE_LABEL))
            },
            {
                name: 'Import Images',
                description: 'Load more images',
                imageSrc: 'ico/camera.png',
                imageAlt: 'images',
                disabled: false,
                onClick: () => store.dispatch(updateActivePopupType(PopupWindowType.IMPORT_IMAGES))
            },
            {
                name: 'Import Annotations',
                description: 'Import annotations from file',
                imageSrc: 'ico/import-labels.png',
                imageAlt: 'import-labels',
                disabled: false,
                onClick: () => store.dispatch(updateActivePopupType(PopupWindowType.IMPORT_ANNOTATIONS))
            },
            {
                name: 'Export Annotations',
                description: 'Export annotations to file',
                imageSrc: 'ico/export-labels.png',
                imageAlt: 'export-labels',
                disabled: false,
                onClick: () => store.dispatch(updateActivePopupType(PopupWindowType.EXPORT_ANNOTATIONS))
            },
            {
                name: 'Load AI Model',
                description: 'Load our pre-trained annotation models',
                imageSrc: 'ico/ai.png',
                imageAlt: 'load-ai-model',
                disabled: false,
                onClick: () => store.dispatch(updateActivePopupType(PopupWindowType.LOAD_AI_MODEL))
            },
        ]
    },
    {
        name: 'Insights',
        imageSrc: 'ico/stats.png',
        imageAlt: 'insights',
        disabled: false,
        children: [
            {
                name: 'Label Counts',
                description: 'Display per label name annotations count',
                imageSrc: 'ico/tags.png',
                imageAlt: 'label-counts',
                disabled: () => LabelsSelector.getLabelNames().length === 0,
                onClick: () => store.dispatch(updateActivePopupType(PopupWindowType.PER_LABEL_ID_COUNTS_STATISTICS))
            },
        ]
    },
    {
        name: 'Community',
        imageSrc: 'ico/plant.png',
        imageAlt: 'community',
        disabled: false,
        children: [
            {
                name: 'Documentation',
                description: 'Read more about Make Sense',
                imageSrc: 'ico/documentation.png',
                imageAlt: 'documentation',
                disabled: false,
                onClick: () => window.open('https://skalskip.github.io/make-sense', '_blank')
            },
            {
                name: 'Bugs and Features',
                description: 'Report a bug or propose a new feature',
                imageSrc: 'ico/bug.png',
                imageAlt: 'bug',
                disabled: false,
                onClick: () => window.open('https://github.com/SkalskiP/make-sense/issues', '_blank')
            },
            {
                name: 'Vote for Next Big Feature',
                description: 'Vote for next big feature that we will add to Make Sense',
                imageSrc: 'ico/poll.png',
                imageAlt: 'vote',
                disabled: false,
                onClick: () => window.open('https://github.com/SkalskiP/make-sense/discussions/269', '_blank')
            }
        ]
    }
]

