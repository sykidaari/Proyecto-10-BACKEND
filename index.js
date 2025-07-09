require('dotenv').config();
const express = require('express');
const cloudinary = require('cloudinary');
const connectDB = require('./src/config/db');
const mainRouter = require('./src/api/routes');

const app = express();

app.use(express.json());

connectDB();

app.use('/api/v1', mainRouter);

app.use((req, res) => res.status(404).json('route not found'));

app.listen(3000, () => {
  console.log('server connected at http://localhost:3000/');
});
