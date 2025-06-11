const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const MONGODB_HOST = process.env.MONGODB_HOST || '10.12.91.102';
    const MONGODB_PORT = process.env.MONGODB_PORT || '27017';
    const MONGODB_DATABASE = process.env.MONGODB_DATABASE || 'foxvoting';
    
    const connectionString = `mongodb://${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DATABASE}`;
    
    const conn = await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}:${conn.connection.port}`);
    console.log(`Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB; 