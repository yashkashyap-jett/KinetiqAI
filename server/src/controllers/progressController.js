const ProgressEntry = require('../models/ProgressEntry');
const PersonalRecord = require('../models/PersonalRecord');
const Profile = require('../models/Profile');

// GET /api/progress
const getProgressHistory = async (req, res, next) => {
  try {
    const entries = await ProgressEntry.find({ userId: req.user._id }).sort({ date: 1 });
    const prs = await PersonalRecord.find({ userId: req.user._id }).sort({ achievedAt: -1 });
    const profile = await Profile.findOne({ userId: req.user._id });

    res.json({ success: true, entries, prs, profile });
  } catch (error) {
    next(error);
  }
};

// POST /api/progress
const addProgressEntry = async (req, res, next) => {
  try {
    const { weightKg, bodyFatPercent, sleepHours, sleepQuality, energyLevel, notes } = req.body;

    const entry = await ProgressEntry.create({
      userId: req.user._id,
      date: new Date(),
      weightKg: Number(weightKg),
      bodyFatPercent: bodyFatPercent ? Number(bodyFatPercent) : undefined,
      sleepHours: sleepHours ? Number(sleepHours) : 7,
      sleepQuality: sleepQuality ? Number(sleepQuality) : 7,
      energyLevel: energyLevel ? Number(energyLevel) : 7,
      notes: notes || '',
    });

    // Update current weight in profile
    await Profile.findOneAndUpdate({ userId: req.user._id }, { weight: Number(weightKg) });

    res.status(201).json({ success: true, entry });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProgressHistory, addProgressEntry };
