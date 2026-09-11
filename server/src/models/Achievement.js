const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    code: {
      type: String, // e.g. "FIRST_WORKOUT", "STREAK_7_DAYS", "10K_KG_VOLUME"
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['workout', 'nutrition', 'consistency', 'strength', 'milestone'],
      default: 'milestone',
    },
    icon: {
      type: String,
      default: 'Trophy',
    },
    unlockedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

achievementSchema.index({ userId: 1, code: 1 }, { unique: true });

module.exports = mongoose.model('Achievement', achievementSchema);
