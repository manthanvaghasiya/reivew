-- 0003_private_feedback.sql

CREATE TABLE public.private_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id uuid NOT NULL REFERENCES public.locations (id) ON DELETE CASCADE,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.private_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert private feedback"
  ON public.private_feedback FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Owner can read own private feedback"
  ON public.private_feedback FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.locations l
      JOIN public.businesses b ON b.id = l.business_id
      WHERE l.id = location_id
        AND b.owner_id = auth.uid()
    )
  );
