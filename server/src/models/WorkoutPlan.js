const mongoose = require('mongoose');

const setSchema = new mongoose.Schema({
  reps: { type: Number, required: true },
  targetWeightKg: { type: Number, default: 0 },
  rpe: { type: Number, default: 7 },
  restSeconds: { type: Number, default: 90 },
});

const exercisePlanSchema = new mongoose.Schema({
  exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
  name: { type: String, required: true },
  primaryMuscles: [String],
  equipment: { type: String },
  setsCount: { type: Number, required: true },
  targetReps: { type: String, required: true }, // e.g. "8-12"
  restSeconds: { type: Number, default: 90 },
  notes: { type: String, default: '' },
  sets: [setSchema],
});

const workoutDaySchema = new mongoose.Schema({
  dayIndex: { type: Number, required: true }, // 0 to 6 (Mon to Sun or Day 1-7)
  dayName: { type: String, required: true }, // e.g. "Monday", "Day 1"
  splitName: { type: String, required: true }, // e.g. "Push A", "Lower Focus"
  focusArea: { type: String, required: true }, // e.g. "Chest, Shoulders & Triceps"
  isRestDay: { type: Boolean, default: false },
  estimatedDurationMin: { type: Number, default: 60 },
  exercises: [exercisePlanSchema],
});

const workoutPlanSchema = new mongoose.Schema(
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
    splitType: {
      type: String,
      required: true, // e.g. "Upper/Lower", "PPL", "Full Body"
    },
    weeklyFrequency: {
      type: Number,
      required: true,
    },
    config: {
      type: Object,
      default: null,
    },
    days: [workoutDaySchema],
    version: {
      type: Number,
      default: 1,
    },
    generatedReason: {
      type: String,
      default: 'Initial AI profile generation',
    },
  },
  { timestamps: true }
);

workoutPlanSchema.index({ userId: 1, isActive: 1 });

module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);
