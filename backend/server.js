const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Import configuration
const connectDB = require('./config/database');
const corsOptions = require('./config/cors');

// Import middleware
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const foxRoutes = require('./routes/foxRoutes');
const voteRoutes = require('./routes/voteRoutes');
const statisticsRoutes = require('./routes/statisticsRoutes');
const utilityRoutes = require('./routes/utilityRoutes');

// Initialize express app
const app = express();
const PORT = process.env.BACKEND_PORT || 5000;

// Connect to database
connectDB();

// Middleware
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger); // Custom logging middleware

// Routes
app.use('/api/foxes', foxRoutes);
app.use('/api/vote', voteRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use('/api', utilityRoutes); // health and docs endpoints

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Fox Voting API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      docs: '/api/docs',
      foxes: '/api/foxes/random',
      vote: '/api/vote',
      voteStatus: '/api/vote-status',
      statistics: '/api/statistics'
    }
  });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const BACKEND_HOST = process.env.BACKEND_HOST || '10.12.91.101';

app.listen(PORT, BACKEND_HOST, () => {
  console.log(`Fox Voting Backend Server running on http://${BACKEND_HOST}:${PORT}`);
  console.log(`API Documentation: http://${BACKEND_HOST}:${PORT}/api/docs`);
  console.log(`Health Check: http://${BACKEND_HOST}:${PORT}/api/health`);
}); 