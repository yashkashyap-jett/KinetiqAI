const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const connectDB = require('./src/config/db');
const env = require('./src/config/env');
const errorHandler = require('./src/middleware/errorHandler');
const { apiLimiter } = require('./src/middleware/rateLimiter');

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const workoutRoutes = require('./src/routes/workoutRoutes');
const nutritionRoutes = require('./src/routes/nutritionRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');
const aiRoutes = require('./src/routes/aiRoutes');
const progressRoutes = require('./src/routes/progressRoutes');
const habitRoutes = require('./src/routes/habitRoutes');

const app = express();

// Security
app.use(helmet());
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = env.CLIENT_URL.split(',').map(url => url.trim().replace(/\/$/, ''));
      const incomingOrigin = origin ? origin.replace(/\/$/, '') : null;
      
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!incomingOrigin || allowedOrigins.includes(incomingOrigin)) {
        callback(null, true);
      } else {
        console.warn(`Blocked by CORS: ${incomingOrigin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Compression
app.use(compression());

// Trust proxy (required for rate limiting behind reverse proxies like Vite/Nginx)
app.set('trust proxy', 1);

// Auth routes (they have their own specific rate limiters)
app.use('/api/auth', authRoutes);

// General rate limiting for all other API routes
app.use('/api', apiLimiter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'kinetiq-api', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/habits', habitRoutes);


// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(`✓ KINETIQ API running on port ${env.PORT}`);
    console.log(`  Environment: ${env.NODE_ENV}`);
  });
};

startServer();

module.exports = app;
