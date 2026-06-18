import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  console.warn("⚠️ GEMINI_API_KEY is missing in backend/.env");
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const fallbackModels = [
  process.env.GEMINI_MODEL || "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash",
];

const cleanModels = [...new Set(fallbackModels.filter(Boolean))];

export const generateAIResponse = async (prompt) => {
  let lastError = null;

  for (const model of cleanModels) {
    try {
      console.log(`🤖 Trying Gemini model: ${model}`);

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      return response.text;
    } catch (error) {
      lastError = error;

      console.error(`❌ Gemini model failed: ${model}`);
      console.error(error.message);

      const message = error.message || "";

      const isTemporaryError =
        message.includes("503") ||
        message.includes("UNAVAILABLE") ||
        message.includes("high demand") ||
        message.includes("overloaded");

      if (!isTemporaryError) {
        throw error;
      }
    }
  }

  throw new Error(
    lastError?.message ||
      "AI service is temporarily unavailable. Please try again later."
  );
};