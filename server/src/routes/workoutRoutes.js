const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const {
  generatePlan,
  getActivePlan,
  getTodaysWorkout,
  startSession,
  completeSession,
  getSessionHistory,
} = require('../controllers/workoutController');

router.use(protect);

router.post('/generate', generatePlan);
router.post('/regenerate', generatePlan);
router.get('/plan', getActivePlan);
router.get('/today', getTodaysWorkout);
router.post('/sessions', startSession);
router.post('/sessions/:id/complete', completeSession);
router.get('/sessions', getSessionHistory);

module.exports = router;
