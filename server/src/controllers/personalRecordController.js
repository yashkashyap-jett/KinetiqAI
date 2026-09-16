const PersonalRecord = require('../models/PersonalRecord');

// GET /api/personal-records
// Returns all permanent personal records for the authenticated user
const getPersonalRecords = async (req, res, next) => {
  try {
    const prs = await PersonalRecord.find({ userId: req.user._id }).sort({
      achievedAt: -1,
      createdAt: -1,
    });

    // Format response ensuring weight is populated
    const formatted = prs.map((pr) => {
      const obj = pr.toObject ? pr.toObject() : pr;
      if (obj.weight == null && obj.value != null) {
        obj.weight = obj.value;
      }
      return obj;
    });

    res.json({ success: true, personalRecords: formatted, prs: formatted });
  } catch (error) {
    next(error);
  }
};

// POST /api/personal-records
// Manually creates a new permanent personal record
const createPersonalRecord = async (req, res, next) => {
  try {
    const { exerciseName, weight, reps, date, achievedAt } = req.body;

    // Validate exerciseName
    if (!exerciseName || typeof exerciseName !== 'string' || !exerciseName.trim()) {
      return res.status(400).json({ success: false, error: 'Exercise name is required' });
    }

    // Validate weight
    const numWeight = Number(weight);
    if (weight === undefined || weight === null || isNaN(numWeight) || numWeight <= 0) {
      return res.status(400).json({ success: false, error: 'Weight must be a positive number' });
    }

    // Validate reps
    const numReps = Number(reps);
    if (reps === undefined || reps === null || isNaN(numReps) || !Number.isInteger(numReps) || numReps <= 0) {
      return res.status(400).json({ success: false, error: 'Reps must be a positive integer' });
    }

    // Validate date / achievedAt
    const rawDate = date || achievedAt || new Date();
    const parsedDate = new Date(rawDate);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ success: false, error: 'Invalid date format' });
    }

    const now = new Date();
    if (parsedDate.getTime() > now.getTime() + 24 * 60 * 60 * 1000) {
      return res.status(400).json({ success: false, error: 'Date cannot be in the future' });
    }

    const pr = await PersonalRecord.create({
      userId: req.user._id,
      exerciseName: exerciseName.trim(),
      weight: numWeight,
      value: numWeight,
      reps: numReps,
      achievedAt: parsedDate,
      metricType: 'weight',
    });

    res.status(201).json({ success: true, personalRecord: pr });
  } catch (error) {
    next(error);
  }
};

// PUT or PATCH /api/personal-records/:id
// Manually updates an existing permanent personal record
const updatePersonalRecord = async (req, res, next) => {
  try {
    const pr = await PersonalRecord.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!pr) {
      return res.status(404).json({ success: false, error: 'Personal record not found' });
    }

    const { exerciseName, weight, reps, date, achievedAt } = req.body;

    if (exerciseName !== undefined) {
      if (typeof exerciseName !== 'string' || !exerciseName.trim()) {
        return res.status(400).json({ success: false, error: 'Exercise name cannot be empty' });
      }
      pr.exerciseName = exerciseName.trim();
    }

    if (weight !== undefined) {
      const numWeight = Number(weight);
      if (isNaN(numWeight) || numWeight <= 0) {
        return res.status(400).json({ success: false, error: 'Weight must be a positive number' });
      }
      pr.weight = numWeight;
      pr.value = numWeight;
    }

    if (reps !== undefined) {
      const numReps = Number(reps);
      if (isNaN(numReps) || !Number.isInteger(numReps) || numReps <= 0) {
        return res.status(400).json({ success: false, error: 'Reps must be a positive integer' });
      }
      pr.reps = numReps;
    }

    if (date !== undefined || achievedAt !== undefined) {
      const rawDate = date || achievedAt;
      const parsedDate = new Date(rawDate);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ success: false, error: 'Invalid date format' });
      }
      const now = new Date();
      if (parsedDate.getTime() > now.getTime() + 24 * 60 * 60 * 1000) {
        return res.status(400).json({ success: false, error: 'Date cannot be in the future' });
      }
      pr.achievedAt = parsedDate;
    }

    await pr.save();

    res.json({ success: true, personalRecord: pr });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/personal-records/:id
// Manually deletes a personal record
const deletePersonalRecord = async (req, res, next) => {
  try {
    const pr = await PersonalRecord.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!pr) {
      return res.status(404).json({ success: false, error: 'Personal record not found' });
    }

    res.json({ success: true, message: 'Personal record deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPersonalRecords,
  createPersonalRecord,
  updatePersonalRecord,
  deletePersonalRecord,
};
