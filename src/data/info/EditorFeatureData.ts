export interface IEditorFeature {
    displayText:string;
    imageSrc:string;
    imageAlt:string;
}

export const EditorFeatureData: IEditorFeature[] = [
    {
        displayText: "Open source and free to use under GPLv3 license",
        imageSrc: "img/open-source.png",
        imageAlt: "open-source",
    },
    {
        displayText: "No advanced installation required, just open up your browser",
        imageSrc: "img/online.png",
        imageAlt: "online",
    },
    {
        displayText: "We don't store your images, because we don't send them anywhere",
        imageSrc: "img/private.png",
        imageAlt: "private",
    },
    {
        displayText: "Support multiple label types - bounding box, polygon, point",
        imageSrc: "img/labels.png",
        imageAlt: "labels",
    },
    {
        displayText: "Support output file formats like YOLO, VOC XML, VGG JSON, CSV",
        imageSrc: "img/file.png",
        imageAlt: "file",
    },
    {
        displayText: "Use AI to make your work more productive",
        imageSrc: "img/robot.png",
        imageAlt: "robot",
    },
];