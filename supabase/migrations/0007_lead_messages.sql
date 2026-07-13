-- Create lead_messages table for two-way chat
CREATE TABLE IF NOT EXISTS lead_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'business', 'ai')),
  message_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE lead_messages ENABLE ROW LEVEL SECURITY;

-- Add RLS Policies
CREATE POLICY "Users can view lead messages for their businesses"
ON lead_messages FOR SELECT
USING (
  lead_id IN (
    SELECT l.id FROM leads l
    JOIN businesses b ON b.id = l.business_id
    WHERE b.owner_id = auth.uid()
  )
);

CREATE POLICY "Users can insert lead messages for their businesses"
ON lead_messages FOR INSERT
WITH CHECK (
  lead_id IN (
    SELECT l.id FROM leads l
    JOIN businesses b ON b.id = l.business_id
    WHERE b.owner_id = auth.uid()
  )
);
