/**
 * Frontend Server for Fox Voting System
 * Serves the web interface using EJS templates
 */

const express = require('express');
const path = require('path');
const axios = require('axios');
const helmet = require('helmet');
const expressLayouts = require('express-ejs-layouts');
const config = require('./config');

// Create Express application
const app = express();

// Trust proxy for correct IP addresses
app.set('trust proxy', true);

// Set EJS as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configure express-ejs-layouts
app.use(expressLayouts);
app.set('layout', 'layout');
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);

// Security middleware with relaxed CSP for development/production
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https:", "http:", "https://randomfox.ca"],
      connectSrc: ["'self'", config.api.baseUrl, "https://randomfox.ca"],
      fontSrc: ["'self'", "https://cdnjs.cloudflare.com", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: null // Disable for HTTP development
    }
  },
  crossOriginOpenerPolicy: { policy: "unsafe-none" }, // Relax for development
  crossOriginEmbedderPolicy: false // Disable for development
}));

// Static files middleware with proper headers
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, path, stat) => {
    // Set proper MIME types
    if (path.endsWith('.css')) {
      res.set('Content-Type', 'text/css');
    }
    if (path.endsWith('.js')) {
      res.set('Content-Type', 'application/javascript');
    }
    // Add cache headers
    res.set('Cache-Control', 'public, max-age=3600');
  }
}));

// Parse request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

// Create axios instance for API calls
const api = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json'
  }
});

// API error handler
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    return Promise.reject(error);
  }
);

/**
 * Home page - displays random foxes for voting
 */
app.get('/', async (req, res) => {
  try {
    console.log('Loading home page...');
    
    // Fetch random foxes and current statistics
    const [foxesResponse, statsResponse] = await Promise.all([
      api.get('/api/foxes?count=2').catch(err => ({ data: { success: false, error: err.message } })),
      api.get('/api/statistics').catch(err => ({ data: { success: false, error: err.message } }))
    ]);
    
    const foxes = foxesResponse.data.success ? foxesResponse.data.data : [];
    const statistics = statsResponse.data.success ? statsResponse.data.data : null;
    
    res.render('index', {
      title: 'Fox Voting System',
      foxes: foxes,
      statistics: statistics,
      error: !foxesResponse.data.success ? foxesResponse.data.error : null
    });
    
  } catch (error) {
    console.error('Error loading home page:', error);
    
    res.render('index', {
      title: 'Fox Voting System',
      foxes: [],
      statistics: null,
      error: 'Failed to load foxes. Please try again.'
    });
  }
});

/**
 * Statistics page - displays voting statistics
 */
app.get('/statistics', async (req, res) => {
  try {
    console.log('Loading statistics page...');
    
    const response = await api.get('/api/statistics');
    
    if (response.data.success) {
      res.render('statistics', {
        title: 'Voting Statistics',
        statistics: response.data.data,
        error: null
      });
    } else {
      throw new Error(response.data.error || 'Failed to fetch statistics');
    }
    
  } catch (error) {
    console.error('Error loading statistics:', error);
    
    res.render('statistics', {
      title: 'Voting Statistics',
      statistics: null,
      error: 'Failed to load statistics. Please try again.'
    });
  }
});

/**
 * Vote endpoint - handles voting submissions
 */
app.post('/vote', async (req, res) => {
  try {
    const { foxId, imageUrl } = req.body;
    
    console.log(`Vote submission for foxId: ${foxId}`);
    
    if (!foxId || !imageUrl) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }
    
    // Submit vote to backend API
    const response = await api.post('/api/vote', {
      foxId: foxId,
      imageUrl: imageUrl
    });
    
    res.json(response.data);
    
  } catch (error) {
    console.error('Error submitting vote:', error);
    
    // Extract error message from API response
    let errorMessage = 'Failed to submit vote';
    if (error.response && error.response.data && error.response.data.error) {
      errorMessage = error.response.data.error;
    }
    
    res.status(error.response?.status || 500).json({
      success: false,
      error: errorMessage
    });
  }
});

/**
 * New foxes endpoint - fetch new random foxes via AJAX
 */
app.get('/new-foxes', async (req, res) => {
  try {
    const count = parseInt(req.query.count) || 2;
    
    console.log(`Fetching ${count} new foxes...`);
    
    const response = await api.get(`/api/foxes?count=${count}`);
    
    res.json(response.data);
    
  } catch (error) {
    console.error('Error fetching new foxes:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch new foxes'
    });
  }
});

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

/**
 * User guide page
 */
app.get('/guide', (req, res) => {
  res.render('guide', {
    title: 'User Guide - Fox Voting System'
  });
});

/**
 * About page
 */
app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About - Fox Voting System'
  });
});

/**
 * Favicon handler
 */
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).render('error', {
    title: 'Page Not Found',
    error: {
      status: 404,
      message: 'The page you are looking for does not exist.'
    }
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  
  res.status(error.status || 500).render('error', {
    title: 'Error',
    error: {
      status: error.status || 500,
      message: process.env.NODE_ENV === 'development' 
        ? error.message 
        : 'Something went wrong. Please try again.'
    }
  });
});

// Start server
const PORT = config.port;
const HOST = config.host;

const server = app.listen(PORT, HOST, () => {
  console.log('🦊 Fox Voting Frontend Server Started');
  console.log(`📍 Server: http://${HOST}:${PORT}`);
  console.log(`🔗 API Backend: ${config.api.baseUrl}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('=====================================');
});

// Graceful shutdown handling
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

function gracefulShutdown(signal) {
  console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
  
  server.close(() => {
    console.log('✅ Frontend server closed');
    console.log('👋 Graceful shutdown complete');
    process.exit(0);
  });
  
  // Force shutdown after 5 seconds
  setTimeout(() => {
    console.error('❌ Forced shutdown after timeout');
    process.exit(1);
  }, 5000);
}

module.exports = app; 