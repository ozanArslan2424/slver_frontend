export class Module<T = never> {
	constructor() {
		if (import.meta.env.DEV) {
			console.count(this.constructor.name);
		}
	}

	active: T | null = null;

	setActive(value: T | null) {
		this.active = value;
	}
}
