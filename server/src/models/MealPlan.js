const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: String, required: true }, // e.g. "150g", "2 eggs", "1 cup"
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  carbs: { type: Number, required: true },
  fat: { type: Number, required: true },
  category: { type: String, default: 'whole_food' },
});

const plannedMealSchema = new mongoose.Schema({
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack', 'pre_workout', 'post_workout'],
    required: true,
  },
  name: { type: String, required: true }, // e.g. "High Protein Oats & Berries"
  timeSuggestion: { type: String, default: '8:00 AM' },
  targetCalories: { type: Number, required: true },
  targetProtein: { type: Number, required: true },
  targetCarbs: { type: Number, required: true },
  targetFat: { type: Number, required: true },
  foods: [foodItemSchema],
  recipeTips: { type: String, default: '' },
});

const mealPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    dailyCalories: {
      type: Number,
      required: true,
    },
    macroTargets: {
      protein: { type: Number, required: true }, // in grams
      carbs: { type: Number, required: true },
      fat: { type: Number, required: true },
    },
    hydrationTargetMl: {
      type: Number,
      default: 3000,
    },
    meals: [plannedMealSchema],
    generatedReason: {
      type: String,
      default: 'Initial AI onboarding calculation',
    },
  },
  { timestamps: true }
);

mealPlanSchema.index({ userId: 1, isActive: 1 });

module.exports = mongoose.model('MealPlan', mealPlanSchema);
