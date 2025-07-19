import type { Message } from "./resources/objects/Message.js";
import { Thread } from "./resources/objects/Thread.js";
import type { Dispatcher } from "./resources/objects/Dispatcher.js";

type MainThreadOptions = {
	mission: string;
	dispatcher: Dispatcher;
	onMessage: (message: Message) => void;
};

export class MainThread extends Thread {
	mission: string;
	dispatcher: Dispatcher;

	constructor(options: MainThreadOptions) {
		super({
			onMessage: options.onMessage,
		});

		this.mission = options.mission.trim();
		this.dispatcher = options.dispatcher;
	}
}
