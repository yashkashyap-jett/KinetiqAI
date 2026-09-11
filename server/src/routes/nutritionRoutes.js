const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const {
  generatePlan,
  getActivePlan,
  getDailyLogs,
  logMeal,
  updateMeal,
  deleteMeal,
  smartSwap,
  updateTargets,
  searchFood,
} = require('../controllers/nutritionController');

router.use(protect);

router.get('/search', searchFood);
router.post('/generate', generatePlan);
router.get('/plan', getActivePlan);
router.get('/daily/:date?', getDailyLogs);
router.post('/log', logMeal);
router.put('/log/:id', updateMeal);
router.delete('/log/:id', deleteMeal);
router.post('/swap', smartSwap);
router.put('/targets', updateTargets);

module.exports = router;
