export class FileUtil {
    public static loadImage(fileData: File, onSuccess: (image:HTMLImageElement) => any, onFailure: () => any): any {
		return new Promise((resolve, reject) => {
			const url = URL.createObjectURL(fileData);
            const image = new Image();
			image.src = url;
			image.onload = () => {
				onSuccess(image);
				resolve();
			};
			image.onerror = () => {
				onFailure();
				reject();
			};
		})

    }

    public static loadLabelsList(fileData: File, onSuccess: (labels:string[]) => any, onFailure: () => any) {
        const reader = new FileReader();
        reader.onloadend = function (evt: any) {
            const contents:string = evt.target.result;
            onSuccess(contents.split(/[\r\n]/));
        };
        reader.onerror = () => onFailure();
        reader.readAsText(fileData);
    }

    public static readFile(fileData: File): Promise<string> {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onloadend = (event: any) => {
                resolve(event.target.result);
            };
            reader.onerror = reject;
            reader.readAsText(fileData);
        })
    }
}