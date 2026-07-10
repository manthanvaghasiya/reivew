"use server";

import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateAuditReportAction(locationData: {
  name: string;
  category: string;
  description: string;
  address: string;
  phone: string;
}) {
  const model = ai.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          healthScore: {
            type: SchemaType.INTEGER,
            description: "Overall health score from 0 to 100",
          },
          checks: {
            type: SchemaType.OBJECT,
            properties: {
              description: { type: SchemaType.BOOLEAN, description: "Pass if description is high-quality and professional" },
              keywords: { type: SchemaType.BOOLEAN, description: "Pass if SEO-friendly keywords are present" },
              services: { type: SchemaType.BOOLEAN, description: "Pass if multi-service section is well-defined" },
              contact: { type: SchemaType.BOOLEAN, description: "Pass if contact links and physical address are fully mapped" },
            },
            required: ["description", "keywords", "services", "contact"],
          },
          recommendations: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            description: "Targeted list of fixes or improvements (3 to 5 items)",
          },
          suggestedCategories: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            description: "5 to 10 additional service categories to better capture local search traffic",
          }
        },
        required: ["healthScore", "checks", "recommendations", "suggestedCategories"],
      },
    },
  });

  const prompt = `
    You are an expert Local SEO Consultant specializing in Google Business Profiles.
    Evaluate the following branch data and generate a diagnostic health report.
    
    Branch Name: ${locationData.name || 'Not provided'}
    Category/Industry: ${locationData.category || 'Not provided'}
    Business Description: ${locationData.description || 'Not provided'}
    Address: ${locationData.address || 'Not provided'}
    Phone: ${locationData.phone || 'Not provided'}
    
    Strictly evaluate if they have provided a comprehensive description, used keywords related to their industry, and provided all contact info. 
    Be highly critical. If the description is short, lower the score and fail the description check.
    Provide actionable recommendations and specifically suggest 5-10 secondary service categories they should add to their Google Profile based on their primary category.
  `;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();
  
  try {
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Failed to parse AI response:", responseText);
    throw new Error("Failed to generate audit report.");
  }
}
