/**
 * Backend Server for Fox Voting System
 * Main entry point for the API server
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const config = require('./config');
const apiRoutes = require('./routes/api');

// Create Express application
const app = express();

// Trust proxy for correct IP addresses
app.set('trust proxy', true);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting middleware - configured for local development
const limiter = rateLimit({
  ...config.rateLimit,
  // For local development, use a safer key generator
  keyGenerator: (req) => {
    // In development, use forwarded IP or fallback to connection IP
    return req.ip || req.connection.remoteAddress || 'unknown';
  },
  // Skip rate limiting for local development IPs
  skip: (req) => {
    const ip = req.ip || req.connection.remoteAddress;
    return ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1';
  }
});
app.use(limiter);

// CORS middleware
app.use(cors(config.cors));

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const ip = req.ip;
  
  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);
  next();
});

// Connect to MongoDB
mongoose.connect(config.mongodb.uri, config.mongodb.options)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully');
    console.log(`📍 Database: ${config.mongodb.uri}`);
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

// MongoDB connection event handlers
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected');
});

// Handle MongoDB connection errors after initial connection
mongoose.connection.on('error', (error) => {
  console.error('❌ MongoDB error:', error);
});

// API routes
app.use('/api', apiRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Fox Voting System API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      foxes: '/api/foxes',
      vote: '/api/vote (POST)',
      statistics: '/api/statistics'
    }
  });
});

// Health check endpoint (additional to API health)
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    message: `${req.method} ${req.originalUrl} is not a valid endpoint`,
    availableEndpoints: [
      'GET /',
      'GET /health',
      'GET /api/health',
      'GET /api/foxes',
      'POST /api/vote',
      'GET /api/statistics',
      'GET /api/fox/:foxId/votes'
    ]
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('💥 Unhandled error:', error);
  
  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(error.status || 500).json({
    success: false,
    error: 'Internal server error',
    message: isDevelopment ? error.message : 'Something went wrong',
    stack: isDevelopment ? error.stack : undefined,
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = config.port;
const HOST = config.host;

const server = app.listen(PORT, HOST, () => {
  console.log('🚀 Fox Voting Backend Server Started');
  console.log(`📍 Server: http://${HOST}:${PORT}`);
  console.log(`🔒 CORS Origin: ${config.cors.origin}`);
  console.log(`📊 Rate Limit: ${config.rateLimit.max} requests per ${config.rateLimit.windowMs / 1000 / 60} minutes`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('=====================================');
});

// Graceful shutdown handling
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

function gracefulShutdown(signal) {
  console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
  
  server.close(() => {
    console.log('✅ HTTP server closed');
    
    mongoose.connection.close(false, () => {
      console.log('✅ MongoDB connection closed');
      console.log('👋 Graceful shutdown complete');
      process.exit(0);
    });
  });
  
  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('❌ Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
}

module.exports = app; 