import { streamText } from "ai";
import type { Agent } from "../../resources/objects/Agent.js";
import type { Message } from "../../resources/objects/Message.js";

export async function callTextStream(messages: Message[], perspective: Agent) {
	try {
		perspective.isThinking = true;

		const response = streamText({
			system: perspective.systemPrompt,
			model: perspective.model,
			messages: messages.map((m) => m.toCoreMessage(perspective)),
			tools: perspective.tools,
		});

		for await (const textPart of response.textStream) {
			console.log(textPart);
		}

		perspective.isThinking = false;

		return response.text;
	} catch (error) {
		perspective.isThinking = false;
		console.error(error);
		return null;
	}
}
