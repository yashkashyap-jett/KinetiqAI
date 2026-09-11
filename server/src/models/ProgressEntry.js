const mongoose = require('mongoose');

const progressEntrySchema = new mongoose.Schema(
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
    weightKg: {
      type: Number,
      required: true,
    },
    bodyFatPercent: {
      type: Number,
    },
    measurements: {
      chestCm: Number,
      waistCm: Number,
      hipsCm: Number,
      bicepsCm: Number,
      thighsCm: Number,
    },
    sleepHours: {
      type: Number,
      default: 7,
    },
    sleepQuality: {
      type: Number, // 1 to 10 scale
      default: 7,
    },
    energyLevel: {
      type: Number, // 1 to 10 scale
      default: 7,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

progressEntrySchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('ProgressEntry', progressEntrySchema);
