const { GoogleGenAI } = require("@google/genai");

async function test() {
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({ apiKey });
  
  const models = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash', 'gemini-pro'];
  
  for (const model of models) {
    try {
      console.log(`Testing model: ${model}`);
      const result = await ai.models.generateContent({
        model: model,
        contents: [{ role: 'user', parts: [{ text: "Hi" }] }]
      });
      console.log(`SUCCESS with ${model}`);
      process.exit(0);
    } catch (e) {
      console.error(`FAILED with ${model}: ${e.message}`);
    }
  }
}
test();
