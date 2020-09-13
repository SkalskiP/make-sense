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
                imageSrc: "ico/tag.png",
                imageAlt: "labels",
                disabled: false
            },
            {
                name: "Images",
                description: "Load more images",
                imageSrc: "ico/camera.png",
                imageAlt: "images",
                disabled: false
            },
            {
                name: "Import",
                imageSrc: "",
                imageAlt: "",
                disabled: false
            },
            {
                name: "Export",
                imageSrc: "",
                imageAlt: "",
                disabled: false
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
                imageSrc: "",
                imageAlt: "",
                disabled: true
            },
            {
                name: "Bugs and Features",
                description: "Coming soon",
                imageSrc: "",
                imageAlt: "",
                disabled: true
            }
        ]
    }
]

