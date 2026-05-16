import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { text, targetLanguage } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const direction = targetLanguage === 'as' ? 'English to Assamese' : 'Assamese to English';

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{
          text: `You are an expert translator. 
          Translate the following text from ${direction}.
          Only provide the translated text natively, without quotes or extra context.
          
          Text: "${text}"`
        }]
      }],
    });

    const response = await result.response;
    const translatedText = response.text() || "";

    return NextResponse.json({ translation: translatedText.trim() });
  } catch (error: any) {
    console.error("Translate API error:", error);
    return NextResponse.json({ error: "Failed to generate AI response." }, { status: 500 });
  }
}
