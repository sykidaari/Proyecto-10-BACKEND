require('dotenv').config();
const express = require('express');
const cloudinary = require('cloudinary');
const connectDB = require('./src/config/db');
const mainRouter = require('./src/api/routes');

const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  api_key: process.env.CLOUDINARY_API_KEY
});

app.use(express.json());

connectDB();

app.use('/api/v1', mainRouter);

app.use((req, res) => res.status(404).json('route not found'));

app.listen(3000, () => {
  console.log('server connected at http://localhost:3000/');
});
