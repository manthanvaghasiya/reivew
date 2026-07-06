-- Add new fields to locations table for "Deploy New Branch" feature

ALTER TABLE public.locations
ADD COLUMN category text,
ADD COLUMN description text,
ADD COLUMN address text,
ADD COLUMN phone text,
ADD COLUMN logo_url text,
ADD COLUMN services jsonb,
ADD COLUMN keywords text[];
