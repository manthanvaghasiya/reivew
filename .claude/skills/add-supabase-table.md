---
name: add-supabase-table
description: Steps for adding a new Supabase table, migration, RLS policy, and typed query helpers.
---

# Add Supabase Table Skill

When adding a new table:
1. **Migration:** Create a new SQL migration in `/supabase/migrations/` (use `npx supabase migration new <name>`).
2. **Schema:** Ensure the table includes an `id` (UUID), `created_at` timestamp, and relevant foreign keys (e.g., `business_id`, `location_id`).
3. **RLS Policy:** You MUST enable RLS (`ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`).
4. **Policy Patterns:** Follow the multi-tenant pattern as seen in `0001_init.sql` (if exists). The authenticated user's `auth.uid()` should link appropriately to their business or location.
5. **Queries:** Add typed helper functions in `/lib/supabase/queries.ts` to access this table. Do not write raw SQL queries in UI components.
