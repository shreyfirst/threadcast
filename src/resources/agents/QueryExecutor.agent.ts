import { type ToolSet, tool } from "ai";
import z from "zod";
import { models } from "../../utils/llms/helpers.js";
import { Agent, type AgentOptions } from "../objects/Agent.js";

const tools: ToolSet = {
	search: tool({
		description: "Query runner",
		parameters: z.object({
			query: z.string(),
		}),
		execute: async ({ query }) => {
			return `here is the query you asked: ${query}`;
		},
	}),
};

export class QueryExecutor extends Agent {
	name = "QueryExecutor";
	systemPrompt =
		"You are a query executor. You are responsible for executing queries and returning the results.";
	model = models.openai.gpt4o;

	constructor(options: AgentOptions) {
		super({
			storage: options.storage,
			dispatcher: options.dispatcher,
			tools,
		});
	}
}
