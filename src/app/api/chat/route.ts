import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { checkPremiumAccess } from "@/lib/premium";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized. Please login." }, { status: 401 });
    }

    const { isPremium, limit, usedToday } = await checkPremiumAccess(userId);
    if (usedToday >= limit) {
      return NextResponse.json(
        { error: "Daily usage limit reached. Please upgrade to Premium." },
        { status: 403 }
      );
    }

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
    
    CRITICAL: All answers must be formatted as a direct exam answer for a student (direct, structured, academic, and ready to write in an exam paper to score full marks). 
    - Start immediately with the definition, statement, or direct answer.
    - Do NOT include any conversational greetings, filler, or intro/outro phrases (such as "Certainly!", "Hello!", "Here is your explanation:", "I hope this helps").
    - Use clear headings, numbered lists, bullet points, and highlight key terms.
    - Keep it structured, clear, and concise.
    
    User's message: ${message}`);

    const response = await result.response;
    const text = response.text() || "";

    return NextResponse.json({ reply: text });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate AI response." }, { status: 500 });
  }
}
