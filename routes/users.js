const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/user.model');
const router = express.Router();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'hridayjuneja04@gmail.com',
    pass: 'mdej psmy dvrv wgwu', 
  },
});

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const verificationToken = crypto.randomBytes(20).toString('hex');

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      verified: false,
    });

    await newUser.save();
    const baseUrl = req.protocol + '://' + req.get('host');
    const verificationUrl = `${baseUrl}/api/users/verify/${verificationToken}`;

    await transporter.sendMail({
      from: 'hridayjuneja04@gmail.com',
      to: newUser.email,
      subject: 'Verify your email',
      html: `Please click this link to verify your email: <a href="${verificationUrl}">${verificationUrl}</a>`,
    });

    res.status(201).json({ message: 'Registration successful! Please check your email to verify your account.' });
  } catch (error) {
    res.status(400).json({ error: 'Error: ' + error.message });
  }
});

router.get('/verify/:token', async (req, res) => {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });

    if (!user) {
      return res.status(400).send('Invalid or expired verification link.');
    }

    user.verified = true;
    user.verificationToken = '';
    await user.save();

    res.send('Account verified successfully! You can now log in.');
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    }

    if (user.isLocked) {
      return res.status(403).json({ error: 'Your account is locked. Please reset your password.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      user.loginAttempts += 1;
      if (user.loginAttempts >= 3) {
        user.isLocked = true;
        const resetPasswordUrl = `YOUR_FRONT_END_PATH_FOR_RESETTING_PASSWORD`;
        await transporter.sendMail({
          from: process.env.GMAIL_USER,
          to: user.email,
          subject: 'Account Locked',
          html: `Your account has been locked due to multiple failed login attempts. Please reset your password.`
        });
      }
      await user.save();
      return res.status(401).json({ error: 'Invalid password.' });
    }

    if (!user.verified) {
      return res.status(403).json({ error: 'Please verify your email to login.' });
    }

    user.loginAttempts = 0;
    user.LoggedIn = true;
    await user.save();

    try {
      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: user.email,
        subject: 'New login detected',
        html: 'A new login to your account was detected. If this was not you, please change your password immediately.'
      });
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
    }

    res.json({
      authenticated: true,
      user: {
        name: user.name,
        email: user.email,
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/logout', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    user.LoggedIn = false;
    await user.save();

    res.json({ message: 'Logged out successfully.' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Server error during logout.' });
  }
});



router.post('/change-password', async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    
    const passwordIsValid = await bcrypt.compare(oldPassword, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({ success: false, message: "Incorrect old password." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);
    
    user.password = hashedNewPassword;
    let message = "Password changed successfully.";
    if (user.isLocked) {
      user.isLocked = false;
      user.loginAttempts = 0;
      message += " Your account is now unlocked.";
    }
    await user.save();

    res.json({ success: true, message: message });
  } catch (error) {
    console.error('Change Password Error:', error);
    res.status(500).json({ success: false, message: "Failed to change password due to technical issues." });
  }
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "If an account with that email exists, we've sent a link to reset your password." });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const resetUrl = `${baseUrl}/reset-password/${resetToken}`;

    await transporter.sendMail({
      to: user.email,
      from: 'hridayjuenja04@gmail.com',
      subject: 'Password Reset Request',
      html: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
            `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
            `<a href="${resetUrl}">${resetUrl}</a>\n\n` +
            `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    });

    res.json({ message: "If an account with that email exists, we've sent a link to reset your password." });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ message: "Error sending reset password email." });
  }
});

router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: email,
    to: 'hridayjuneja04@gmail.com',
    subject: `Message from ${name}`,
    html: `<p>You have a new message from your Samskrita Bharati website contact form.</p>
           <p><strong>Name:</strong> ${name}</p>
           <p><strong>Email:</strong> ${email}</p>
           <p><strong>Message:</strong> ${message}</p>`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).json({ message: "Message sent successfully" });
    }
  });
});



router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Password reset token is invalid or has expired." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Your password has been successfully reset." });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
