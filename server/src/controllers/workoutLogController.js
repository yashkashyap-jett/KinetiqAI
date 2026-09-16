const WorkoutLog = require('../models/WorkoutLog');

// GET /api/workout-logs
// Returns only manual workout logs from the last 7 days; purges older logs
const getWorkoutLogs = async (req, res, next) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Automatically purge expired workout logs older than 7 days
    await WorkoutLog.deleteMany({
      userId: req.user._id,
      performedAt: { $lt: sevenDaysAgo },
    });

    const logs = await WorkoutLog.find({
      userId: req.user._id,
      performedAt: { $gte: sevenDaysAgo },
    }).sort({ performedAt: -1, createdAt: -1 });

    res.json({ success: true, logs });
  } catch (error) {
    next(error);
  }
};

// POST /api/workout-logs
// Creates a new manual workout log with 7-day retention
const createWorkoutLog = async (req, res, next) => {
  try {
    const { exerciseName, weight, reps, date, performedAt } = req.body;

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

    // Validate date / performedAt
    const rawDate = date || performedAt || new Date();
    const parsedDate = new Date(rawDate);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ success: false, error: 'Invalid date format' });
    }

    const now = new Date();
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    if (parsedDate < sevenDaysAgo) {
      return res.status(400).json({ success: false, error: 'Cannot log a workout older than 7 days' });
    }

    if (parsedDate.getTime() > now.getTime() + 24 * 60 * 60 * 1000) {
      return res.status(400).json({ success: false, error: 'Date cannot be in the future' });
    }

    const log = await WorkoutLog.create({
      userId: req.user._id,
      exerciseName: exerciseName.trim(),
      weight: numWeight,
      reps: numReps,
      performedAt: parsedDate,
    });

    res.status(201).json({ success: true, log });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/workout-logs/:id
const deleteWorkoutLog = async (req, res, next) => {
  try {
    const log = await WorkoutLog.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!log) {
      return res.status(404).json({ success: false, error: 'Workout log not found' });
    }

    res.json({ success: true, message: 'Workout log deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWorkoutLogs,
  createWorkoutLog,
  deleteWorkoutLog,
};
