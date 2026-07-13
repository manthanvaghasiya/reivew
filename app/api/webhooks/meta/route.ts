import { NextResponse } from 'next/server';
import { processIncomingLeadMessage } from '@/lib/automation/ai-responder';
import { createClient } from '@/lib/supabase/server';

// GET handler for Meta Webhook Verification
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const verifyToken = process.env.META_WEBHOOK_VERIFY_TOKEN || 'mock_verify_token';

  if (mode && token) {
    if (mode === 'subscribe' && token === verifyToken) {
      console.log('WEBHOOK_VERIFIED');
      return new NextResponse(challenge, { status: 200 });
    } else {
      return new NextResponse('Forbidden', { status: 403 });
    }
  }

  return new NextResponse('Not found', { status: 404 });
}

// POST handler for receiving messages
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.object) {
      if (
        body.entry &&
        body.entry[0].changes &&
        body.entry[0].changes[0] &&
        body.entry[0].changes[0].value.messages &&
        body.entry[0].changes[0].value.messages[0]
      ) {
        // WhatsApp Message
        const phoneNumberId = body.entry[0].changes[0].value.metadata.phone_number_id;
        const from = body.entry[0].changes[0].value.messages[0].from; // sender phone number
        const msgBody = body.entry[0].changes[0].value.messages[0].text.body;

        // Try to find the lead by phone number
        const supabase = await createClient();
        const { data: leadData, error } = await supabase
          .from("leads")
          .select("*")
          .like("phone", `%${from.replace(/[^0-9]/g, '').slice(-10)}%`) // simplistic match on last 10 digits
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (leadData) {
          // Process via AI Responder
          await processIncomingLeadMessage(leadData.id, leadData.business_id, msgBody, from);
        } else {
          console.log("Received message from unknown number:", from);
          // Optional: Create a new lead automatically if the number is unknown?
          // For now, we ignore or log.
        }
      }

      return new NextResponse('EVENT_RECEIVED', { status: 200 });
    } else {
      return new NextResponse('Not Found', { status: 404 });
    }
  } catch (error: any) {
    console.error("Webhook POST Error:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
