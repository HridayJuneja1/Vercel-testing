const express = require('express');
const Cart = require('../models/Cart');
const router = express.Router();

router.post('/cart/add', async (req, res) => {

  const {title, isbn, image, publication, standard, description, publication_year, dimensions, userEmail} = req.body;

  try {
    let cart = await Cart.findOne({ userEmail: userEmail });
    if (!cart) {
      cart = new Cart({ userEmail, items: [] });
    }

    cart.items.push({ isbn, image, title, publication, standard, description, publication_year, dimensions });
    await cart.save();

    res.status(200).json({ message: 'Book added to cart successfully' });
  } catch (error) {
    console.error('Error adding book to cart:', error);
    res.status(500).json({ message: 'Error adding book to cart', error: error.message });
  }
});


router.get('/cart/:userEmail', async (req, res) => {
  const { userEmail } = req.params;
  
  try {
    const decodedEmail = decodeURIComponent(userEmail);
    const cart = await Cart.findOne({ userEmail: decodedEmail });
    if (!cart) {
      return res.status(200).json({ userEmail: decodedEmail, items: [] });
    }
    res.status(200).json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Error fetching cart', error: error.message });
  }
});

router.post('/cart/remove', async (req, res) => {
  const { userEmail, title, isbn, image, publication, standard, description, publication_year, dimensions } = req.body;

  try {
    let cart = await Cart.findOne({ userEmail });

    if (cart) {
      cart.items = cart.items.filter((item) => item.isbn !== isbn);
      await cart.save();

      res.status(200).json({ message: 'Item removed from cart successfully' });
    } else {
      res.status(404).json({ message: 'Cart not found' });
    }
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ message: 'Error removing item from cart', error: error.message });
  }
});

module.exports = router;
