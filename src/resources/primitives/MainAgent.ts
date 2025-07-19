import { callTextStream } from "../../utils/llms/callTextStream.js";
import { models } from "../../utils/llms/helpers.js";
import { Agent, type AgentConstructor } from "./Agent.js";
import { Dispatcher } from "./Dispatcher.js";
import { Message } from "./Message.js";
import { Storage } from "./Storage.js";

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
	name = "MainAgent";
	model = models.openai.gpt41;
	systemPrompt = _MAIN_AGENT_SYSTEM_PROMPT;
	main = true;

	mission: string;
	agents!: Agent[];

	constructor(options: MainAgentOptions) {
		const storage = new Storage();
		const dispatcher = new Dispatcher();

		super({
			storage: storage,
			dispatcher: dispatcher,
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

		this.dispatcher.agents = [...agents];
		this.dispatcher.mainAgent = this;
	}

	async start() {
		const missionMessage = new Message({
			content: `Mission: ${this.mission}`,
			generator: this,
		});

		this.thread.sendMessage(missionMessage);
	}
}
