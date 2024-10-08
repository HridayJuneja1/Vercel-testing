const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Pickup = require('../models/Pickup'); // Assuming you have a Pickup model
const nodemailer = require('nodemailer');

// Booked slots data (you can use a collection or Pickup model instead of an in-memory object in production)
const bookedSlots = {}; // This should be a collection or stored in the Pickup model in a real scenario

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'Gmail', // You can use any email service like Gmail, SendGrid, etc.
  auth: {
    user: 'hridayjuneja04@gmail.com',
    pass: 'mdej psmy dvrv wgwu',
  },
});

router.post('/schedule', async (req, res) => {
  const { cartId, email, pickupDate, pickupTime, pickupLocation } = req.body;

  try {
    // Validate other inputs
    if (!email || !pickupDate || !pickupTime || !pickupLocation) {
      return res.status(400).send('All fields (email, pickupDate, pickupTime, pickupLocation) are required.');
    }

    // Check if the selected slot (date, time, location) is already booked
    const existingBooking = await Pickup.findOne({
      pickupDate,
      pickupTime,
      pickupLocation,
    });

    if (existingBooking) {
      return res.status(409).json({ message: 'This time slot is already booked. Please select another slot.' });
    }

    // Check if a pickup is already scheduled for this user
    const existingPickup = await Pickup.findOne({ userEmail: email });

    if (existingPickup) {
      // Update the existing pickup entry
      existingPickup.pickupDate = pickupDate;
      existingPickup.pickupTime = pickupTime;
      existingPickup.pickupLocation = pickupLocation;
      await existingPickup.save();
      console.log('Updated existing booking:', existingPickup); // Add log here
    } else {
      // If no existing entry, create a new one
      const newPickup = new Pickup({
        cartId,
        userEmail: email,
        pickupDate,
        pickupTime,
        pickupLocation,
      });
      await newPickup.save();
      console.log('Created new booking:', newPickup); // Add log here
    }

    // Send confirmation email
    const mailOptions = {
      from: 'hridayjuneja04@gmail.com', // Sender address
      to: email, // Receiver address
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
    // Ensure the incoming pickupDate is in the same format (YYYY-MM-DD) as the one stored in the database
    const formattedPickupDate = new Date(pickupDate).toISOString().split('T')[0];  // Formats the incoming date to 'YYYY-MM-DD'

    // Query the database for bookings on the selected date and location
    const bookedPickups = await Pickup.find({
      pickupDate: { $regex: `^${formattedPickupDate}` },  // Use a regex to match only the date part
      pickupLocation
    });

    // Extract booked times
    const bookedTimes = bookedPickups.map(pickup => pickup.pickupTime);

    console.log('Booked times:', bookedTimes);  // Log booked times

    // Define all possible time slots
    const allSlots = [
      '9:00 AM - 9:30 AM',
      '9:30 AM - 10:00 AM',
      '10:00 AM - 10:30 AM',
      '10:30 AM - 11:00 AM',
      // Add more time slots if needed
    ];

    // Filter out the slots that are already booked
    const availableSlots = allSlots.filter(slot => !bookedTimes.includes(slot));

    console.log('Available slots:', availableSlots);  // Log available slots after filtering

    // Send the filtered available slots
    res.status(200).json({ availableSlots });
  } catch (error) {
    console.error('Error fetching available slots:', error.message);
    res.status(500).json({ error: 'Failed to fetch available slots' });
  }
});


// Route to get the user's scheduled pickup
router.get('/scheduled', async (req, res) => {
  const { email } = req.query;

  try {
    // Find the user's scheduled pickup
    const scheduledPickup = await Pickup.findOne({ userEmail: email });

    if (scheduledPickup) {
      return res.status(200).json({ scheduledPickup });
    } else {
      return res.status(404).json({ message: 'No scheduled pickup found for this user.' });
    }
  } catch (error) {
    console.error('Error fetching scheduled pickup:', error.message);
    res.status(500).json({ error: 'Failed to fetch scheduled pickup' });
  }
});

module.exports = router;
