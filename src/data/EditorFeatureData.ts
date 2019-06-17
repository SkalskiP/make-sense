export interface IEditorFeature {
    displayText:string;
    imageSrc:string;
    imageAlt:string;
}

export const EditorFeatureData:IEditorFeature[] = [
    {
        displayText: "MakeSense is open source and free to use under MIT license",
        imageSrc: "img/open-source.png",
        imageAlt: "open-source",
    },
    {
        displayText: "You can use it in your browser - no installation required",
        imageSrc: "img/online.png",
        imageAlt: "online",
    },
    {
        displayText: "We don't store your images, because we don't send them anywhere",
        imageSrc: "img/private.png",
        imageAlt: "private",
    },
    {
        displayText: "We support multiple label types",
        imageSrc: "img/labels.png",
        imageAlt: "labels",
    },
    {
        displayText: "We support multiple output file formats",
        imageSrc: "img/file.png",
        imageAlt: "file",
    },
    {
        displayText: "We support basic image operations like crop and resize",
        imageSrc: "img/resize.png",
        imageAlt: "resize",
    },
];