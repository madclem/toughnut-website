export class System {
	constructor() {
		this.active = false;
	}

	start() {
		this.active = true;
	}

	stop() {
		this.active = false;
	}
}