/**
 * Simple, extensible in-memorystorage for the agents.
 */
export class Storage {
	memory: Map<string, string>;

	constructor() {
		this.memory = new Map<string, string>();
	}

	get(key: string) {
		return this.memory.get(key);
	}

	set(key: string, value: string) {
		this.memory.set(key, value);
	}

	delete(key: string) {
		this.memory.delete(key);
	}
}
