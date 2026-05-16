const { GoogleGenAI } = require("@google/genai");

async function test() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log("Using API Key starting with:", apiKey ? apiKey.substring(0, 5) : "MISSING");
  
  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const result = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [{
        role: 'user',
        parts: [{ text: "Say hello in Assamese" }]
      }],
    });
    console.log("Result keys:", Object.keys(result));
    if (result.response) console.log("Response keys:", Object.keys(result.response));
    const text = result.response?.candidates?.[0]?.content?.parts?.[0]?.text || result.text || "";
    console.log("Extracted Text:", text);
  } catch (e) {
    console.error("API Call Error:", e.message);
    if (e.response) console.error("Response data:", JSON.stringify(e.response.data));
  }
}
test();
