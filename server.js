// Require the necessary modules
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const cartRouter = require('./routes/cart');
const checkoutRouter = require('./routes/checkout');

const usersRouter = require('./routes/users');
const booksRouter = require('./routes/books');
const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connection established'))
  .catch((error) => console.error('MongoDB connection failed:', error.message));

  app.use(cors({ origin: 'https://samskrita-bharati.vercel.app' }));

app.use(express.json());
app.use('/api', checkoutRouter);
app.use('/api', usersRouter);
app.use('/api', cartRouter);
app.use('/api/users', usersRouter);
app.use('/api', booksRouter);

app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
