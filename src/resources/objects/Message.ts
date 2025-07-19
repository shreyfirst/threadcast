import type { CoreMessage } from "ai";
import type { Agent } from "./Agent.js";

type MessageOptions = {
	content: string;
	generator: Agent;
};

/**
 * A message object is the core data structure for each message.
 */
export class Message {
	id: string;
	content: string;
	createdAt: Date;
	generator: Agent;

	constructor(options: MessageOptions) {
		this.id = crypto.randomUUID();
		this.content = options.content;
		this.createdAt = new Date();
		this.generator = options.generator;
	}

	toText() {
		return `${this.generator.name}: ${this.content}`;
	}

	/**
	 * AI SDK expects a message to be in this format.
	 * @var isFromPerspective - deteremines who is the sender of the message is in the perspective of the agent
	 * if it's not the agent itself who wrote the message, we need to mark it as "user" in the role and pass the actual agent's name in the content
	 */
	toCoreMessage(perspective: Agent) {
		const isFromPerspective = this.generator === perspective;

		const coreMessage: CoreMessage = {
			role: isFromPerspective ? "assistant" : "user",
			content: isFromPerspective ? this.content : this.toText(),
		};

		return coreMessage;
	}
}
