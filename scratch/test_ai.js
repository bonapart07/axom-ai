const { GoogleGenAI } = require("@google/genai");
async function test() {
  try {
    const ai = new GoogleGenAI({ apiKey: "test" });
    console.log("AI Object Keys:", Object.keys(ai));
    if (ai.models) console.log("Models Object Keys:", Object.keys(ai.models));
  } catch (e) {
    console.error("Error initializing AI:", e);
  }
}
test();
