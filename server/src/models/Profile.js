const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    // Step 1 — About You
    age: { type: Number, min: 13, max: 100 },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    height: { type: Number, min: 100, max: 250 }, // cm
    weight: { type: Number, min: 30, max: 300 }, // kg
    targetWeight: { type: Number, min: 30, max: 300 },

    // Step 2 — Goal
    fitnessGoal: {
      type: String,
      enum: [
        'fat_loss',
        'muscle_gain',
        'recomposition',
        'strength',
        'endurance',
        'general_fitness',
        'athletic_performance',
      ],
    },

    // Step 3 — Experience
    fitnessLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
    },

    // Step 4 — Training
    workoutDaysPerWeek: { type: Number, min: 1, max: 7 },
    avgWorkoutDuration: { type: Number, min: 15, max: 180 }, // minutes
    workoutLocation: {
      type: String,
      enum: ['gym', 'home', 'outdoor', 'mixed'],
    },
    equipment: [{ type: String }],

    // Step 5 — Nutrition
    dietaryPreference: {
      type: String,
      enum: ['non_vegetarian', 'vegetarian', 'vegan', 'eggetarian', 'other'],
    },
    allergies: [{ type: String }],
    dislikedFoods: [{ type: String }],
    preferredFoods: [{ type: String }],
    mealsPerDay: { type: Number, min: 2, max: 6, default: 3 },
    foodBudget: {
      type: String,
      enum: ['low', 'moderate', 'high'],
      default: 'moderate',
    },

    // Step 6 — Lifestyle
    sleepDuration: { type: Number, min: 3, max: 12 }, // hours
    dailyActivity: {
      type: String,
      enum: ['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active'],
    },
    workSchedule: {
      type: String,
      enum: ['morning', 'afternoon', 'evening', 'night', 'flexible'],
    },
    stressLevel: {
      type: String,
      enum: ['low', 'moderate', 'high', 'very_high'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Profile', profileSchema);
