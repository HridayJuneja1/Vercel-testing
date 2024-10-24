const express = require('express');
const User = require('../models/User'); // Your User model
const PastOrder = require('../models/PastOrder'); // Your PastOrder model
const Pickup = require('../models/Pickup'); // Your Pickup model
const router = express.Router();

// Route to get the user's dashboard data
router.get('/:userId', async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const pastOrders = await PastOrder.find({ userId: req.params.userId });
  
      // Fetch readyForPickup books using user email instead of userId
      const readyForPickup = await Pickup.find({ userEmail: user.email });
  
      res.json({
        user: {
          name: user.name,
          email: user.email,
        },
        pastOrders,
        readyForPickup,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error.message);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  
module.exports = router;
