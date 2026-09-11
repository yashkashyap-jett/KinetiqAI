const { z } = require('zod');

const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long')
    .trim(),
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password too long'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
});

module.exports = { registerSchema, loginSchema };
