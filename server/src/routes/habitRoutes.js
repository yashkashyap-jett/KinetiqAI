const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const { getHabits, createHabit, toggleHabitToday } = require('../controllers/habitController');

router.use(protect);

router.get('/', getHabits);
router.post('/', createHabit);
router.post('/:id/toggle', toggleHabitToday);

module.exports = router;
