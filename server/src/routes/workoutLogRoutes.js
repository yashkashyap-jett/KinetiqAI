const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const {
  getWorkoutLogs,
  createWorkoutLog,
  deleteWorkoutLog,
} = require('../controllers/workoutLogController');

router.use(protect);

router.get('/', getWorkoutLogs);
router.post('/', createWorkoutLog);
router.delete('/:id', deleteWorkoutLog);

module.exports = router;
