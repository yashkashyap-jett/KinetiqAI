const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../validators/authValidator');
const { loginLimiter, registerLimiter } = require('../middleware/rateLimiter');

router.post('/register', registerLimiter, validate(registerSchema), register);
router.post('/login', loginLimiter, validate(loginSchema), login);
router.get('/me', auth, getMe);

module.exports = router;
