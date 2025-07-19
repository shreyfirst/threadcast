import type { Agent } from "./Agent.js";
import type { Message } from "./Message.js";

/**
 * Used to "notify" the right agents to respond to a message.
 */
export class Dispatcher {
	agents: Agent[];

	constructor(agents: Agent[]) {
		this.agents = agents;
	}

	dispatch(message: Message) {
		// a message is recieved by the dispatcher to add it to the main thread and call the right agents to respond

		console.log(message.toText());
	}
}
