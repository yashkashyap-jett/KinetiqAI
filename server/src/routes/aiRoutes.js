const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const { askCoach, getWeeklyReview, getInsights, analyzeMeal } = require('../controllers/aiController');

router.use(protect);

router.post('/coach', askCoach);
router.post('/weekly-review', getWeeklyReview);
router.get('/insights', getInsights);
router.post('/analyze-meal', analyzeMeal);

module.exports = router;
