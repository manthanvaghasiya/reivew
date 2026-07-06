"use server";

import { createClient } from "@/lib/supabase/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";

export async function generateSeoContentAction(businessName: string, category: string) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return { success: false, error: "Gemini API key is not configured." };
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are an expert Local SEO specialist.
I need you to generate SEO-optimized content for a Google Business Profile for a business named "${businessName}" in the category of "${category}".

Please return a JSON object with EXACTLY the following structure:
{
  "description": "A high-quality, engaging, and SEO-friendly business description (around 150-200 words) that highlights their expertise in ${category}.",
  "services": [
    {"name": "Service 1", "description": "Short description of service 1"},
    {"name": "Service 2", "description": "Short description of service 2"},
    {"name": "Service 3", "description": "Short description of service 3"}
  ],
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6"]
}

Ensure the response is valid JSON and nothing else. No markdown blocks, just the JSON string.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/```json/g, "").replace(/```/g, "").trim();

    try {
      const parsed = JSON.parse(text);
      return { success: true, data: parsed };
    } catch (e) {
      console.error("Failed to parse AI response:", text);
      return { success: false, error: "Failed to parse AI response." };
    }
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return { success: false, error: error.message || "An unexpected error occurred." };
  }
}

export async function saveSeoContentAction(
  locationId: string, 
  category: string, 
  description: string, 
  services: any[], 
  keywords: string[]
) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("locations")
    .update({
      category,
      description,
      services,
      keywords
    })
    .eq("id", locationId);

  if (error) {
    console.error("Supabase update error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/seo");
  return { success: true };
}
