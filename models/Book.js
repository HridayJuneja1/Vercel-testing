const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  publication: { type: String, required: true },
  standard: { type: Number, required: true },
  isbn: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  publicationYear: { type: String, required: false },
  dimensions: { type: String, required: false }

});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;

