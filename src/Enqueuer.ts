export class Enqueuer {

	public static fxs = [];

	public static add(fx) {
		Enqueuer.fxs.push(fx);
	}

	public static async run() {
		for (const item of Enqueuer.fxs) {
			await item();
		}
	}

}