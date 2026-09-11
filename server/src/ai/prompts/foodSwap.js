function getFoodSwapPrompt(originalFood, profile) {
  return `You are KINETIQ Smart Food Swap Engine.
Recommend 3 macro-equivalent or healthier food alternatives for "${originalFood}".

User Dietary Restrictions:
- Preference: ${profile.dietaryPreference || 'none'}
- Allergies: ${(profile.allergies || []).join(', ') || 'None'}
- Disliked: ${(profile.dislikedFoods || []).join(', ') || 'None'}

Requirements:
1. Provide 3 realistic substitute options.
2. Return JSON with keys: originalFood, alternatives[].
3. Each alternative in alternatives[] must include: name, amount, calories, protein, carbs, fat, reasoning.
4. Raw JSON only.`;
}

module.exports = { getFoodSwapPrompt };
