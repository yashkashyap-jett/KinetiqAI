require('dotenv').config({ path: './.env' });
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function run() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-1.5-flash' });
    const result = await model.generateContent("Say hello");
    console.log("Response:", result.response.text());
  } catch(e) {
    console.error("ERROR:", e.message);
  }
}
run();
