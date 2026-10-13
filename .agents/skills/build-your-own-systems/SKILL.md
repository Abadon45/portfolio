---
name: build-your-own-systems
description: Plan and implement educational, from-scratch technology demos inspired by the Build Your Own X catalog. Use when creating a portfolio project that recreates a system, protocol, runtime, tool, engine, or model to teach its core ideas through a working implementation.
---

# Build Your Own Systems

Use this skill to turn a “build your own X” idea into a small, understandable, testable portfolio project. The upstream [Build Your Own X](https://github.com/codecrafters-io/build-your-own-x) repository is a directory of tutorials, not an implementation specification. Select and verify learning references for the chosen topic; do not copy its README or linked projects wholesale.

## Start with the repository

1. Read the root `AGENTS.md` and `SKILL.md`, then inspect relevant route-local instructions and existing implementations.
2. Search for an existing page, shared component, provider, API adapter, theme, and fixture that can be reused.
3. Keep the portfolio’s Next.js, TypeScript, and MUI architecture. For a standalone page, use its shared shell, `FloatingHomeButton`, and `ScrollToTopButton` as applicable.
4. Treat the upstream catalog as inspiration. Do not assume a tutorial is current, complete, secure, or compatible with this project.

## Choose a learning-sized scope

Before implementation, write a short project brief containing:

- The concept the demo teaches and the intended audience.
- The smallest end-to-end outcome that demonstrates the concept.
- Explicitly excluded production features and known limitations.
- The user-visible inputs, outputs, states, and failure cases.
- The implementation language and why it fits the portfolio.
- The references to consult and which claims or steps each reference supports.

Prefer a coherent slice over a superficial imitation. Examples include parsing a small language, serving a basic HTTP request, storing and querying records, tracking a tiny version history, or rendering a scene. Avoid claiming compatibility with a real standard or production system unless it has been checked against authoritative specifications and conformance cases.

## Research and reference handling

- Inspect the selected tutorial and its linked source/docs before relying on it. Confirm that the linked resource still exists and distinguish its teaching simplifications from normative behavior.
- For protocols, formats, cryptography, security boundaries, or compatibility claims, consult primary specifications and official documentation. Treat blog tutorials as explanatory references.
- Keep attribution with the relevant design or reference notes. Do not reproduce long passages, tutorial code, or assets; implement independently and cite the inspiration in project documentation where useful.
- Record uncertainty explicitly. If sources disagree, prefer the primary specification and reduce the demo’s stated scope to what can be verified.
- Never add secrets, copied credentials, private data, or unsafe live integrations. Use deterministic, sanitized fixtures for demos.

## Design the implementation

1. Sketch the core data flow and boundaries before creating files: input, parsing/validation, domain logic, persistence or simulation, output.
2. Keep the central algorithm or mechanism readable and isolated from page presentation. Use typed domain models and small helpers.
3. Expose intermediate steps when they teach the concept: traces, parsed structures, state transitions, logs, or visualizations. Label simplified behavior honestly.
4. Model idle, pending, success, empty, invalid-input, and failure states. Prevent duplicate actions and make reset/retry behavior clear.
5. Keep demos deterministic by default. Use local fixtures or bounded in-memory state; explain when data resets. Do not make a portfolio walkthrough rely on an expiring personal backend.
6. Make dangerous or resource-intensive operations bounded. Validate input size and complexity, avoid arbitrary code execution and host filesystem/network access, and make destructive actions reversible or explicitly confirmed.
7. Keep UI accessible and responsive, with keyboard-operable controls, visible focus, meaningful labels, and readable light and dark themes.

## Deliverable shape

- Put a small route entry in the App Router and move growing page UI into that route’s `_components` directory.
- Keep domain logic separate from UI, and put fixtures or normalization code in a clearly named local module.
- Add a concise README or in-page explanation with the learning goal, run/use instructions, simplified assumptions, limitations, and references.
- Use the existing MUI theme, shared alerts, and shared page controls. Do not add another UI system or a one-off notification mechanism.
- Do not place a new demo on the portfolio home page unless the user asks.

## Verification and handoff

- Check the expected behavior with focused examples, including boundary and malformed inputs. Add tests only when the user requests testing or verification.
- For meaningful changes, follow the repository’s TypeScript, build, and route-smoke workflow when practical; report unavailable checks and their exact reason.
- Inspect mobile layout and both color modes for custom surfaces. Check that examples match the stated scope and do not overstate real-system compatibility.
- Summarize the concept implemented, key boundaries and simplifications, references consulted, and checks performed.
