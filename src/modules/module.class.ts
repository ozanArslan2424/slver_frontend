export class Module<T = never> {
	constructor(private readonly name: string) {
		if (import.meta.env.DEV) {
			console.count(this.name);
		}
	}

	active: T | null = null;

	setActive(value: T | null) {
		this.active = value;
	}
}
