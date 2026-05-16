import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { fileData, mimeType } = await req.json();

    if (!fileData || !mimeType) {
      return NextResponse.json({ error: "File data and mimeType are required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
             { inlineData: { mimeType, data: fileData } },
             { text: `Analyze this uploaded document/image. 
             Provide your response STRICTLY as a valid JSON object matching this schema:
             {
               "summary": "A concise 2-3 sentence summary in Assamese",
               "points": ["Key point 1 in Assamese", "Key point 2 in Assamese", "Key point 3 in Assamese"]
             }
             Do not include markdown blocks like \`\`\`json. Just output the raw JSON object.` 
             }
          ],
        }
      ]
    });

    try {
      const response = await result.response;
      const rawText = response.text() || "";
      const text = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
      const jsonResult = JSON.parse(text);
      return NextResponse.json(jsonResult);
    } catch (parseError) {
      console.error("Failed to parse Gemini JSON:", parseError);
      return NextResponse.json({ error: "Failed to structure response as JSON." }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Notes API error:", error);
    return NextResponse.json({ error: "Failed to generate AI response." }, { status: 500 });
  }
}
