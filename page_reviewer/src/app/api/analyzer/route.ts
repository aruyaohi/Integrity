import dotenv from 'dotenv';
dotenv.config({path: '.env.local'});
import { GoogleGenAI } from "@google/genai";

// Load the API key
const apiKey = process.env.API_KEY;

if (!apiKey) {
  throw new Error("AI_API_KEY not set in environment variables");
}


const ai = new GoogleGenAI({ apiKey: apiKey });

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: "Explain how AI works in a few words",
  });
  console.log(response.text);
}

main();