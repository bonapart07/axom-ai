const { GoogleGenAI } = require("@google/genai");

async function test() {
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.list();
    // In some versions it's an async iterator
    let models = [];
    if (typeof response[Symbol.asyncIterator] === 'function') {
      for await (const model of response) {
        models.push(model);
      }
    } else {
      models = response.models || response.data || [];
    }
    console.log("Model names:", models.map(m => m.name));
  } catch (e) {
    console.error("Error:", e.message);
  }
}
test();
