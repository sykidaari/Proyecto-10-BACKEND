const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log('connected succesfully to DB');
  } catch (error) {
    console.log(`error connecting to DB: ${error.message}`);
  }
};

module.exports = connectDB;
