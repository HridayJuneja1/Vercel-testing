const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the cart item schema
const cartItemSchema = new Schema({
  isbn: { type: String, required: true },
  image: { type: String, required: true },
  title: { type: String, required: true },
  publication: { type: String, required: true },
  standard: { type: Number, required: true },
  description: { type: String, required: true },
  publication_year: { type: String, required: false },
  dimensions: { type: String, required: false }
});

// Define the pickup schema
const pickupSchema = new Schema({
  cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true }, // Reference to Cart model
  userEmail: { type: String, required: true },
  pickupDate: { type: Date, required: true }, // Store as a Date for better querying
  pickupTime: { type: String, required: true }, // Can stay as a string or further structure if necessary
  pickupLocation: { type: String, required: true },
  items: [cartItemSchema], // Array of cart items
  status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' } // Added status field
}, {
  timestamps: true,
  collection: 'pickups'
});

// Indexing for better querying (if you'll query by email or pickup date frequently)
pickupSchema.index({ userEmail: 1 });
pickupSchema.index({ pickupDate: 1 });

// Create the Pickup model using the pickup schema
const Pickup = mongoose.model('Pickup', pickupSchema);

module.exports = Pickup;
