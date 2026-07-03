# Available Sub-Agents

This project uses specific Claude Code sub-agents located in `/.claude/agents/` to handle specialized tasks.

- **code-reviewer**: Invoke this agent to review diffs for TypeScript strictness, RLS/security issues, and strict compliance with the review-gating rules (no pre-written text, no gating logic).
- **supabase-migration-agent**: Invoke this agent for writing or reviewing SQL migrations and RLS policies, ensuring adherence to the project's multi-tenant architecture.
- **qa-tester**: Invoke this agent to manually walk through the public QR flow (e.g., `/app/r/[locationId]`), verifying that both good and bad paths function correctly and that both always provide the public review link.
