const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const {
  getPersonalRecords,
  createPersonalRecord,
  updatePersonalRecord,
  deletePersonalRecord,
} = require('../controllers/personalRecordController');

router.use(protect);

router.get('/', getPersonalRecords);
router.post('/', createPersonalRecord);
router.put('/:id', updatePersonalRecord);
router.patch('/:id', updatePersonalRecord);
router.delete('/:id', deletePersonalRecord);

module.exports = router;
