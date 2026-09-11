const mongoose = require('mongoose');
const env = require('./env');

let mongoMemoryServer = null;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI, {
      dbName: 'kinetiq',
      serverSelectionTimeoutMS: 4000,
    });
    console.log(`✓ MongoDB connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠️ Primary MongoDB connection failed (${error.message}). Initiating MongoMemoryServer fallback...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create();
      const uri = mongoMemoryServer.getUri();
      const conn = await mongoose.connect(uri, { dbName: 'kinetiq' });
      console.log(`✓ Fallback In-Memory MongoDB connected: ${conn.connection.host}`);
      return true;
    } catch (fallbackErr) {
      console.error(`❌ In-Memory MongoDB fallback failed: ${fallbackErr.message}`);
      return false;
    }
  }
};

module.exports = connectDB;

