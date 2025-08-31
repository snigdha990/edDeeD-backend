// db.js
const mongoose = require('mongoose');

const connectDB = async (uri) => {
  if (mongoose.connection.readyState === 1) {
    console.log('MongoDB already connected');
    return;
  }
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
