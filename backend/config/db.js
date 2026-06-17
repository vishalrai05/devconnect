const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let memoryServer;

const connectWithUri = async (uri) => {
  return mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000
  });
};

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined");
    }

    const connection = await connectWithUri(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      console.error(`MongoDB connection failed: ${error.message}`);
      process.exit(1);
    }

    try {
      console.warn(`MongoDB connection failed: ${error.message}`);
      console.warn("Starting an in-memory MongoDB instance for local development.");
      memoryServer = await MongoMemoryServer.create();
      const connection = await connectWithUri(memoryServer.getUri());
      console.log(`In-memory MongoDB connected: ${connection.connection.host}`);
    } catch (fallbackError) {
      console.error(`In-memory MongoDB failed: ${fallbackError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
