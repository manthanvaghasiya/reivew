-- Add review_flow_mode to locations table
-- 'direct' = 1-review direct copy flow
-- 'interactive' = 3-option interactive builder flow

ALTER TABLE public.locations
ADD COLUMN review_flow_mode text NOT NULL DEFAULT 'direct'
CHECK (review_flow_mode IN ('direct', 'interactive'));
