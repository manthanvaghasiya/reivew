ALTER TABLE public.locations
ADD COLUMN services jsonb,
ADD COLUMN keywords text[];
