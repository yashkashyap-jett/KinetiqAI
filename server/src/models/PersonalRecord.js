const mongoose = require('mongoose');

const personalRecordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    exerciseName: {
      type: String,
      required: true,
    },
    value: {
      type: Number, // weight in kg, or reps, or time
      required: true,
    },
    weight: {
      type: Number, // weight in kg
    },
    metricType: {
      type: String,
      enum: ['weight', 'volume', 'reps', 'time'],
      default: 'weight',
    },
    reps: {
      type: Number,
      default: 1,
    },
    previousValue: {
      type: Number,
      default: 0,
    },
    improvementPercent: {
      type: Number,
      default: 0,
    },
    achievedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

personalRecordSchema.index({ userId: 1, exerciseName: 1, metricType: 1 });

module.exports = mongoose.model('PersonalRecord', personalRecordSchema);
