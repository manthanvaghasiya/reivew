import { GoogleGenerativeAI } from "@google/generative-ai";
import { getLeadMessages, insertLeadMessage, updateLeadStatus, getBusinessById, getBusinessByOwner } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function processIncomingLeadMessage(leadId: string, businessId: string, userMessage: string, leadPhone: string) {
  try {
    // 1. Save the incoming message
    await insertLeadMessage({
      lead_id: leadId,
      sender: "user",
      message_text: userMessage
    });

    // 2. Fetch context
    const business = await getBusinessById(businessId);
    if (!business) throw new Error("Business not found");
    
    const messages = await getLeadMessages(leadId);
    
    // 3. Prepare AI Prompt
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    let systemInstruction = `You are an AI assistant for a business named "${business.name}" in the "${business.industry}" industry.
Your goal is to converse politely, answer questions, and ultimately confirm their interest/book a meeting.
If the user agrees to a meeting, explicitly confirms their interest, or provides their details for follow-up, you MUST include the exact phrase [CONFIRMED] somewhere in your response.`;

    if (business.custom_ai_prompt) {
      systemInstruction += `\n\nCustom Instructions from the business owner:\n${business.custom_ai_prompt}`;
    }

    const chatContext = messages.map(m => `${m.sender.toUpperCase()}: ${m.message_text}`).join("\n");
    
    const prompt = `${systemInstruction}

Conversation History:
${chatContext}

Generate the AI's next response:`;

    const result = await model.generateContent(prompt);
    let aiResponseText = await result.response.text();
    
    let isConfirmed = false;
    if (aiResponseText.includes("[CONFIRMED]")) {
      isConfirmed = true;
      aiResponseText = aiResponseText.replace("[CONFIRMED]", "").trim();
      if (!aiResponseText) {
        aiResponseText = "Awesome! We have confirmed your details and our team will connect with you soon. We look forward to speaking with you!";
      }
    }

    // 4. Send via Meta WhatsApp API
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
          recipient_type: "individual",
          to: leadPhone.replace(/[^0-9]/g, ""),
          type: "text",
          text: {
            preview_url: false,
            body: aiResponseText
          }
        })
      });
    }

    // 5. Save AI response
    await insertLeadMessage({
      lead_id: leadId,
      sender: "ai",
      message_text: aiResponseText
    });

    // 6. Update Lead Status if confirmed
    if (isConfirmed) {
      await updateLeadStatus(leadId, "Confirmed", undefined, undefined);
    } else {
      await updateLeadStatus(leadId, "Contacted", undefined, undefined);
    }

    return { success: true, aiResponseText, isConfirmed };
  } catch (error: any) {
    console.error("AI Responder Error:", error);
    return { success: false, error: error.message };
  }
}
