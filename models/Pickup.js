const mongoose = require('mongoose');

const pickupSchema = new mongoose.Schema({
  cartId: String,
  userEmail: String,
  pickupDate: String, // Ensure the date is saved in a format you can query (like ISO string)
  pickupTime: String, // Ensure the time slot is saved as a string
  pickupLocation: String,
});

const Pickup = mongoose.model('Pickup', pickupSchema);

module.exports = Pickup;
