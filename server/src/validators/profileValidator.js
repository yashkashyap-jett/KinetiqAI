const { z } = require('zod');

const profileSchema = z.object({
  // Step 1
  age: z.number().min(13).max(100),
  gender: z.enum(['male', 'female', 'other']),
  height: z.number().min(100).max(250),
  weight: z.number().min(30).max(300),
  targetWeight: z.number().min(30).max(300).optional(),

  // Step 2
  fitnessGoal: z.enum([
    'fat_loss', 'muscle_gain', 'recomposition', 'strength',
    'endurance', 'general_fitness', 'athletic_performance',
  ]),

  // Step 3
  fitnessLevel: z.enum(['beginner', 'intermediate', 'advanced']),

  // Step 4
  workoutDaysPerWeek: z.number().min(1).max(7),
  avgWorkoutDuration: z.number().min(15).max(180),
  workoutLocation: z.enum(['gym', 'home', 'outdoor', 'mixed']),
  equipment: z.array(z.string()).default([]),

  // Step 5
  dietaryPreference: z.enum(['non_vegetarian', 'vegetarian', 'vegan', 'eggetarian', 'other']),
  allergies: z.array(z.string()).default([]),
  dislikedFoods: z.array(z.string()).default([]),
  preferredFoods: z.array(z.string()).default([]),
  mealsPerDay: z.number().min(2).max(6).default(3),
  foodBudget: z.enum(['low', 'moderate', 'high']).default('moderate'),

  // Step 6
  sleepDuration: z.number().min(3).max(12),
  dailyActivity: z.enum([
    'sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active',
  ]),
  workSchedule: z.enum(['morning', 'afternoon', 'evening', 'night', 'flexible']),
  stressLevel: z.enum(['low', 'moderate', 'high', 'very_high']),
});

module.exports = { profileSchema };
