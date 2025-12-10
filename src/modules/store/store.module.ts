export class StoreModule<Schema extends Record<string, any>> {
	private _data = new Map<string, any>();

	constructor(initialData: Schema) {
		for (const [key, value] of Object.entries(initialData)) {
			this._data.set(key, value);
		}
	}

	set<K extends keyof Schema>(key: K, value: Schema[K]): void;
	set<T>(key: string, value: T): void;
	set(key: string, value: any): void {
		this._data.set(key, value);
	}

	get<K extends keyof Schema>(key: K): Schema[K] | undefined;
	get<T>(key: string): T | undefined;
	get(key: string): any {
		return this._data.get(key);
	}

	getOrDefault<K extends keyof Schema>(key: K, defaultValue: Schema[K]): Schema[K];
	getOrDefault<T>(key: string, defaultValue: T): T;
	getOrDefault(key: string, defaultValue: any): any {
		const value = this._data.get(key);
		return value !== undefined ? value : defaultValue;
	}

	has(key: string): boolean {
		return this._data.has(key);
	}

	delete(key: string): boolean {
		return this._data.delete(key);
	}

	clear(): void {
		this._data.clear();
	}

	keys(): IterableIterator<string> {
		return this._data.keys();
	}

	size(): number {
		return this._data.size;
	}
}
