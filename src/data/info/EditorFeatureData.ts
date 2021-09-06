export interface IEditorFeature {
    displayText:string;
    imageSrc:string;
    imageAlt:string;
}

export const EditorFeatureData: IEditorFeature[] = [
    {
        displayText: 'Open source and free to use under GPLv3 license',
        imageSrc: 'ico/open-source.png',
        imageAlt: 'open-source',
    },
    {
        displayText: 'No advanced installation required, just open up your browser',
        imageSrc: 'ico/online.png',
        imageAlt: 'online',
    },
    {
        displayText: "We don't store your images, because we don't send them anywhere",
        imageSrc: 'ico/private.png',
        imageAlt: 'private',
    },
    {
        displayText: 'Support multiple label types - rects, lines, points and polygons',
        imageSrc: 'ico/labels.png',
        imageAlt: 'labels',
    },
    {
        displayText: 'Support output file formats like YOLO, VOC XML, VGG JSON, CSV',
        imageSrc: 'ico/file.png',
        imageAlt: 'file',
    },
    {
        displayText: 'Use AI to make your work more productive',
        imageSrc: 'ico/robot.png',
        imageAlt: 'robot',
    },
];