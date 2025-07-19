import type { Message } from "./Message.js";

type ThreadOptions = {
	onMessage: (message: Message) => void;
};

/**
 * A thread is the compute & orchestration layer for an agent.
 *
 * Ideas:
 * - We should have "to-dos" that are added to the thread and processed by the agent. Right now we can just prompt it to use the todos
 */
export class Thread {
	messages: Message[];
	onMessage: (message: Message) => void;

	constructor(options: ThreadOptions) {
		this.messages = [];
		this.onMessage = options.onMessage;
	}

	sendMessage(message: Message) {
		this.messages.push(message);
		this.onMessage(message);
		return message.id;
	}
}
