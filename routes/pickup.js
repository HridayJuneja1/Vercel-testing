const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Pickup = require('../models/Pickup');
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

// Route to handle scheduling a book pickup
router.post('/schedule', async (req, res) => {
  const { cartId, email, pickupDate, pickupTime, pickupLocation } = req.body; // Destructuring request body to extract required fields

  try {
    // Validate that all required fields are provided
    if (!email || !pickupDate || !pickupTime || !pickupLocation) {
      return res.status(400).send('All fields (email, pickupDate, pickupTime, pickupLocation) are required.'); // Send a 400 error if any field is missing
    }

    // Check if the selected time slot is already booked
    const existingBooking = await Pickup.findOne({
      pickupDate,
      pickupTime,
      pickupLocation,
    });

    // If the time slot is already booked, return a 409 conflict error
    if (existingBooking) {
      return res.status(409).json({ message: 'This time slot is already booked. Please select another slot.' });
    }

    // Check if the user already has a pickup scheduled
    const existingPickup = await Pickup.findOne({ userEmail: email });

    if (existingPickup) {
      // If a pickup exists, update the existing record with new details
      existingPickup.pickupDate = pickupDate;
      existingPickup.pickupTime = pickupTime;
      existingPickup.pickupLocation = pickupLocation;
      await existingPickup.save(); // Save the updated pickup
      console.log('Updated existing booking:', existingPickup); // Log the updated booking for debugging
    } else {
      // If no existing pickup, create a new one
      const newPickup = new Pickup({
        cartId,
        userEmail: email,
        pickupDate,
        pickupTime,
        pickupLocation,
      });
      await newPickup.save(); // Save the new pickup in the database
      console.log('Created new booking:', newPickup); // Log the new booking for debugging
    }

    // Sending a confirmation email to the user
    const mailOptions = {
      from: 'hridayjuneja04@gmail.com', // Sender email address
      to: email, // Recipient's email address
      subject: 'Book Pickup Confirmation', // Email subject
      text: `Dear user,\n\nYour book pickup has been scheduled successfully. Here are the details:\n\nPickup Location: ${pickupLocation}\nPickup Date: ${pickupDate}\nPickup Time: ${pickupTime}\n\nThank you for using our service!\n\nBest regards,\nSamskrita Bharati Team`, // Email body content
    };

    // Send the email using the transporter
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error.message); // Log any error that occurs while sending the email
      } else {
        console.log('Email sent: ' + info.response); // Log the response when the email is successfully sent
      }
    });

    // Respond with a success message
    res.status(200).json({ message: 'Pickup scheduled successfully' });
  } catch (error) {
    console.error('Error scheduling pickup:', error.message); // Log any error that occurs while scheduling the pickup
    res.status(500).send('Error scheduling pickup: ' + error.message); // Respond with a 500 error and the error message
  }
});

// Route to fetch available slots for a selected date and location
router.get('/available-slots', async (req, res) => {
  const { pickupDate, pickupLocation } = req.query; // Destructuring query parameters

  try {
    // Format the incoming date to match the format stored in the database (YYYY-MM-DD)
    const formattedPickupDate = new Date(pickupDate).toISOString().split('T')[0]; 

    // Query the database for pickups on the selected date and location
    const bookedPickups = await Pickup.find({
      pickupDate: { $regex: `^${formattedPickupDate}` }, // Using regex to match the date part only
      pickupLocation
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
    console.error('Error fetching available slots:', error.message); // Log any error that occurs while fetching slots
    res.status(500).json({ error: 'Failed to fetch available slots' }); // Respond with a 500 error and a message
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
