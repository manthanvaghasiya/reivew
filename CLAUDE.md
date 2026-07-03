# ReviewFlow - Claude Code Governance

## Project Overview
ReviewFlow is a SaaS tool for local businesses to collect Google reviews via QR codes. Customers scan the code, answer about their experience (good/bad), and are routed appropriately. Good experiences lead to writing their own Google review, while bad experiences route to a private feedback form for the business owner.

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database/Auth:** Supabase (Postgres + Auth + RLS)
- **Billing:** Stripe
- **Email:** Resend

## Folder Structure Map
- `/app` - Next.js App Router pages and API routes
- `/components` - React components
- `/lib` - Shared utilities and libraries
- `/lib/supabase` - Supabase clients and queries
- `/supabase/migrations` - Database migrations
- `/.claude` - Agent governance, hooks, skills, and settings

## Core Architectural Rules
1. **Multi-Tenant RLS Pattern:** Data is separated by `businesses -> locations -> qr_scans / feedback_events`. Row Level Security (RLS) policies must be strictly applied on all tables.
2. **No Server Actions Bypassing RLS:** Server actions must always execute queries using the authenticated user's context, without bypassing RLS unless absolutely required for a system-level background job.
3. **Public-Facing QR Pages:** All public pages (under `/app/r/[locationId]`) must work flawlessly with zero authentication.
4. **Supabase Queries:** All database access should be routed through `/lib/supabase/queries.ts`. Never inline raw SQL in UI components.
5. **No CSS Files:** Use Tailwind CSS exclusively. Do not create or use separate CSS files.
6. **TypeScript Strictness:** Strict mode is enforced. Use of `any` is strictly prohibited.

## Compliance Rules (HARD CONSTRAINT)
**Review-Gating Policy:** Never pre-fill, template, or auto-select review text for a customer. You must never suppress the public review path for negative-leaning customers. The public Google review link MUST always be offered on both the good and bad flows to comply strictly with Google's review-gating policies.

## How to Run Locally
1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`
3. Make sure to have your Supabase local environment running if testing DB locally: `npx supabase start`

## How to Run Migrations
1. Create a migration: `npx supabase migration new <migration_name>`
2. Apply migrations locally: `npx supabase db reset` or `npx supabase db push`
