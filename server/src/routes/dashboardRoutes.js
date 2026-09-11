const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const { getDashboardData } = require('../controllers/dashboardController');

router.use(protect);
router.get('/', getDashboardData);

module.exports = router;
