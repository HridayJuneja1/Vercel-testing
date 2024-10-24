const mongoose = require('mongoose');

const pastOrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  orderDate: { type: Date, required: true },
});

const PastOrder = mongoose.model('PastOrder', pastOrderSchema);

module.exports = PastOrder;
