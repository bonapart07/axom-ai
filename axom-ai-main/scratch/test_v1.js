const { GoogleGenAI } = require("@google/genai");

async function test() {
  const apiKey = process.env.GEMINI_API_KEY;
  // Try setting apiVersion
  const ai = new GoogleGenAI({ apiKey, apiVersion: 'v1' });
  
  try {
    const result = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
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
