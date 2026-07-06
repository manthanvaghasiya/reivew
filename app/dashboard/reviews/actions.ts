"use server";

import { revalidatePath } from "next/cache";
import { insertMockGoogleReview, updateGoogleReviewReply, getGoogleReviewsByLocation, getLocationsByBusiness } from "@/lib/supabase/queries";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateMockReviewAction(businessId: string) {
  // First, get the primary location for this business
  const locations = await getLocationsByBusiness(businessId);
  if (!locations || locations.length === 0) {
    throw new Error("You must create a location/branch first before generating reviews.");
  }
  
  const primaryLocation = locations[0];

  const mockAuthors = ["Sarah Jenkins", "David Chen", "Michael Scott", "Elena Rodriguez", "James Wilson"];
  const mockReviews = [
    "Excellent service from start to finish. The onboarding was incredibly smooth.",
    "Good overall, but I wish there were a few more customization options.",
    "The team's clear planning and boundless creativity made every project easy to manage.",
    "Decent experience. Wait times were a bit long but staff was friendly.",
    "Absolutely stellar! Exceeded all my expectations. Highly recommended."
  ];

  const randomAuthor = mockAuthors[Math.floor(Math.random() * mockAuthors.length)];
  const randomReview = mockReviews[Math.floor(Math.random() * mockReviews.length)];
  const randomRating = Math.floor(Math.random() * 2) + 4; // 4 or 5 stars

  await insertMockGoogleReview(primaryLocation.id, {
    author_name: randomAuthor,
    rating: randomRating,
    review_text: randomReview,
  });

  revalidatePath("/dashboard/reviews");
}

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
    model: "gemini-1.5-flash",
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
