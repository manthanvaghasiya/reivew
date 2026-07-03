---
name: add-dashboard-widget
description: Conventions for adding a new stat or widget to the business owner dashboard.
---

# Add Dashboard Widget Skill

When building a dashboard widget:
1. **Location:** Place the widget component in a logical subdirectory like `/components/dashboard/`.
2. **Data Fetching:** Fetch data server-side using `/lib/supabase/queries.ts` leveraging the current user's authenticated context.
3. **Styling:** Use Tailwind CSS to match the dashboard's design system.
4. **Resilience:** Handle loading states and empty states gracefully.
5. **Multi-tenancy:** Ensure the widget ONLY displays data for the currently selected business/location.
