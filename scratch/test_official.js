const { GoogleGenerativeAI } = require("@google/generative-ai");

async function test() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  try {
    const result = await model.generateContent("Hello");
    const response = await result.response;
    const text = response.text();
    console.log("Success with Official SDK:", text);
  } catch (e) {
    console.error("Official SDK Error:", e.message);
  }
}
test();
