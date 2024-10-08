const express = require('express');
const Cart = require('../models/Cart');  // Import the Cart model
const router = express.Router();

// Route to add a book to the cart
router.post('/cart/add', async (req, res) => {
  const { title, isbn, image, publication, standard, description, publication_year, dimensions, userEmail } = req.body;

  try {
    // Find the cart by the user's email
    let cart = await Cart.findOne({ userEmail });
    
    // If no cart exists, create a new one
    if (!cart) {
      cart = new Cart({ userEmail, items: [] });
    }

    // Add the new book to the items array
    cart.items.push({ isbn, image, title, publication, standard, description, publication_year, dimensions });
    
    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: 'Book added to cart successfully' });
  } catch (error) {
    console.error('Error adding book to cart:', error);
    res.status(500).json({ message: 'Error adding book to cart', error: error.message });
  }
});

// Route to fetch cart by userEmail
router.get('/cart/:userEmail', async (req, res) => {
  const { userEmail } = req.params;

  try {
    const decodedEmail = decodeURIComponent(userEmail); // Decode the email to handle special characters
    const cart = await Cart.findOne({ userEmail: decodedEmail });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found for this user.' });
    }

    res.status(200).json(cart);  // Return the cart details
  } catch (error) {
    console.error('Error fetching cart by email:', error);
    res.status(500).json({ message: 'Error fetching cart', error: error.message });
  }
});

// Route to fetch cart by cartId
router.get('/cart/id/:cartId', async (req, res) => {
  const { cartId } = req.params;

  try {
    console.log('Fetching cart with ID:', cartId);  // Debugging

    // Fetch the cart by its ID from the "carts" collection
    const cart = await Cart.findById(cartId);

    // Check if cart exists
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    console.log('Cart fetched from database:', cart);  // Debugging

    res.status(200).json(cart);  // Return the cart details
  } catch (error) {
    console.error('Error fetching cart by ID:', error.message);
    res.status(500).json({ message: 'Error fetching cart by ID', error: error.message });
  }
});

// Route to remove a book from the cart
router.post('/cart/remove', async (req, res) => {
  const { userEmail, isbn } = req.body;

  try {
    // Find the cart by the user's email
    let cart = await Cart.findOne({ userEmail });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found for this user.' });
    }

    // Filter out the item to be removed using the isbn
    cart.items = cart.items.filter((item) => item.isbn !== isbn);
    
    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: 'Item removed from cart successfully' });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ message: 'Error removing item from cart', error: error.message });
  }
});

module.exports = router;
