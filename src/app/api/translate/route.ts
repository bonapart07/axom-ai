import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { text, targetLanguage } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const direction = targetLanguage === 'as' ? 'English to Assamese' : 'Assamese to English';

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert translator. 
      Translate the following text from ${direction}.
      Only provide the translated text natively, without quotes or extra context.
      
      Text: "${text}"`,
    });

    return NextResponse.json({ translation: (response.text || "").trim() });
  } catch (error: any) {
    console.error("Translate API error:", error);
    return NextResponse.json({ error: "Failed to generate AI response." }, { status: 500 });
  }
}
