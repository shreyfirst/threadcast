import type { Agent } from "./Agent.js";
import type { MainAgent } from "./MainAgent.js";
import type { Message } from "./Message.js";

/**
 * Used to "notify" the right agents to respond to a message.
 */

export class Dispatcher {
	agents!: Agent[];
	mainAgent!: MainAgent;

	dispatch(message: Message) {
		// upstream
		if (!message.generator.main) {
			console.log(`[Dispatcher] Dispatching to main agent`);
			this.mainAgent.thread.sendMessage(message);
			return;
		}
		// downstream
		if (message.generator.main) {
			this.agents.forEach((agent) => {
				console.log(`[Dispatcher] Dispatching to ${agent.name}`);
				if (agent.isThinking) return;
				agent.thread.sendMessage(message);
			});
			return;
		}
	}
}
