import { streamText } from "ai";
import type { Agent } from "../../resources/primitives/Agent.js";
import { Message } from "../../resources/primitives/Message.js";

export async function callTextStream(
	messages: Message[],
	perspective: Agent,
): Promise<Message> {
	try {
		perspective.isThinking = true;

		const response = await streamText({
			system: perspective.systemPrompt,
			model: perspective.model,
			messages: messages.map((m) => m.toCoreMessage(perspective)),
			tools: perspective.tools,
		});

		let responseText = "";
		const toolCalls = [];
		process.stdout.write(`[${perspective.name}] `);

		for await (const chunk of response.fullStream) {
			if (chunk.type === "text") {
				process.stdout.write(chunk.text);
				responseText += chunk.text;
			}
			if (chunk.type === "tool-result") {
				console.log(
					`\n[${perspective.name}] Tool call: ${JSON.stringify(chunk.input, null, 2)}, output: ${JSON.stringify(chunk.output, null, 2)}`,
				);
				toolCalls.push(JSON.stringify(chunk.input, null, 2));
			}
		}
		process.stdout.write("\n");

		perspective.isThinking = false;

		return new Message({
			content: responseText,
			generator: perspective,
			...(toolCalls.length > 0 && {
				metadata: {
					operations: toolCalls,
				},
			}),
		});
	} catch (error) {
		perspective.isThinking = false;
		console.error(error);
		return new Message({
			content: `There was an error: ${String(error)}`,
			generator: perspective,
		});
	}
}
