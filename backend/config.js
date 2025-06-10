/**
 * Configuration for Backend Server
 * Contains database connection and server settings
 */

const config = {
  // Server configuration
  port: process.env.PORT || 3001,
  host: '10.12.91.101',
  
  // Database configuration
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://10.12.91.102:27017/foxvoting',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },
  
  // CORS configuration
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://10.12.91.103:3000',
    credentials: true
  },
  
  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  },
  
  // Fox API configuration
  foxApi: {
    baseUrl: 'https://randomfox.ca/images/',
    timeout: 5000
  }
};

module.exports = config; 