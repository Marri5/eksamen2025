require('dotenv').config();

/**
 * Configuration for Frontend Server
 * Contains API endpoints and server settings loaded from environment variables
 */

const config = {
  // Server configuration
  port: process.env.PORT || 3000,
  host: process.env.HOST || '10.12.91.103',
  
  // Backend API configuration
  api: {
    baseUrl: process.env.API_BASE_URL || 'http://10.12.91.101:3001',
    timeout: 10000
  },
  
  // View engine configuration
  views: {
    engine: 'ejs',
    directory: './views'
  },
  
  // Static files configuration
  static: {
    directory: './public'
  }
};

module.exports = config; 