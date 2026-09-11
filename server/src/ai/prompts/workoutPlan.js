function getWorkoutPlanPrompt(profile, config = null) {
  let prompt = `You are KINETIQ's Head Strength & Conditioning Intelligence Engine.
Generate a structured weekly workout plan in JSON based on the user profile below.\n\nUser Profile:
- Age: ${profile.age || 25}
- Gender: ${profile.gender || 'male'}
- Height: ${profile.height || 178} cm, Weight: ${profile.weight || 75} kg
- Goal: ${config ? config.goal : profile.fitnessGoal || 'recomposition'}
- Experience Level: ${config ? config.experience : profile.fitnessLevel || 'intermediate'}
- Days/week: ${config ? config.daysPerWeek : profile.workoutDaysPerWeek || 4} days
- Duration per workout: ${config ? config.durationMin : profile.avgWorkoutDuration || 60} mins
- Available Equipment: ${config ? config.equipment : profile.workoutLocation || 'gym'}

`;

  if (config && config.customSchedule) {
    prompt += `CUSTOM SPLIT REQUIREMENT:
The user has explicitly requested the following custom weekly schedule. You MUST map your generated days exactly to this structure.
`;
    config.customSchedule.forEach((day, idx) => {
      prompt += `- Day ${idx} (${day.dayName}): ${day.isRest ? 'REST DAY' : 'WORKOUT: Target Muscles: ' + day.muscles.join(', ')}\n`;
    });
    prompt += `\nGenerate ONLY exercises that target the specified muscles for each training day. Do NOT generate exercises for muscles that are not listed for that day.\n\n`;
  } else {
    prompt += `Make sure to schedule exactly ${config ? config.daysPerWeek : profile.workoutDaysPerWeek || 4} workout days, and the rest as rest days. There must be exactly 7 days in the days array.\n\n`;
  }

  prompt += `Strict Requirements:
1. Provide exact JSON with keys: "splitType" (string), "weeklyFrequency" (number), "days" (array).
2. For each day, include: "dayIndex" (number 0-6), "dayName" (string, e.g., "Monday"), "splitName" (string, e.g., "Upper Push" or "Rest"), "focusArea" (string), "isRestDay" (boolean), "estimatedDurationMin" (number), "exercises" (array).
3. For rest days, set "isRestDay": true, "exercises": [].
4. For training days, provide exercises that fit within the ${config ? config.durationMin : 60} mins duration window. Adjust the volume (number of exercises and sets) accordingly! (e.g. 30min = ~3-4 exercises, 90min = ~6-8 exercises).
5. For training days, provide exercises array with EXACTLY these fields: "name" (string), "primaryMuscles" (array of strings), "equipment" (string, MUST be available based on the user's constraints), "setsCount" (number), "targetReps" (string, e.g. "8-12"), "restSeconds" (number), "notes" (string).
6. Ensure exercise selection matches the user's specified equipment strictly (e.g., if equipment is 'Bodyweight only', do not use dumbbells or barbells; if 'Dumbbells only', use only dumbbell and bodyweight exercises).
7. Prioritize exercise variety and innovation to ensure the plan is fresh and avoids repetitive patterns across the week.
8. Return ONLY valid raw JSON with NO markdown formatting, NO code fences (\`\`\`json), NO introductory text. Do not omit any required fields.`;

  return prompt;
}

module.exports = { getWorkoutPlanPrompt };
