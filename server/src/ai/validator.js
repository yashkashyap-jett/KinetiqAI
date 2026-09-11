const { z } = require('zod');

// 1. Workout Plan Schema
const workoutPlanSchema = z.object({
  splitType: z.string(),
  weeklyFrequency: z.number(),
  days: z.array(
    z.object({
      dayIndex: z.number(),
      dayName: z.string(),
      splitName: z.string(),
      focusArea: z.string(),
      isRestDay: z.boolean(),
      estimatedDurationMin: z.number(),
      exercises: z.array(
        z.object({
          name: z.string(),
          primaryMuscles: z.array(z.string()),
          equipment: z.string().nullish(),
          setsCount: z.number(),
          targetReps: z.string(),
          restSeconds: z.number(),
          notes: z.string().nullish(),
        }).passthrough()
      ),
    }).passthrough()
  ),
}).passthrough();

// 2. Meal Plan Schema
const mealPlanSchema = z.object({
  dailyCalories: z.number(),
  macroTargets: z.object({
    protein: z.number(),
    carbs: z.number(),
    fat: z.number(),
  }),
  hydrationTargetMl: z.number(),
  meals: z.array(
    z.object({
      mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack', 'pre_workout', 'post_workout']),
      name: z.string(),
      timeSuggestion: z.string().nullish(),
      targetCalories: z.number(),
      targetProtein: z.number(),
      targetCarbs: z.number(),
      targetFat: z.number(),
      foods: z.array(
        z.object({
          name: z.string(),
          amount: z.string(),
          calories: z.number(),
          protein: z.number(),
          carbs: z.number(),
          fat: z.number(),
        }).passthrough()
      ),
      recipeTips: z.string().nullish(),
    }).passthrough()
  ),
}).passthrough();

// 3. Weekly Review Schema
const weeklyReviewSchema = z.object({
  scores: z.object({
    training: z.number(),
    nutrition: z.number(),
    recovery: z.number(),
    consistency: z.number(),
  }).passthrough(),
  summary: z.string(),
  improvements: z.array(z.string()),
  concerns: z.array(z.string()),
  recommendations: z.array(z.string()),
}).passthrough();

// 4. Food Swap Schema
const foodSwapSchema = z.object({
  originalFood: z.string(),
  alternatives: z.array(
    z.object({
      name: z.string(),
      amount: z.string(),
      calories: z.number(),
      protein: z.number(),
      carbs: z.number(),
      fat: z.number(),
      reasoning: z.string(),
    })
  ),
});

const analyzeMealSchema = z.object({
  mealName: z.string(),
  items: z.array(
    z.object({
      name: z.string(),
      quantity: z.number().nullish(), // Ensure this is a number (e.g. 2 instead of "2 slices")
      unit: z.string().nullish(),     // e.g. "slice", "g", "cup", "piece"
      ambiguous: z.boolean(),         // True if the user didn't specify quantity/unit
      calories: z.number(),
      protein: z.number(),
      carbs: z.number(),
      fat: z.number(),
      fiber: z.number(),
    })
  ),
  totals: z.object({
    calories: z.number(),
    protein: z.number(),
    carbs: z.number(),
    fat: z.number(),
    fiber: z.number(),
  }),
  confidence: z.enum(['low', 'medium', 'high']),
  assumptions: z.array(z.string()),
});

// 5. Coach Response Schema
const coachResponseSchema = z.object({
  message: z.string(),
  actionItems: z.array(z.string()).nullish(),
  suggestedWorkoutAdjustment: z.string().nullish(),
}).passthrough();

function validateAIResponse(schema, data) {
  try {
    return { success: true, data: schema.parse(data) };
  } catch (error) {
    const errorString = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
    console.error('AI Response Validation Error:', errorString);
    return { success: false, error: errorString };
  }
}

module.exports = {
  workoutPlanSchema,
  mealPlanSchema,
  weeklyReviewSchema,
  foodSwapSchema,
  coachResponseSchema,
  analyzeMealSchema,
  validateAIResponse,
};
