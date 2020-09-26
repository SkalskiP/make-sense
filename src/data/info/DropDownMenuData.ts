import {updateActivePopupType} from "../../store/general/actionCreators";
import {PopupWindowType} from "../enums/PopupWindowType";
import {store} from "../../index";

export type DropDownMenuNode = {
    name: string
    description?: string
    imageSrc: string
    imageAlt: string
    disabled: boolean
    onClick?: () => void
    children?: DropDownMenuNode[]
}

export const DropDownMenuData: DropDownMenuNode[] = [
    {
        name: "Actions",
        imageSrc: "ico/actions.png",
        imageAlt: "actions",
        disabled: false,
        children: [
            {
                name: "Labels",
                description: "Modify labels list",
                imageSrc: "ico/tags.png",
                imageAlt: "labels",
                disabled: false,
                onClick: () => store.dispatch(updateActivePopupType(PopupWindowType.UPDATE_LABEL))
            },
            {
                name: "Images",
                description: "Load more images",
                imageSrc: "ico/camera.png",
                imageAlt: "images",
                disabled: false,
                onClick: () => store.dispatch(updateActivePopupType(PopupWindowType.IMPORT_IMAGES))
            },
            {
                name: "Import",
                description: "Import annotations from file",
                imageSrc: "ico/import-labels.png",
                imageAlt: "import-labels",
                disabled: false,
                onClick: () => store.dispatch(updateActivePopupType(PopupWindowType.IMPORT_ANNOTATIONS))
            },
            {
                name: "Export",
                description: "Export annotations to file",
                imageSrc: "ico/export-labels.png",
                imageAlt: "export-labels",
                disabled: false,
                onClick: () => store.dispatch(updateActivePopupType(PopupWindowType.EXPORT_ANNOTATIONS))
            },
        ]
    },
    {
        name: "More",
        imageSrc: "ico/more.png",
        imageAlt: "more",
        disabled: false,
        children: [
            {
                name: "Documentation",
                description: "Coming soon",
                imageSrc: "ico/documentation.png",
                imageAlt: "documentation",
                disabled: true
            },
            {
                name: "Bugs and Features",
                description: "Coming soon",
                imageSrc: "ico/bug.png",
                imageAlt: "bug",
                disabled: true
            }
        ]
    }
]

