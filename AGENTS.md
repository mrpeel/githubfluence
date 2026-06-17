# Agents Instructions

## 👥 Roles & Governance
- **Architect (User)**: Defines high-level design, product requirements, and features. Reviewer of plans.
- **Executor (Agent)**: Reads files, proposes plans, executes implementation tasks, runs verification checks, and commits code.

## 📂 Memory Layout
All state and memory documents reside under the `.agents/` folder:
- **`ACTIVE_CONTEXT.md`**: Contains system objectives, technical approach, active phase objectives, feature backlog catalog, and verification criteria.  Only keep the last 5 completed items in the backlog.  Move other items into the project's change_logfile.
- **`ARCHITECTURE.md`**: Maps the system structure, data flow diagrams, WearOS real-time kinematics state machine, and directory layout.
- **`LEARNINGS.md`**: Tracks key decisions, bugs resolved, and performance scorecard historical summaries.
- **`rules/`**: Workspace directives and constraints.
  - **`operating_protocol.md`**: The step-by-step execution protocol (CLARIFY, PLAN, EXECUTE, VERIFY, COMMIT) and stateless operations rules.

 Before starting any task, the executor must read `AGENTS.md`, `.agents/ACTIVE_CONTEXT.md`, `.agents/ARCHITECTURE.md`, `.agents/LEARNINGS.md`, and `.agents/rules/operating_protocol.md` to load the current workspace state.

## Context Management & Token Quota Optimization
To prevent chat bloat and conserve token quota, you must actively police the conversation history for topic drift:

1. **Detect Topic Shifts**: Monitor for major goal changes when moving to an entirely different backlog feature or a brand-new user prompt. **Do not halt or ask permission during intermediate steps, file reads, or sub-task execution within the same overall task.**
2. **Propose Context Pruning**: If a major topic shift is detected, do not immediately ingest the entire chat history. Instead, halt and explicitly ask the user:
   > *"I notice we are shifting focus to [New Topic]. Should we prune our short-term chat context to save your token quota? If yes, I will sync current progress to `.agents/rules/ACTIVE_CONTEXT.md` and archive this thread's previous history."*
3. **Enforce Progressive Disclosure**: When a topic shift is approved, rely strictly on `@mention` files (e.g., `@ACTIVE_CONTEXT.md`, `@LEARNINGS.md`, `@ARCHITECTURE.md`) for baseline project memory rather than reading old chat code blocks.