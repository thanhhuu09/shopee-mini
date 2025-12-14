# Shopee Mini Agent Handbook

## Branch and PR Workflow
- Create feature branches with `task/<task-id>-<short-slug>` (example: `task/003-cart-logic`).
- PR titles must follow `Task <task-id>: <imperative summary>` (example: `Task 003: Implement cart totals`).
- Each PR description should link to the relevant TASK doc and list any deviations from PRD.md.

## Required Commands Before Pushing
1. `npm run lint`
2. `npm run build`
3. Playwright smoke tests (command defined in task; fail-fast if not available).

## Merge Gates
- **P0 (blocker):** failing lint/build/test, regression in MVP flows, diverging from PRD.md scope, or missing reviewer approval. Must be resolved before merge.
- **P1 (needs attention):** missing documentation updates, flaky tests, or UX polish gaps. Requires tracking issue or follow-up task before merge.
- Merges to `main` allowed only when no P0 issues remain and approvals from at least one maintainer are recorded.

## Source of Truth
- `PRD.md` defines scope, flows, and requirements. Any change to requirements must update PRD.md first, then reference the change in PR descriptions.
- Task docs inherit from PRD.md. If conflicts arise, update PRD.md and cascade updates to tasks.

## Additional Guidelines
- Keep commits scoped to the assigned task; avoid drive-by refactors unless task owner approves.
- Note tech constraints in PR if implementation deviates (e.g., temporary mock services).
- Encourage small, reviewable PRs aligned to single task files in `TASKS/`.
