function getWorkoutPlanPrompt(profile, config = null) {
  const targetWorkoutDays = config ? config.daysPerWeek : (profile.workoutDaysPerWeek || 4);
  const targetDuration = config ? config.durationMin : (profile.avgWorkoutDuration || 60);
  const splitType = config?.splitType || (profile.workoutDaysPerWeek >= 5 ? 'Push / Pull / Legs' : 'Upper / Lower');

  let prompt = `You are KINETIQ's Head Strength & Conditioning Intelligence Engine.
Generate a structured weekly workout plan in JSON based on the user profile below.

User Profile:
- Age: ${profile.age || 25}
- Gender: ${profile.gender || 'male'}
- Height: ${profile.height || 178} cm, Weight: ${profile.weight || 75} kg
- Goal: ${config ? config.goal : profile.fitnessGoal || 'recomposition'}
- Experience Level: ${config ? config.experience : profile.fitnessLevel || 'intermediate'}
- Workout Days/week: exactly ${targetWorkoutDays} training days (plus ${7 - targetWorkoutDays} rest days)
- Duration per workout: ${targetDuration} mins
- Available Equipment: ${config ? config.equipment : profile.workoutLocation || 'gym'}
- Preferred Workout Split: ${splitType}

`;

  if (config && config.splitType === 'Custom Split' && config.customSchedule) {
    prompt += `CUSTOM SPLIT REQUIREMENT:
The user has explicitly requested the following custom weekly schedule. You MUST map your generated days exactly to this structure.
`;
    config.customSchedule.forEach((day, idx) => {
      prompt += `- Day ${idx} (${day.dayName}): ${day.isRest ? 'REST DAY' : 'WORKOUT: Target Muscles: ' + day.muscles.join(', ')}\n`;
    });
    prompt += `\nGenerate ONLY exercises that target the specified muscles for each training day. Do NOT generate exercises for muscles that are not listed for that day.\n\n`;
  } else {
    prompt += `WORKOUT SPLIT & SCHEDULE REQUIREMENT:
The user has explicitly chosen the "${splitType}" split with exactly ${targetWorkoutDays} training days and ${7 - targetWorkoutDays} rest days.
This split preference is a MANDATORY HARD CONSTRAINT. You MUST structure the weekly training days and target muscles strictly according to "${splitType}". Under NO circumstances should you substitute or revert to any other split.

Split-Specific Programming Rules:
`;

    if (splitType.includes('Bro Split') || splitType.includes('Single Muscle')) {
      prompt += `- BRO SPLIT / SINGLE MUSCLE: Every workout day MUST primarily target a single dedicated muscle group (or direct antagonistic pair like Biceps & Triceps).
  Examples of daily focus across ${targetWorkoutDays} training days:
  * 5 days: Day 1: Chest, Day 2: Back, Day 3: Shoulders, Day 4: Legs (Quads/Hamstrings/Calves), Day 5: Arms (Biceps & Triceps).
  * 6 days: Day 1: Chest, Day 2: Back, Day 3: Shoulders, Day 4: Quads & Calves, Day 5: Hamstrings & Glutes, Day 6: Arms (Biceps & Triceps).
  * 4 days: Day 1: Chest, Day 2: Back, Day 3: Shoulders & Arms, Day 4: Legs.
  * 3 days: Day 1: Chest & Triceps, Day 2: Back & Biceps, Day 3: Legs & Shoulders.
  * 1-2 days: Dedicated primary muscle group focus per day.
  CRITICAL: Do NOT generate "Upper Body", "Lower Body", or "Full Body" sessions. Every training day's splitName and focusArea MUST reflect the dedicated single muscle group (e.g., "Chest Focus", "Back & Lats", "Deltoids / Shoulders", "Legs / Quads & Hamstrings", "Arms / Biceps & Triceps").\n\n`;
    } else if (splitType.includes('Push / Pull / Legs') || splitType === 'PPL') {
      prompt += `- PUSH / PULL / LEGS (PPL): Every training day MUST strictly follow Push, Pull, or Legs:
  * Push days: Chest, Shoulders (Front/Lateral), Triceps.
  * Pull days: Back (Lats, Upper/Mid Back), Biceps, Rear Deltoids.
  * Legs days: Quads, Hamstrings, Glutes, Calves.
  CRITICAL: Do NOT generate generic "Upper Body" or single-muscle days. Use "Push Focus", "Pull Focus", or "Legs Focus" for splitName.\n\n`;
    } else if (splitType.includes('Upper / Lower / Push / Pull')) {
      prompt += `- UPPER / LOWER / PUSH / PULL HYBRID: Training days MUST alternate between Upper Body, Lower Body, Push (Chest/Shoulders/Triceps), and Pull (Back/Biceps) according to the ${targetWorkoutDays} training days.\n\n`;
    } else if (splitType.includes('Upper / Lower')) {
      prompt += `- UPPER / LOWER SPLIT: Training days MUST strictly alternate between Upper Body (Chest, Back, Shoulders, Arms) and Lower Body (Quads, Hamstrings, Glutes, Calves, Core). Do NOT generate Bro Split or PPL days.\n\n`;
    } else if (splitType.includes('Full Body')) {
      prompt += `- FULL BODY: Every training day MUST target all major muscle groups (chest, back, legs, shoulders, core) with balanced compound and accessory movements. Do NOT generate Upper/Lower or single-muscle days.\n\n`;
    } else {
      prompt += `- Follow the selected "${splitType}" split strictly for all ${targetWorkoutDays} training days.\n\n`;
    }

    prompt += `Schedule exactly ${targetWorkoutDays} workout days (with isRestDay: false) and ${7 - targetWorkoutDays} rest days (with isRestDay: true, exercises: []). There must be exactly 7 days in the days array (indices 0 to 6 representing Monday through Sunday).\n\n`;
  }

  prompt += `Strict Requirements:
1. Provide exact JSON with keys: "splitType" (string, MUST be "${splitType}"), "weeklyFrequency" (number, MUST be ${targetWorkoutDays}), "days" (array of exactly 7 days).
2. For each day, include: "dayIndex" (number 0-6), "dayName" (string, "Monday" through "Sunday"), "splitName" (string matching the assigned split day, e.g. "Chest Focus" or "Rest Day"), "focusArea" (string describing target muscles, or "Rest & Recovery"), "isRestDay" (boolean), "estimatedDurationMin" (number, 0 for rest days), "exercises" (array).
3. For rest days, set "isRestDay": true, "exercises": [].
4. For training days, provide exercises that fit within the ${targetDuration} mins duration window. Adjust the volume (number of exercises and sets) accordingly! (e.g. 30min = ~3-4 exercises, 90min = ~6-8 exercises).
5. For training days, provide exercises array with EXACTLY these fields: "name" (string), "primaryMuscles" (array of strings), "equipment" (string, MUST be available based on the user's constraints), "setsCount" (number), "targetReps" (string, e.g. "8-12"), "restSeconds" (number), "notes" (string).
6. Ensure exercise selection matches the user's specified equipment strictly (e.g., if equipment is 'Bodyweight only', do not use dumbbells or barbells; if 'Dumbbells only', use only dumbbell and bodyweight exercises).
7. Prioritize exercise variety and innovation to ensure the plan is fresh and avoids repetitive patterns across the week.
8. Return ONLY valid raw JSON with NO markdown formatting, NO code fences (\`\`\`json), NO introductory text. Do not omit any required fields.`;

  return prompt;
}

module.exports = { getWorkoutPlanPrompt };
