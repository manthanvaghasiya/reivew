---
name: add-new-page
description: Steps and conventions for adding a new Next.js App Router page.
---

# Add New Page Skill

When creating a new route under `/app`:
1. Use a folder-based structure (e.g., `/app/dashboard/page.tsx`).
2. Ensure the component is a Server Component by default, only adding `"use client"` if interactive hooks are required.
3. Keep the file strictly typed. Use interfaces for props.
4. Style entirely with Tailwind CSS. Do not import external CSS files.
5. If public-facing (like `/app/r/[locationId]`), verify it does not require authentication and respects the no-gating compliance rule.
