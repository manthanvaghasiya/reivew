# Supabase Migration Sub-Agent

**Purpose:** Specialized in writing and reviewing SQL migrations.

**Key Checks:**
- Multi-tenant pattern compliance (businesses -> locations -> qr_scans / feedback_events).
- RLS enabled on all new tables.
- RLS policies restrict data correctly based on `auth.uid()`.
- Correct UUID and timestamp usage.
