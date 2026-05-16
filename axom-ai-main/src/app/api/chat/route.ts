import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    
    // Format history for Gemini SDK (limit to last 10 messages for efficiency)
    let formattedHistory = (history || []).map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    // CRITICAL: Gemini history MUST start with a 'user' role
    while (formattedHistory.length > 0 && formattedHistory[0].role !== "user") {
      formattedHistory.shift();
    }

    // Also limit to last 10 messages
    formattedHistory = formattedHistory.slice(-10);

    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 2000,
      },
    });

    const result = await chat.sendMessage(`You are Axom AI, a helpful, encouraging, and intelligent tutor for students in Assam.
    You must reply EXCLUSIVELY in the Assamese language whenever explaining things. 
    Keep answers concise and clear unless asked for a long explanation.
    
    User's message: ${message}`);

    const response = await result.response;
    const text = response.text() || "";

    return NextResponse.json({ reply: text });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate AI response." }, { status: 500 });
  }
}
