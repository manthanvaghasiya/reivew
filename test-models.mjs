import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

const apiKey = process.env.GEMINI_API_KEY || "";

async function run() {
  try {
    const fetchRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await fetchRes.json();
    console.log(data.models.map(m => m.name).join(", "));
  } catch (e) {
    console.error(e);
  }
}
run();
