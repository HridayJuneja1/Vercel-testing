const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartItemSchema = new Schema({
  isbn: { type: String, required: true },
  image: { type: String, required: true },
  title: { type: String, required: true },
  publication: { type: String, required: true },
  standard: { type: Number, required: true },
  description: { type: String, required: true },
  publication_year: { type: String, required: false },
  dimensions: { type: String, required: false },
});

const cartSchema = new Schema({
  userEmail: { type: String, required: true },
  items: [cartItemSchema],
}, {
  timestamps: true,
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
