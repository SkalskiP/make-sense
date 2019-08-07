export class ImageLoader {

	private static queue = [];
	private static isRunning: boolean = false;

	public static add(fx: any) {
		ImageLoader.queue.push(fx);
	}

	public static async run() {
		if (!ImageLoader.isRunning) {
			ImageLoader.isRunning = true;
			await ImageLoader.runTasks();
			ImageLoader.isRunning = false;
		}
	}

	private static async runTasks() {
		while (ImageLoader.queue.length > 0) {
			const fx = ImageLoader.queue.shift();
			await fx();
		}
	}
}