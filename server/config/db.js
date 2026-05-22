const mongoose = require('mongoose');

const connectDB = async () => {
  const envUri = (process.env.MONGODB_URI || '').trim();

  // Determine if a real URI was provided
  const hasRealUri =
    envUri.length > 0 &&
    !envUri.includes('your_username') &&
    !envUri.includes('your_password') &&
    !envUri.includes('your_cluster');

  if (hasRealUri) {
    // Use the provided URI (Atlas or local)
    try {
      const conn = await mongoose.connect(envUri);
      console.log(`✅ MongoDB connected: ${conn.connection.host}`);
      return;
    } catch (err) {
      console.error(`❌ MongoDB connection failed: ${err.message}`);
      // Fall through to in-memory
    }
  }

  // Try local MongoDB first
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/evenzo', {
      serverSelectionTimeoutMS: 2500,
    });
    console.log('✅ MongoDB connected: localhost:27017');
    return;
  } catch {
    // Local not available — use in-memory
  }

  // Spin up in-memory MongoDB (zero config, perfect for demo)
  console.log('⚡ Starting in-memory MongoDB (demo mode — data resets on restart)...');
  const { MongoMemoryServer } = require('mongodb-memory-server');
  const mongoServer = await MongoMemoryServer.create({
    instance: {
      launchTimeout: 60000,
    },
  });
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  console.log('✅ In-memory MongoDB ready');
};

module.exports = connectDB;
