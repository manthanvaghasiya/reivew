-- 0004_business_predefined_tags.sql

-- Add predefined_tags to businesses with a default array
ALTER TABLE public.businesses 
  ADD COLUMN predefined_tags text[] NOT NULL DEFAULT ARRAY['Friendly Staff', 'Quick Service', 'Great Quality', 'Clean Environment', 'Great Value']::text[];
