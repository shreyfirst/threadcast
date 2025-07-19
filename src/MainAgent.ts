import { MainThread } from "./MainThread.js";
import { Agent, type AgentConstructor } from "./resources/objects/Agent.js";
import { Dispatcher } from "./resources/objects/Dispatcher.js";
import type { Message } from "./resources/objects/Message.js";
import { Storage } from "./resources/objects/Storage.js";
import { models } from "./utils/llms/helpers.js";

type MainAgentOptions = {
	mission: string;
	agents: AgentConstructor[];
};

const _MAIN_AGENT_SYSTEM_PROMPT = `You are the main agent. You are responsible for coordinating the other agents.
    You are given a mission and a list of agents.
    You are responsible for coordinating the other agents to complete the mission.
    You are also responsible for storing the results of the other agents.
    You are also responsible for storing the results of the other agents.`;

export class MainAgent extends Agent {
	model = models.openai.gpt41;
	systemPrompt = _MAIN_AGENT_SYSTEM_PROMPT;

	mission: string;
	agents!: Agent[];

	constructor(options: MainAgentOptions) {
		const storage = new Storage();
		const dispatcher = new Dispatcher([]);

		super({
			storage: storage,
			dispatcher: dispatcher,
		});

		this.thread = new MainThread({
			mission: options.mission,
			dispatcher: dispatcher,
			onMessage: this.onMessage.bind(this),
		});

		this.mission = options.mission;
		this.registerAgents(options.agents);
	}

	registerAgents(agentClasses: AgentConstructor[]) {
		const agents = agentClasses.map((AgentClass) => {
			const instance = new AgentClass({
				storage: this.storage,
				dispatcher: this.dispatcher,
			});
			return instance;
		});

		this.agents = agents;
		this.dispatcher.agents = agents;
	}

	onMessage(_message: Message) {
		// send to dispatcher to send to other LLMs
	}

	start() {
		// need to start first message based on the mission
		// maybe:
		// this.thread.sendMessage(new Message({ content: this.mission, generator: this }))
	}
}
