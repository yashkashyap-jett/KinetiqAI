const { generateAIContent } = require('./src/ai/gemini');
const { workoutPlanSchema, validateAIResponse } = require('./src/ai/validator');

async function test() {
  require('dotenv').config();
  try {
    const raw = await generateAIContent("Generate a 3-day full body workout plan formatted as JSON.");
    console.log("Raw JSON:", raw);
    
    let parsed = JSON.parse(raw);
    const valid = validateAIResponse(workoutPlanSchema, parsed);
    console.log("Validation success:", valid.success);
    if (!valid.success) {
      console.log("Errors:", valid.error);
    }
  } catch (err) {
    console.error(err);
  }
}
test();
