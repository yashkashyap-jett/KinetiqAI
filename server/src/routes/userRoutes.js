const express = require('express');
const router = express.Router();
const { getProfile, completeOnboarding, updateProfile } = require('../controllers/userController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { profileSchema } = require('../validators/profileValidator');

router.get('/profile', auth, getProfile);
router.post('/profile/onboarding', auth, validate(profileSchema), completeOnboarding);
router.put('/profile', auth, updateProfile);

module.exports = router;
