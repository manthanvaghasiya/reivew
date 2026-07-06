"use server";

import { logFeedbackEvent, logQrScan } from "@/lib/supabase/queries";
import type { FeedbackType } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function logFeedbackAction(locationId: string, type: FeedbackType, message?: string) {
  try {
    await logFeedbackEvent(locationId, type, message);
  } catch (error) {
    // Fail silently so the user flow isn't blocked, but log it for debugging
    console.error("Failed to log feedback event:", error);
  }
}

export async function logQrScanAction(locationId: string) {
  try {
    await logQrScan(locationId);
  } catch (error) {
    console.error("Failed to log QR scan:", error);
  }
}

export async function submitPrivateFeedbackAction(locationId: string, message: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("private_feedback")
      .insert({ location_id: locationId, message });
      
    if (error) {
      console.error("Failed to submit private feedback:", error);
      return { success: false, error: "Failed to submit feedback" };
    }
    
    return { success: true };
  } catch (error: any) {
    console.error("submitPrivateFeedbackAction error:", error);
    return { success: false, error: error.message };
  }
}

export async function generateReviewsAction(businessId: string, rating: number, selectedTags: string[] = [], flowMode: 'direct' | 'interactive' = 'direct') {
  try {
    // If rating is 3 or below, it's negative feedback, don't use AI
    if (rating <= 3) {
      return { success: true, mode: "feedback", review: null };
    }

    // Initialize Supabase to fetch business context
    const supabase = await createClient();
    const { data: business, error } = await supabase
      .from("businesses")
      .select("name, industry, ai_keywords")
      .eq("id", businessId)
      .single();

    if (error || !business) {
      console.error("Failed to fetch business context:", error);
      return { success: false, error: "Failed to fetch business details" };
    }

    // Call the AI Engine
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      console.error("No Google AI API key configured.");
      return { success: false, error: "AI configuration missing" };
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-2.5-flash as it's optimized for fast text tasks
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const tagsContext = selectedTags.length > 0 
      ? `The customer highlighted the following aspects: ${selectedTags.join(", ")}.` 
      : "";

    const prompt = flowMode === 'interactive' 
      ? `
You are a helpful assistant generating highly realistic, natural-sounding customer reviews.
The business is named "${business.name}" and is in the "${business.industry}" industry.
Keywords to guide the reviews: ${business.ai_keywords || "good service, friendly staff"}.
${tagsContext}

Please write exactly 3 distinct, highly realistic, natural-sounding reviews (2-3 sentences max each) matching a ${rating}-star rating that specifically incorporate the customer's highlighted aspects if provided.
Return the output as a raw JSON object with a "reviews" array field containing exactly 3 strings. Example: {"reviews": ["Review 1...", "Review 2...", "Review 3..."]}
Do not include any other text or markdown, just the JSON object.
      `.trim()
      : `
You are a helpful assistant generating a highly realistic, natural-sounding customer review.
The business is named "${business.name}" and is in the "${business.industry}" industry.
Keywords to guide the review: ${business.ai_keywords || "good service, friendly staff"}.
${tagsContext}

Please write exactly ONE highly realistic, natural-sounding review (2-3 sentences max) matching a ${rating}-star rating that specifically incorporates the customer's highlighted aspects if provided.
Return the output as a raw JSON object with a single "review" string field. Example: {"review": "The review text goes here..."}
Do not include any other text or markdown, just the JSON object.
      `.trim();

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Parse the JSON output
    let review = "";
    let reviews: string[] = [];
    
    try {
      const parsed = JSON.parse(responseText);
      
      if (flowMode === 'interactive') {
        if (!parsed.reviews || !Array.isArray(parsed.reviews) || parsed.reviews.length === 0) {
          throw new Error("Parsed AI result is missing 'reviews' array field");
        }
        reviews = parsed.reviews;
      } else {
        if (!parsed.review || typeof parsed.review !== "string") {
          throw new Error("Parsed AI result is missing 'review' string field");
        }
        review = parsed.review;
      }
    } catch (parseErr) {
      console.error("Failed to parse AI output:", responseText, parseErr);
      return { success: false, error: "Failed to generate review. Please try again." };
    }

    return { 
      success: true, 
      mode: "review", 
      review: flowMode === 'direct' ? review : undefined,
      reviews: flowMode === 'interactive' ? reviews : undefined
    };
  } catch (err: any) {
    console.error("generateReviewsAction Error:", err);
    return { success: false, error: err.message || "An unexpected error occurred" };
  }
}
