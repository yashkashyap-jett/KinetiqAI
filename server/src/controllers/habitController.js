const Habit = require('../models/Habit');

// GET /api/habits
const getHabits = async (req, res, next) => {
  try {
    let habits = await Habit.find({ userId: req.user._id, active: true });

    if (habits.length === 0) {
      // Seed default core habits for new user
      habits = await Habit.insertMany([
        { userId: req.user._id, name: 'Hit 150g Protein Target', category: 'nutrition', targetFrequencyPerWeek: 7 },
        { userId: req.user._id, name: 'Drink 3L Water', category: 'nutrition', targetFrequencyPerWeek: 7 },
        { userId: req.user._id, name: '7.5+ Hours Quality Sleep', category: 'recovery', targetFrequencyPerWeek: 7 },
        { userId: req.user._id, name: 'Complete Workout Session', category: 'training', targetFrequencyPerWeek: 4 },
      ]);
    }

    res.json({ success: true, habits });
  } catch (error) {
    next(error);
  }
};

// POST /api/habits
const createHabit = async (req, res, next) => {
  try {
    const { name, category, targetFrequencyPerWeek } = req.body;
    const habit = await Habit.create({
      userId: req.user._id,
      name,
      category: category || 'general',
      targetFrequencyPerWeek: targetFrequencyPerWeek || 7,
    });
    res.status(201).json({ success: true, habit });
  } catch (error) {
    next(error);
  }
};

// POST /api/habits/:id/toggle
const toggleHabitToday = async (req, res, next) => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user._id });

    if (!habit) {
      return res.status(404).json({ success: false, message: 'Habit not found' });
    }

    const index = habit.completionDates.indexOf(todayStr);
    if (index > -1) {
      habit.completionDates.splice(index, 1);
      habit.currentStreak = Math.max(0, habit.currentStreak - 1);
    } else {
      habit.completionDates.push(todayStr);
      habit.currentStreak += 1;
      if (habit.currentStreak > habit.longestStreak) {
        habit.longestStreak = habit.currentStreak;
      }
    }

    await habit.save();
    res.json({ success: true, habit });
  } catch (error) {
    next(error);
  }
};

module.exports = { getHabits, createHabit, toggleHabitToday };
