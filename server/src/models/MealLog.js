const mongoose = require('mongoose');

const loggedFoodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  carbs: { type: Number, required: true },
  fat: { type: Number, required: true },
  fiber: { type: Number, default: 0 },
  source: { type: String, default: 'GEMINI_ESTIMATE' },
});

const mealLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    mealType: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snack', 'pre_workout', 'post_workout'],
      required: true,
    },
    name: {
      type: String,
      default: 'Logged Meal',
    },
    foods: [loggedFoodSchema],
    totalCalories: { type: Number, required: true, default: 0 },
    totalProtein: { type: Number, required: true, default: 0 },
    totalCarbs: { type: Number, required: true, default: 0 },
    totalFat: { type: Number, required: true, default: 0 },
    totalFiber: { type: Number, default: 0 },
    waterMl: { type: Number, default: 0 },
  },
  { timestamps: true }
);

mealLogSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('MealLog', mealLogSchema);
