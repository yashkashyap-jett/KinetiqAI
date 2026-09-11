const { GoogleGenerativeAI } = require('@google/generative-ai');
const env = require('../config/env');

let genAI = null;
if (env.GEMINI_API_KEY && env.GEMINI_API_KEY !== 'mock') {
  try {
    genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  } catch (err) {
    console.warn('Failed to initialize GoogleGenerativeAI SDK, will use fallback generation:', err.message);
  }
}

const VALID_MODELS = [
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
];

async function generateAIContent(promptText, options = {}) {
  if (!genAI) {
    throw new Error('GEMINI_API_KEY not configured or invalid');
  }

  const userModel = env.GEMINI_MODEL;
  const candidateModels = Array.from(
    new Set([
      ...(userModel && VALID_MODELS.includes(userModel) ? [userModel] : []),
      ...VALID_MODELS,
    ])
  );

  let lastError = null;

  for (let attempt = 1; attempt <= 2; attempt++) {
    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const reqPayload = {
          contents: [{ role: 'user', parts: [{ text: promptText }] }],
        };

        if (options.jsonMode !== false) {
          reqPayload.generationConfig = { responseMimeType: 'application/json' };
        }

        const result = await model.generateContent(reqPayload);
        const response = await result.response;
        const text = response.text();

        let sanitized = text.trim();
        if (sanitized.startsWith('```')) {
          sanitized = sanitized.replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/i, '');
        }
        return sanitized;
      } catch (err) {
        lastError = err;
        console.warn(`[Gemini API] Model "${modelName}" (Attempt ${attempt}) notice: ${err.message}. Trying next candidate...`);
        // If 429/503/500/502/504 error, pause briefly before retrying next candidate
        if (err.message.includes('429') || err.message.includes('503') || err.message.includes('500') || err.message.includes('502')) {
          await new Promise((r) => setTimeout(r, 800));
        }
      }
    }
  }

  throw lastError || new Error('All Gemini model candidates failed');
}

module.exports = { generateAIContent };
