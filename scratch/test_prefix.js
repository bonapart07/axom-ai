const { GoogleGenAI } = require("@google/genai");

async function test() {
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const result = await ai.models.generateContent({
      model: 'models/gemini-1.5-flash',
      contents: [{
        role: 'user',
        parts: [{ text: "Say hello in Assamese" }]
      }],
    });
    console.log("Success!");
  } catch (e) {
    console.error("Error:", e.message);
  }
}
test();
