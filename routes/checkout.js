const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const Cart = require('../models/Cart');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'hridayjuneja04@gmail.com',
    pass: 'mdej psmy dvrv wgwu', // Consider using environment variables for security
  },
});

router.post('/checkout', async (req, res) => {
  const { email, firstName, lastName, phoneNumber } = req.body;

  try {
    // Find the cart by the user's email
    const cart = await Cart.findOne({ userEmail: email });
    if (!cart || cart.items.length === 0) {
      return res.status(404).json({ error: 'No cart items found.' });
    }

    // Build the order summary email
    const itemsHtml = cart.items.map(item =>
      `<li>${item.title} - <img src="${item.image}" alt="${item.title}" style="width:100px;"></li>`
    ).join('');

    const emailHtml = `
      <h3>Thank you for your order!</h3>
      <p>Your order has been received and will be processed shortly. Here is a summary of your order:</p>
      <h1>Order Summary</h1>
      <p>Name: ${firstName} ${lastName}</p>
      <p>Email: ${email}</p>
      <p>Phone Number: ${phoneNumber}</p>
      <ul>${itemsHtml}</ul>
      <p>Thank you for your purchase!</p>
    `;

    // Send the order confirmation email
    await transporter.sendMail({
      from: 'hridayjuneja04@gmail.com',
      to: email,
      subject: 'Your Order Summary',
      html: emailHtml,
    });

    // Generate the schedule pickup link using the cart's ID and dynamically create the website address
    const baseUrl = `${req.protocol}://${req.get('host')}`; // Generate the base URL dynamically
    const pickupSchedulerLink = `${baseUrl}/book-pickup?cartId=${cart._id}`;

    const pickupEmailHtml = `
      <h3>Schedule Your Book Pickup</h3>
      <p>Your order is ready for pickup. Please schedule a time and location to pick up all the books in your order.</p>
      <a href="${pickupSchedulerLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none;">Schedule Pickup</a>
      <p>If you have any questions, feel free to contact us.</p>
    `;

    // Send the pickup scheduler email
    await transporter.sendMail({
      from: 'hridayjuneja04@gmail.com',
      to: email,
      subject: 'Schedule Your Book Pickup',
      html: pickupEmailHtml,
    });

    // COMMENT OUT OR REMOVE THIS PART: Don't delete the cart
    // await Cart.deleteOne({ userEmail: email }); // This will no longer remove the cart from the database

    // Send success response
    res.status(200).json({ message: 'Checkout confirmation and pickup scheduler emails sent.' });
  } catch (error) {
    console.error('Error during checkout:', error);
    res.status(500).json({ error: 'Failed to process checkout.' });
  }
});

module.exports = router;
