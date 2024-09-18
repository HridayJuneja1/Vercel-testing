const mongoose = require('mongoose');
const crypto = require('crypto'); // Import crypto module to generate the token

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
  verificationToken: { type: String, required: false },
  loginAttempts: { type: Number, default: 0 },
  isLocked: { type: Boolean, default: false },
  resetPasswordToken: { type: String, required: false },
  resetPasswordExpires: { type: Date, required: false },
  LoggedIn: { type: Boolean, default: false },
}, {
  timestamps: true,
});

userSchema.methods.generatePasswordReset = function() {
  this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordExpires = Date.now() + 3600000;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
