"use server";

import { revalidatePath } from "next/cache";
import { updateGoogleReviewReply, getGoogleReviewsByLocation, getLocationsByBusiness } from "@/lib/supabase/queries";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");



export async function generateAiReplyAction(businessId: string) {
  const locations = await getLocationsByBusiness(businessId);
  if (!locations || locations.length === 0) return;
  
  const primaryLocation = locations[0];
  const reviews = await getGoogleReviewsByLocation(primaryLocation.id);

  const unansweredReviews = reviews.filter(r => !r.ai_response);

  if (unansweredReviews.length === 0) {
    throw new Error("No unanswered reviews found to process.");
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: "You are a professional customer support representative replying to Google Reviews on behalf of the business owner. Keep responses concise, professional, appreciative of positive feedback, and empathetic to negative feedback. Do not include placeholders like [Your Name]. Just write the message.",
  });

  // Process them sequentially to avoid rate limits
  for (const review of unansweredReviews) {
    if (!review.review_text) continue;

    const prompt = `Please write a response to this ${review.rating}-star review from ${review.author_name}:\n\n"${review.review_text}"`;
    
    try {
      const response = await model.generateContent(prompt);
      const replyText = response.response.text().trim();
      
      await updateGoogleReviewReply(review.id, replyText);
    } catch (err) {
      console.error("Failed to generate AI reply for review", review.id, err);
    }
  }

  revalidatePath("/dashboard/reviews");
}

export async function updateReviewReplyAction(reviewId: string, replyText: string) {
  await updateGoogleReviewReply(reviewId, replyText);
  revalidatePath("/dashboard/reviews");
}
