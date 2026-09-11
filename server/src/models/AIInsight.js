const mongoose = require('mongoose');

const aiInsightSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['readiness', 'training', 'nutrition', 'recovery', 'adaptation', 'weekly_review'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    context: {
      type: mongoose.Schema.Types.Mixed, // structured metrics that produced this insight
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    actionable: {
      type: Boolean,
      default: true,
    },
    actionText: {
      type: String,
      default: '',
    },
    dismissed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

aiInsightSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('AIInsight', aiInsightSchema);
