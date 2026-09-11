const dotenv = require('dotenv');
dotenv.config();

const env = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  NODE_ENV: process.env.NODE_ENV || 'development',
};

// Validate required variables
const required = ['MONGO_URI', 'JWT_SECRET', 'GEMINI_API_KEY'];
for (const key of required) {
  if (!env[key]) {
    console.error(`❌ Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

module.exports = env;
