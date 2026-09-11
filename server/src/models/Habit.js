const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['nutrition', 'recovery', 'training', 'mindset', 'general'],
      default: 'general',
    },
    targetFrequencyPerWeek: {
      type: Number,
      default: 7,
    },
    completionDates: [
      {
        type: String, // YYYY-MM-DD string format
      },
    ],
    currentStreak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

habitSchema.index({ userId: 1, active: 1 });

module.exports = mongoose.model('Habit', habitSchema);
