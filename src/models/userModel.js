// models/userModel.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  address: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
  otp: { type: String }, // Thêm trường OTP
  otpExpiry: { type: Date } // Thêm trường thời gian hết hạn OTP
}, { timestamps: true });



module.exports = mongoose.model('users', userSchema);
