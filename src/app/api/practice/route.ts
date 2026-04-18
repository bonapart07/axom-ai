import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert teacher in Assam. Generate a 5-question multiple choice quiz on the topic: "${topic}".
      Provide your response STRICTLY as a valid JSON array of objects.
      Format:
      [
        {
          "id": 1,
          "text": "Question in Assamese",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correct": 0 // index of correct option (0-3)
        }
      ]
      Generate EXACTLY 5 questions. Do not include markdown blocks like \`\`\`json. Just output the raw JSON array.`,
    });

    try {
      const text = response.text.replace(/```json/g, "").replace(/```/g, "").trim();
      const jsonResult = JSON.parse(text);
      return NextResponse.json(jsonResult);
    } catch (parseError) {
      console.error("Failed to parse Gemini JSON:", parseError);
      return NextResponse.json({ error: "Failed to structure response as JSON." }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Practice API error:", error);
    return NextResponse.json({ error: "Failed to generate AI response." }, { status: 500 });
  }
}
