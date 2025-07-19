import {
	createOpenRouter,
	type LanguageModelV2,
} from "@openrouter/ai-sdk-provider";

type ModelDefinitions = {
	[key: string]: {
		[key: string]: LanguageModelV2;
	};
};

export const openrouter = createOpenRouter({
	apiKey: process.env.OPENROUTER_API_KEY,
});

export const models: ModelDefinitions = {
	anthropic: {
		sonnet: openrouter.languageModel("anthropic/claude-sonnet-4"),
		opus: openrouter.languageModel("anthropic/claude-opus-4"),
		haiku: openrouter.languageModel("anthropic/claude-3.5-haiku"),
	},
	openai: {
		gpt4o: openrouter.languageModel("openai/gpt-4o"),
		gpt4oMini: openrouter.languageModel("openai/gpt-4o-mini"),
		gpt41: openrouter.languageModel("openai/gpt-4.1"),
	},
};
