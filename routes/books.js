const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const mongoose = require('mongoose');

router.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).send('Error fetching books from the database: ' + error.message);
  }
});

router.get('/book/:bookId', async (req, res) => {
  try {
    const { bookId } = req.params;

    // Validate that the bookId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).send('Invalid book ID');
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).send('Book not found');
    }

    const relatedBooks = await Book.find({ 
      standard: book.standard,
      _id: { $ne: book._id }
    }).limit(5);

    res.json({
      ...book.toObject(),
      relatedBooks: relatedBooks
    });
  } catch (error) {
    res.status(500).send('Error fetching book from the database: ' + error.message);
  }
});

module.exports = router;
