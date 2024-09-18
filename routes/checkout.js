const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const Cart = require('../models/Cart');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'hridayjuneja04@gmail.com',
    pass: 'mdej psmy dvrv wgwu',
  },
});

router.post('/checkout', async (req, res) => {
  const { email, firstName, lastName, phoneNumber } = req.body;

  try {
    const cart = await Cart.findOne({ userEmail: email });
    if (!cart || cart.items.length === 0) {
      return res.status(404).json({ error: 'No cart items found.' });
    }

    const itemsHtml = cart.items.map(item =>
      `<li>${item.title} - <img src="${item.image}" alt="${item.title}" style="width:100px;"></li>`
    ).join('');

    const emailHtml = `
    <h3>Thank you for your order!</h3>
    <p>
      Your order has been received and will be processed shortly. Here is a summary of your order:
    </p>
      <h1>Order Summary</h1>
      <p>Name: ${firstName} ${lastName}</p>
      <p>Email: ${email}</p>
      <p>Phone Number: ${phoneNumber}</p>
      <ul>${itemsHtml}</ul>
      <p>Thank you for your purchase!</p>
    `;

    await transporter.sendMail({
      from: 'hridayjuneja04@gmail.com',
      to: email,
      subject: 'Your Order Summary',
      html: emailHtml,
    });

    res.status(200).json({ message: 'Checkout confirmation email sent.' });
  } catch (error) {
    console.error('Error during checkout:', error);
    res.status(500).json({ error: 'Failed to process checkout.' });
  }
});

module.exports = router;
