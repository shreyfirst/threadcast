import { MainAgent } from "./MainAgent.js";
import { QueryExecutor } from "./resources/agents/QueryExecutor.agent.js";

function start() {
	const mainAgent = new MainAgent({
		agents: [QueryExecutor],
		mission: "Find the treasure",
	});

	mainAgent.start();
}

start();
