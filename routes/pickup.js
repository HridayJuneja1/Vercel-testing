const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Pickup = require('../models/Pickup');
const Cart = require('../models/Cart');
const nodemailer = require('nodemailer');

// In-memory object to store booked slots (for production, you should use a database or the Pickup model)
const bookedSlots = {}; // Temporary object for storing booked slots (use a real database in production)

// Creating a transporter object for sending emails using nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Using Gmail as the email service (could be any email provider like SendGrid, etc.)
  auth: {
    user: 'hridayjuneja04@gmail.com', // Sender's email address
    pass: 'mdej psmy dvrv wgwu', // Sender's email password (should be secured using environment variables in production)
  },
});

router.post('/schedule', async (req, res) => {
  const { cartId, email, pickupDate, pickupTime, pickupLocation } = req.body;

  try {
    // Validate that all required fields are provided
    if (!email || !pickupDate || !pickupTime || !pickupLocation) {
      return res.status(400).send('All fields (email, pickupDate, pickupTime, pickupLocation) are required.');
    }

    // Convert pickupDate from string to Date object
    const formattedPickupDate = new Date(pickupDate); // Convert ISO string back to Date

    // Check if the selected time slot is already booked
    const existingBooking = await Pickup.findOne({
      pickupDate: formattedPickupDate, // Use the Date object
      pickupTime,
      pickupLocation,
    });

    // If the time slot is already booked, return a 409 conflict error
    if (existingBooking) {
      return res.status(409).json({ message: 'This time slot is already booked. Please select another slot.' });
    }

    // Find the user's cart by cartId and retrieve the items
    const cart = await Cart.findById(cartId);
    
    if (!cart || cart.items.length === 0) {
      return res.status(404).json({ message: 'Cart not found or cart is empty.' });
    }

    // Check if the user already has a pickup scheduled
    const existingPickup = await Pickup.findOne({ userEmail: email });

    if (existingPickup) {
      // If a pickup exists, update the existing record with new details and the items
      existingPickup.pickupDate = formattedPickupDate; // Use Date object
      existingPickup.pickupTime = pickupTime;
      existingPickup.pickupLocation = pickupLocation;
      existingPickup.items = cart.items; // Use cart items directly from the cart
      await existingPickup.save();
      console.log('Updated existing booking:', existingPickup);
    } else {
      // If no existing pickup, create a new one with the items from the cart
      const newPickup = new Pickup({
        cartId,
        userEmail: email,
        pickupDate: formattedPickupDate, // Use Date object
        pickupTime,
        pickupLocation,
        items: cart.items, // Store the cart items without requiring user input for them
      });
      await newPickup.save();
      console.log('Created new booking:', newPickup);
    }

    // Sending a confirmation email to the user
    const mailOptions = {
      from: 'hridayjuneja04@gmail.com',
      to: email,
      subject: 'Book Pickup Confirmation',
      text: `Dear user,\n\nYour book pickup has been scheduled successfully. Here are the details:\n\nPickup Location: ${pickupLocation}\nPickup Date: ${pickupDate}\nPickup Time: ${pickupTime}\n\nThank you for using our service!\n\nBest regards,\nSamskrita Bharati Team`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error.message);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    res.status(200).json({ message: 'Pickup scheduled successfully' });
  } catch (error) {
    console.error('Error scheduling pickup:', error.message);
    res.status(500).send('Error scheduling pickup: ' + error.message);
  }
});



router.get('/available-slots', async (req, res) => {
  const { pickupDate, pickupLocation } = req.query;

  try {
    // Ensure that the pickupDate is a valid date string
    const selectedDate = new Date(pickupDate);
    const startOfDay = new Date(selectedDate.setUTCHours(0, 0, 0, 0)); // Start of the day
    const endOfDay = new Date(selectedDate.setUTCHours(23, 59, 59, 999)); // End of the day

    // Query the database for pickups on the selected date and location
    const bookedPickups = await Pickup.find({
      pickupDate: {
        $gte: startOfDay, // Pickups after the start of the day
        $lt: endOfDay, // Pickups before the end of the day
      },
      pickupLocation, // Match the selected location
    });

    // Extract the already booked times from the results
    const bookedTimes = bookedPickups.map(pickup => pickup.pickupTime);

    console.log('Booked times:', bookedTimes); // Log the booked times for debugging

    // Define all possible time slots for booking
    const allSlots = [
      '9:00 AM - 9:30 AM',
      '9:30 AM - 10:00 AM',
      '10:00 AM - 10:30 AM',
      '10:30 AM - 11:00 AM',
      // Additional time slots can be added here
    ];

    // Filter out the slots that are already booked
    const availableSlots = allSlots.filter(slot => !bookedTimes.includes(slot));

    console.log('Available slots:', availableSlots); // Log the available slots for debugging

    // Respond with the available slots
    res.status(200).json({ availableSlots });
  } catch (error) {
    console.error('Error fetching available slots:', error.message); // Log the error
    res.status(500).json({ error: 'Failed to fetch available slots' });
  }
});


// Route to get the user's scheduled pickup details
router.get('/scheduled', async (req, res) => {
  const { email } = req.query; // Destructuring the email from query parameters

  try {
    // Find the user's scheduled pickup in the database
    const scheduledPickup = await Pickup.findOne({ userEmail: email });

    if (scheduledPickup) {
      return res.status(200).json({ scheduledPickup }); // Respond with the pickup details if found
    } else {
      return res.status(404).json({ message: 'No scheduled pickup found for this user.' }); // Respond with 404 if no pickup is found
    }
  } catch (error) {
    console.error('Error fetching scheduled pickup:', error.message); // Log any error that occurs while fetching the pickup
    res.status(500).json({ error: 'Failed to fetch scheduled pickup' }); // Respond with a 500 error and a message
  }
});

module.exports = router; // Export the router to be used in the main application
