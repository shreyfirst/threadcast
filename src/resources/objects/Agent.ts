import type { LanguageModelV2 } from "@openrouter/ai-sdk-provider";
import { type Tool, tool } from "ai";
import { z } from "zod";
import { models } from "../../utils/llms/helpers.js";
import type { Dispatcher } from "./Dispatcher.js";
import type { Message } from "./Message.js";
import type { Storage } from "./Storage.js";
import { Thread } from "./Thread.js";

export type AgentConstructor = new (options: AgentOptions) => Agent;

export type AgentOptions = {
	storage: Storage;
	dispatcher: Dispatcher;
	tools?: Record<string, Tool>;
};

const defaultTools: ({
	storage,
}: {
	storage: Storage;
}) => Record<string, Tool> = ({ storage }) => {
	return {
		storage: tool({
			description: "Tool to access global k/v storage",
			parameters: z.object({
				operation: z.enum(["get", "set", "delete"]),
				key: z.string(),
				value: z.string().optional(),
			}),
			execute: async ({ operation, key, value }) => {
				switch (operation) {
					case "get":
						return await storage.get(key);
					case "set":
						return await storage.set(key, value ?? "");
					case "delete":
						return await storage.delete(key);
				}
			},
		}),
	};
};

/**
 * ideas:
 * we should store what stoage keys the agent touched (and what operation) so we can send that to the main thread for it to use those keys
 */
export class Agent {
	public name = `agent-${crypto.randomUUID().slice(0, 4)}`;
	public systemPrompt = ``;
	public model: LanguageModelV2 = models.openai.gpt41;

	public tools: Record<string, Tool>;

	thread: Thread;
	storage: Storage;
	dispatcher: Dispatcher;
	isThinking: boolean;

	constructor(options: AgentOptions) {
		this.thread = new Thread({
			onMessage: this.onMessage.bind(this),
		});
		this.storage = options.storage;
		this.dispatcher = options.dispatcher;
		this.isThinking = false;
		this.tools = {
			...defaultTools({ storage: this.storage }),
			...(options.tools ?? {}),
		};
	}

	onMessage(message: Message) {
		// on incoming message (from other agent), start processing LLM
		// on outgoing message, send to dispatcher to send add to the main thread and notify the other agents

		console.log(message.toText());
	}
}
