const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['strength', 'cardio', 'calisthenics', 'flexibility', 'olympic'],
      default: 'strength',
    },
    primaryMuscles: [
      {
        type: String,
        required: true,
      },
    ],
    secondaryMuscles: [String],
    equipment: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate',
    },
    instructions: [String],
    tips: [String],
    alternatives: [String],
  },
  { timestamps: true }
);

exerciseSchema.index({ name: 'text', primaryMuscles: 1 });

module.exports = mongoose.model('Exercise', exerciseSchema);
