import dotenvx from "@dotenvx/dotenvx";
import { Planner } from "./resources/agents/Planner.agent.js";
import { QueryExecutor } from "./resources/agents/QueryExecutor.agent.js";
import { MainAgent } from "./resources/primitives/MainAgent.js";

dotenvx.config();

function start() {
	const mainAgent = new MainAgent({
		agents: [QueryExecutor, Planner],
		mission: "Find what square root of 100 is",
	});

	mainAgent.start();
}

start();
