# threadcast - ai.md

## what this is

**threadcast** is a minimal, extensible multi-agent runtime. it lets you define a mission, spin up a team of specialized agents, and watch them collaborate via a shared group chat and a global memory layer.

agents coordinate through conversation—not function calls. all persistent context lives in a shared key-value store. orchestration happens through a message-based dispatcher that notifies agents based on system state and message content.

this isn’t a task chain. it’s a substrate for dynamic, reactive, multi-agent systems that can reason, retry, and self-correct.

---

## core concepts

### 🧠 agents  
encapsulated LLM processes with:
- a system prompt (defining their priorities, constraints, and expertise)
- access to tools (e.g. storage, codegen, query runners)
- a thread (local message history)
- a dispatcher (routes relevant events to them)

agents are reactive. they don’t run on loops. they respond when notified and act based on context.

### 💬 thread  
a message timeline. the global ledger of the system. this is where:
- agents speak
- system events are recorded
- dispatcher reads and routes

messages are timestamped, attributed, and serializable into LLM-callable formats.

### 🗃️ global memory (kv store)  
shared, agent-readable/writable context. used for:
- storing state (e.g. schemas, query plans, partial code)
- enabling collaboration (e.g. one agent writes, another builds on it)
- coordination (e.g. leaving breadcrumbs, stashing outputs)

agents treat this like their working memory. no local memory. no black boxes.

### 📣 dispatcher  
a small model (or rule engine) that listens to thread activity and notifies relevant agents. this enables:
- reactive execution
- dynamic coordination
- emergent workflows

dispatcher ≠ scheduler. it doesn’t command. it nudges.

---

## how this works

1. the user provides a **mission** (natural language task description)
2. the **MainAgent** posts this to the global thread
3. the **Dispatcher** notifies relevant agents
4. each agent decides what to do, runs a tool or language model, and posts back to the thread
5. shared memory gets updated. new info propagates.
6. loop continues until goal is reached or new intent is introduced

---

## why this exists

existing agent frameworks are either:
- too rigid (fixed chains, brittle prompts)
- too heavy (monolithic orchestration engines)
- or too dumb (no context, no memory, no retry logic)

threadcast is built to be:
- lightweight enough to reason about
- extensible enough to build real things with
- general enough to support arbitrary missions
- inspectable enough to debug

it’s not an app. it’s a runtime. a sandbox for composable cognition.

---

## usage patterns

threadcast is designed to support:
- multi-agent collaborative builds
- autonomous or semi-autonomous mission execution
- self-correcting loops (retry/fallback/repair)
- programmable tool use via LLMs
- task decomposition + state sharing

example agent roles might include:
- planner
- executor
- validator
- summarizer
- tool interface
- memory router
but the system doesn’t hardcode roles. you bring the agents, it brings the glue.

---

## future ui

visualize a swarm. agents in vertical chat panes, messages flying in real time, shared state evolving below. the user types a goal and watches the team spin up, coordinate, and execute.

a debugger for cognition.

---

## goals

- decouple memory, reasoning, and messaging
- enable agent-level modularity, reuse, and introspection
- make debugging + devtools first-class
- build toward real autonomy—but keep humans in the loop
- generalize enough to power whatever comes next: tools, games, infra, assistants, ide agents, orgs

---

## technical stack

- **TypeScript** with ES2022 target and strict mode
- **Node.js** with ES modules
- **Vercel AI SDK** for LLM interactions
- **OpenRouter** for multi-model support (Claude, GPT-4, etc.)
- **Biome** for linting and formatting
- **pnpm** for package management

---

## current implementation status

### ✅ implemented
- base Agent class with system prompts and tool registration
- shared KV storage (in-memory Map)
- message system with attribution and timestamps
- thread structure for message history
- tool integration via Vercel AI SDK
- multi-model support through OpenRouter

### 🚧 incomplete/missing
- **dispatcher logic** - currently just logs, no routing
- **agent coordination** - no message passing between agents
- **mission execution** - MainAgent.start() is incomplete
- **reactive notifications** - agents don't respond to events
- **persistence** - everything is in-memory only
- **retry/self-correction** - no error handling
- **system events** - not recorded in threads

---

## development setup

```bash
# install dependencies
pnpm install

# set up environment
cp .env.example .env
# add your OPENROUTER_API_KEY

# run typescript compiler
pnpm tsc

# run the example
node dist/index.js
```

---

## codebase structure

```
src/
├── MainAgent.ts          # orchestrator (incomplete)
├── MainThread.ts         # mission-aware thread
├── index.ts             # example usage
├── resources/
│   ├── agents/
│   │   └── QueryExecutor.agent.ts  # example agent
│   └── objects/
│       ├── Agent.ts     # base agent class
│       ├── Dispatcher.ts # message router (stub)
│       ├── Message.ts   # message format
│       ├── Storage.ts   # shared KV store
│       └── Thread.ts    # message timeline
└── utils/
    └── llms/
        └── callTextStream.ts  # LLM interface
```

---

## known limitations

- agents cannot actually collaborate yet
- no mission execution flow
- dispatcher doesn't route messages
- no persistence or state recovery
- no debugging/inspection tools
- minimal error handling