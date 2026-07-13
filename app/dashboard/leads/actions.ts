"use server";

import { revalidatePath } from "next/cache";
import { createLead, updateLeadStatus, getBusinessByOwner, getLeadMessages, insertLeadMessage, updateBusinessAIPrompt } from "@/lib/supabase/queries";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/lib/supabase/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function addLeadAction(businessId: string, name: string, phone: string, source: string) {
  try {
    const lead = await createLead({
      business_id: businessId,
      name,
      phone,
      source
    });
    revalidatePath("/dashboard/leads");
    return { success: true, lead };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function sendAiWhatsAppMessageAction(leadId: string, leadName: string, leadPhone: string, leadSource: string) {
  try {
    // 1. Generate the message using AI
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `You are a friendly assistant for a business. 
We just received a new lead named "${leadName}" who found us via "${leadSource}".
Write a short, engaging WhatsApp message to greet them, thank them for their interest, and ask when they would be available for a quick meeting or call.
Keep it under 3 sentences, very polite and conversational. Do NOT include any placeholders like [Your Name].`;

    const result = await model.generateContent(prompt);
    const aiMessage = await result.response.text();

    // 2. Send via Meta WhatsApp Cloud API
    // Note: To make this work in production, you will need META_WHATSAPP_TOKEN and META_PHONE_NUMBER_ID in .env
    const metaToken = process.env.META_WHATSAPP_TOKEN || "mock_token";
    const phoneNumberId = process.env.META_PHONE_NUMBER_ID || "mock_phone_id";
    
    let whatsappMessageId = "mock_msg_" + Math.random().toString(36).substring(7);

    if (metaToken !== "mock_token") {
      const response = await fetch(`https://graph.facebook.com/v20.0/${phoneNumberId}/messages`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${metaToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: leadPhone.replace(/[^0-9]/g, ""),
          type: "text",
          text: {
            preview_url: false,
            body: aiMessage
          }
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to send WhatsApp message");
      }
      whatsappMessageId = data.messages?.[0]?.id || whatsappMessageId;
    }

    // 3. Update the lead status to 'Contacted' and save the AI summary/message ID
    await updateLeadStatus(leadId, "Contacted", aiMessage, whatsappMessageId);
    
    revalidatePath("/dashboard/leads");
    return { success: true, aiMessage };
  } catch (error: any) {
    console.error("WhatsApp Action Error:", error);
    return { success: false, error: error.message };
  }
}

export async function sendFinalConfirmationAction(leadId: string, leadPhone: string) {
  try {
    const finalMessage = "Awesome! We have confirmed your details and our team will connect with you soon. We look forward to speaking with you!";
    
    const metaToken = process.env.META_WHATSAPP_TOKEN || "mock_token";
    const phoneNumberId = process.env.META_PHONE_NUMBER_ID || "mock_phone_id";
    
    if (metaToken !== "mock_token") {
      await fetch(`https://graph.facebook.com/v20.0/${phoneNumberId}/messages`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${metaToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: leadPhone.replace(/[^0-9]/g, ""),
          type: "text",
          text: { body: finalMessage }
        })
      });
    }

    await updateLeadStatus(leadId, "Confirmed");
    
    revalidatePath("/dashboard/leads");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function fetchLeadMessagesAction(leadId: string) {
  try {
    const messages = await getLeadMessages(leadId);
    return { success: true, messages };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function sendManualMessageAction(leadId: string, leadPhone: string, messageText: string) {
  try {
    const metaToken = process.env.META_WHATSAPP_TOKEN || "mock_token";
    const phoneNumberId = process.env.META_PHONE_NUMBER_ID || "mock_phone_id";
    
    if (metaToken !== "mock_token") {
      await fetch(`https://graph.facebook.com/v20.0/${phoneNumberId}/messages`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${metaToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: leadPhone.replace(/[^0-9]/g, ""),
          type: "text",
          text: { body: messageText }
        })
      });
    }

    await insertLeadMessage({
      lead_id: leadId,
      sender: "business",
      message_text: messageText
    });
    
    revalidatePath("/dashboard/leads");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateBusinessPromptAction(businessId: string, prompt: string) {
  try {
    await updateBusinessAIPrompt(businessId, prompt);
    revalidatePath("/dashboard/leads");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
