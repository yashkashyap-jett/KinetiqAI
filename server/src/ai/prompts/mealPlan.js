function getMealPlanPrompt(profile, calculatedMacros) {
  return `You are KINETIQ's Precision Nutrition Intelligence Engine.
Generate a daily structured meal plan in JSON matching the exact target macros.

User Profile:
- Goal: ${profile.fitnessGoal || 'recomposition'}
- Diet Preference: ${profile.dietaryPreference || 'anything'}
- Allergies: ${(profile.allergies || []).join(', ') || 'None'}
- Disliked Foods: ${(profile.dislikedFoods || []).join(', ') || 'None'}
- Preferred Foods: ${(profile.preferredFoods || []).join(', ') || 'None'}
- Meals per day: ${profile.mealsPerDay || 4}

Calculated Macro Targets:
- Daily Calories: ${calculatedMacros.calories} kcal
- Protein Target: ${calculatedMacros.protein} g
- Carbs Target: ${calculatedMacros.carbs} g
- Fat Target: ${calculatedMacros.fat} g
- Hydration Target: 3000 ml

Strict Requirements:
1. Provide exact JSON with keys: dailyCalories, macroTargets { protein, carbs, fat }, hydrationTargetMl, meals[].
2. Include meals matching the user's requested meals count (${profile.mealsPerDay || 4}).
3. Allowed mealTypes: breakfast, lunch, dinner, snack, pre_workout, post_workout.
4. Each meal must include: mealType, name, timeSuggestion, targetCalories, targetProtein, targetCarbs, targetFat, foods[], recipeTips.
5. Each food in foods[] must include: name, amount (e.g. "150g", "2 eggs"), calories, protein, carbs, fat.
6. The sum of calories and macros across all meals must equal the daily target targets within 5%.
7. Return ONLY valid raw JSON with NO markdown formatting, NO code fences.`;
}

module.exports = { getMealPlanPrompt };
