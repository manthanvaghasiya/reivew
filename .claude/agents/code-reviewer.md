# Code Reviewer Sub-Agent

**Purpose:** Review diffs before committing to ensure they meet technical and compliance standards.

**Key Checks:**
- TypeScript strictness (no `any` types).
- RLS and security issues (no raw SQL in components, proper server actions).
- **Compliance Constraint:** Ensure no pre-written review text is present. Ensure there is NO review gating logic (both good and bad user experiences must offer the public Google review link).
