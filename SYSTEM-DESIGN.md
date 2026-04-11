# System Design — SmartGenie

AI-powered Solidity smart contract code review platform built on Galadriel's teeML oracle. Users submit contract code, an on-chain AI agent analyzes it, and returns structured feedback covering bugs, best practices, gas optimization, and improved code.

---

## High-Level Architecture

```mermaid
graph TB
    subgraph User ["User"]
        WALLET[Wallet<br/>MetaMask / WalletConnect<br/>Ledger / Trezor / etc.]
    end

    subgraph Frontend ["Next.js Frontend"]
        EDITOR[Monaco Editor<br/>Solidity Syntax]
        HOOK[useSolidityCodeAgentContract<br/>Contract Interaction Hook]
        TABS[Code Review Tab<br/>+ AI Agent Tab]
        PROG[Progress Messages<br/>5-step feedback]
    end

    subgraph Galadriel ["Galadriel Devnet (Chain 696969)"]
        CONTRACT[SolidityCodeAgent.sol<br/>Agent Run Manager]
        ORACLE[teeML Oracle<br/>LLM Execution Engine]
        GPT[GPT-4-turbo-preview<br/>+ web_search<br/>+ code_interpreter]
    end

    WALLET --> HOOK
    EDITOR --> TABS --> HOOK
    HOOK -->|"1. runAgent(query, 10)"| CONTRACT
    CONTRACT -->|"2. createOpenAiLlmCall()"| ORACLE
    ORACLE -->|"3. Execute LLM"| GPT
    GPT -->|"4. Response / Function Call"| ORACLE
    ORACLE -->|"5. onOracleOpenAiLlmResponse()"| CONTRACT
    HOOK -->|"6. Poll isRunFinished() every 5s"| CONTRACT
    CONTRACT -->|"7. getMessageHistoryContents()"| HOOK
    HOOK --> EDITOR
```

---

## On-Chain Agent Loop

```mermaid
sequenceDiagram
    participant U as User (Frontend)
    participant C as SolidityCodeAgent.sol
    participant O as teeML Oracle
    participant LLM as GPT-4-turbo-preview

    U->>C: runAgent(query, maxIterations=10)
    Note over C: Create AgentRun<br/>Push system message<br/>Push user message

    C->>O: createOpenAiLlmCall(runId, config)

    loop Until finished or max_iterations
        O->>LLM: Execute with tools enabled
        alt LLM returns content (no function call)
            LLM-->>O: { content: "review text" }
            O->>C: onOracleOpenAiLlmResponse(runId, response)
            Note over C: Push assistant message<br/>Mark is_finished = true
        else LLM requests function call
            LLM-->>O: { functionName: "web_search", args: {...} }
            O->>C: onOracleOpenAiLlmResponse(runId, response)
            C->>O: createFunctionCall(runId, funcName, args)
            O->>O: Execute function (web_search / code_interpreter)
            O->>C: onOracleFunctionResponse(runId, result)
            Note over C: Push user message (function result)<br/>Increment responsesCount
            C->>O: createOpenAiLlmCall(runId, config)
        end
    end

    U->>C: isRunFinished(runId) → true
    U->>C: getMessageHistoryContents(runId)
    C-->>U: [system, user, assistant, ...]
    Note over U: Extract messages[2]<br/>(assistant's review)
```

---

## Smart Contract State Machine

```mermaid
stateDiagram-v2
    [*] --> Created: runAgent()
    Created --> WaitingForOracle: createOpenAiLlmCall()

    WaitingForOracle --> GotResponse: onOracleOpenAiLlmResponse()
    WaitingForOracle --> Error: errorMessage != ""

    GotResponse --> Finished: No function call needed
    GotResponse --> FunctionCall: functionName != ""
    GotResponse --> Finished: responsesCount >= max_iterations

    FunctionCall --> WaitingForFunction: createFunctionCall()
    WaitingForFunction --> FunctionResult: onOracleFunctionResponse()
    FunctionResult --> WaitingForOracle: createOpenAiLlmCall() (next iteration)

    Error --> Finished: Mark is_finished = true
    Finished --> [*]
```

---

## Frontend Flow — Code Review

```mermaid
graph TD
    subgraph Input ["User Input"]
        PASTE["Paste Solidity code<br/>in Monaco Editor"]
        REVIEW["Click 'Review My Code'"]
    end

    subgraph Prompt ["Prompt Construction"]
        PR["Expert researcher prompt:<br/>1. Code Improvements<br/>2. Best Practices<br/>3. Potential Bugs<br/>4. Gas Optimization<br/>+ Include revised code"]
    end

    subgraph OnChain ["On-Chain Execution"]
        TX["Send tx: runAgent(query, 10)"]
        WAIT["Parse AgentRunCreated event<br/>→ get runId"]
        POLL["Poll isRunFinished(runId)<br/>every 5 seconds"]
        FETCH["getMessageHistoryContents(runId)<br/>→ extract messages[2]"]
    end

    subgraph Progress ["Progress UX"]
        P1["Analyzing your code..."]
        P2["Identifying improvement suggestions..."]
        P3["Evaluating best practices..."]
        P4["Inspecting for potential bugs..."]
        P5["Optimizing gas usage..."]
    end

    subgraph Output
        RESULT["Display review in<br/>right editor pane<br/>(read-only)"]
    end

    PASTE --> REVIEW --> PR --> TX --> WAIT --> POLL
    POLL --> Progress
    POLL -->|"finished = true"| FETCH --> RESULT
```

---

## Frontend Flow — @Genie Code Improvement

```mermaid
graph TD
    subgraph Input
        CODE["Original code in left pane"]
        GENIE["Add @Genie instructions in right pane<br/>// @Genie: Refactor this function<br/>// @Genie: Add access control"]
        CLICK["Click 'Improve my code'"]
    end

    subgraph Parse ["Instruction Extraction"]
        REGEX["Regex: /\\/\\/\\s*@Genie\\s*:\\s*(.*)/g"]
        LIST["Extracted instructions:<br/>1. Refactor this function<br/>2. Add access control"]
    end

    subgraph Execute
        PROMPT["Prompt: Modify code per @Genie<br/>instructions only. Do not alter<br/>other parts."]
        AGENT["runAgent(prompt, 10)"]
        POLL2["Poll → Fetch result"]
    end

    subgraph Output2
        IMPROVED["Improved code replaces<br/>right pane content"]
    end

    CODE --> GENIE --> CLICK --> REGEX --> LIST --> PROMPT --> AGENT --> POLL2 --> IMPROVED
```

---

## Contract Data Model

```mermaid
classDiagram
    class SolidityCodeAgent {
        +string prompt
        +uint agentRunCount
        +address owner
        +address oracleAddress
        +OpenAiRequest config
        +runAgent(query, max_iterations) uint
        +onOracleOpenAiLlmResponse(runId, response, error)
        +onOracleFunctionResponse(runId, response, error)
        +getMessageHistoryContents(agentId) string[]
        +getMessageHistoryRoles(agentId) string[]
        +isRunFinished(runId) bool
        +setOracleAddress(newAddress)
    }

    class AgentRun {
        +address owner
        +Message[] messages
        +uint responsesCount
        +uint8 max_iterations
        +bool is_finished
    }

    class Message {
        +string role
        +string content
    }

    class OpenAiRequest {
        +string model
        +uint maxTokens
        +string tools
        +string toolChoice
        +string responseFormat
    }

    SolidityCodeAgent --> AgentRun : manages
    AgentRun --> Message : contains
    SolidityCodeAgent --> OpenAiRequest : configures
```

---

## Component Architecture

```mermaid
graph TB
    subgraph App ["_app.tsx"]
        W3O[Web3OnboardProvider]
    end

    subgraph Pages
        IDX["index.tsx<br/>Header + Tab Switcher"]
    end

    subgraph Tabs
        CRT["CodeReviewTab.tsx<br/>Split Pane: Input ↔ Output"]
        AIT["AIAgentTab.tsx<br/>Placeholder"]
    end

    subgraph Components
        SE["SolidityEditor.tsx<br/>Monaco Editor<br/>Solidity syntax<br/>@Genie autocomplete"]
        EM["ErrorModal.tsx<br/>Error display"]
        FSM["FullScreenModal.tsx<br/>Fullscreen editor"]
    end

    subgraph Hook
        HOOK2["useSolidityCodeAgentContract<br/>code, suggestions, loading<br/>progressMessage, error<br/>handleRunAgent()"]
    end

    subgraph Contract
        SC["SolidityCodeAgent.sol<br/>Galadriel Devnet"]
    end

    W3O --> IDX --> CRT & AIT
    CRT --> SE & EM & FSM
    CRT --> HOOK2
    HOOK2 --> SC
```

---

## Design Decisions

| Decision | Chosen | Alternative | Reasoning |
|----------|--------|-------------|-----------|
| **AI execution** | On-chain via teeML oracle | Off-chain API call | On-chain AI is the hackathon's core theme (Galadriel). Every AI interaction is verifiable on-chain |
| **LLM model** | GPT-4-turbo-preview | GPT-3.5 / Claude | Best code analysis quality. Tools support (web_search, code_interpreter) enables richer analysis |
| **Code editor** | Monaco Editor | CodeMirror | Same editor as VS Code — Solidity syntax highlighting, autocomplete, familiar to developers |
| **Wallet integration** | Web3Onboard | RainbowKit | 7+ wallet support including hardware wallets, consistent with other projects |
| **Polling strategy** | 5-second interval | WebSocket / events | Simple and reliable. Oracle response time varies (10-60s), polling is good enough |
| **Message extraction** | `messages[2]` (3rd message) | Parse all messages | Messages are: [0]=system, [1]=user, [2]=assistant response. Index 2 is always the review |
| **@Genie instructions** | Comment-based (`// @Genie:`) | Form-based UI | Inline with code context. Developers naturally use comments. No UI overhead |
| **Max iterations** | 10 | 1-5 | Allows multiple tool calls (web_search + code_interpreter) before final response |

### What Would Change at Scale

| Current | At Scale | Why |
|---------|----------|-----|
| Polling every 5s | WebSocket or event subscription | Reduce unnecessary RPC calls |
| Single contract | Proxy + implementation pattern | Upgradeable without losing state |
| Client-side only | Backend with queue | Handle multiple concurrent reviews, rate limiting |
| No caching | Cache reviews by code hash | Same code gets same review — save gas and time |
| Galadriel devnet | Mainnet or L2 | Production reliability |

### Known Limitations

1. **Gas cost per review**: Every code review is an on-chain transaction (costs GAL tokens)
2. **Response time**: 10-60 seconds depending on oracle and LLM latency
3. **No diff view**: CodeDiffModal is a stub — can't compare before/after
4. **No history**: Previous reviews aren't saved client-side or queryable
5. **Single-chain**: Only works on Galadriel devnet (chain ID 696969)
6. **No rate limiting**: Users can spam reviews (costs gas but could congest oracle)
