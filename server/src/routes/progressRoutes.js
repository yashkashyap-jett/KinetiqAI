const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const { getProgressHistory, addProgressEntry } = require('../controllers/progressController');

router.use(protect);

router.get('/', getProgressHistory);
router.post('/', addProgressEntry);

module.exports = router;
