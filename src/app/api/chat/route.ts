import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are Axom AI, a helpful, encouraging, and intelligent tutor for students in Assam.
      You must reply EXCLUSIVENLY in the Assamese language whenever explaining things. 
      Keep answers concise and clear.
      
      User's message: ${message}`,
    });

    return NextResponse.json({ reply: response.text || "" });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Failed to generate AI response." }, { status: 500 });
  }
}
