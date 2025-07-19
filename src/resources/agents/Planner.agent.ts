import { type ToolSet, tool } from "ai";
import z from "zod";
import { models } from "../../utils/llms/helpers.js";
import { Agent, type AgentOptions } from "../primitives/Agent.js";

const tools: ToolSet = {
	search: tool({
		description: "Query runner",
		inputSchema: z.object({
			query: z.string(),
		}),
		execute: async ({ query }) => {
			return `here is the query you asked: ${query}`;
		},
	}),
};

export class Planner extends Agent {
	name = "Planner";
	systemPrompt =
		"You are a planner. You are responsible for planning the best things to do.";
	model = models.openai.gpt4o;

	constructor(options: AgentOptions) {
		super({
			storage: options.storage,
			dispatcher: options.dispatcher,
			tools,
		});
	}
}
