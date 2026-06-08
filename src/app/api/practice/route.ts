import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getFirebaseAdmin } from "@/firebaseAdmin";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized. Please login." }, { status: 401 });
    }

    const { adminDb } = getFirebaseAdmin();
    const userDoc = await adminDb.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const userData = userDoc.data();
    const plan = userData?.plan || "free";
    const isUnlimited = userData?.isUnlimited || false;
    const isPremium = plan === "premium" || plan === "school" || isUnlimited;

    if (!isPremium) {
      const trialsUsed = userData?.practiceFreeTrialsUsed || 0;
      if (trialsUsed >= 2) {
        return NextResponse.json(
          { error: "Free trials for practice quizzes exhausted. Please upgrade to Premium." },
          { status: 403 }
        );
      }
    }

    const { class: className, subject, chapter, count = 10 } = await req.json();

    if (!subject || !chapter) {
      return NextResponse.json({ error: "Subject and Chapter are required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{
          text: `You are an expert teacher in Assam. Generate a ${count}-question multiple choice quiz for ${className} on the subject: "${subject}" and chapter/topic: "${chapter}".
          
          CRITICAL: Ensure these questions are unique, creative, and different from standard textbook questions. 
          Focus on testing deep understanding rather than simple recall.
          
          Session ID for uniqueness: ${Date.now()}
          
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
          Generate EXACTLY ${count} questions. Do not include markdown blocks like \`\`\`json. Just output the raw JSON array.`
        }]
      }],
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
    console.error("Practice API error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate AI response." }, { status: 500 });
  }
}
