const mongoose = require('mongoose');

const completedSetSchema = new mongoose.Schema({
  setNumber: { type: Number, required: true },
  weightKg: { type: Number, required: true, default: 0 },
  reps: { type: Number, required: true },
  rpe: { type: Number, default: 7 },
  completed: { type: Boolean, default: true },
});

const sessionExerciseSchema = new mongoose.Schema({
  exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
  name: { type: String, required: true },
  sets: [completedSetSchema],
  exerciseVolume: { type: Number, default: 0 },
  notes: { type: String, default: '' },
});

const workoutSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorkoutPlan',
    },
    dayIndex: {
      type: Number,
      required: true,
    },
    splitName: {
      type: String,
      required: true,
    },
    exercises: [sessionExerciseSchema],
    durationMinutes: {
      type: Number,
      default: 0,
    },
    totalVolumeKg: {
      type: Number,
      default: 0,
    },
    sessionRpe: {
      type: Number,
      min: 1,
      max: 10,
      default: 7,
    },
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['in_progress', 'completed', 'abandoned'],
      default: 'completed',
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

workoutSessionSchema.index({ userId: 1, completedAt: -1 });

module.exports = mongoose.model('WorkoutSession', workoutSessionSchema);
