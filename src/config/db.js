const mongoose = require('mongoose');

const getMongoUris = () => {
  const uris = [process.env.MONGO_URI, process.env.MONGO_URI_LOCAL]
    .filter(Boolean);

  return [...new Set(uris)];
};

const connectDB = async () => {
  const mongoUris = getMongoUris();

  if (mongoUris.length === 0) {
    console.warn('No MongoDB URI configured. Starting without database connection.');
    return;
  }

  for (const uri of mongoUris) {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000,
      });
      console.log(`MongoDB connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.error(`MongoDB connection failed for ${uri}: ${error.message}`);
    }
  }

  console.warn('MongoDB connection unavailable. Server will keep running without a database.');
};

module.exports = connectDB;
