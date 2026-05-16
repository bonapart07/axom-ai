const { GoogleGenerativeAI } = require("@google/generative-ai");

async function test() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    // There is no listModels in the new official SDK directly, but we can try v1
    console.log("Listing models via fetch...");
    const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await resp.json();
    console.log("Models:", data.models?.map(m => m.name));
  } catch (e) {
    console.error("Error:", e.message);
  }
}
test();
