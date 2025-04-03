const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  phone: String,
  address: String,
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'customer'], default: 'customer' }
}, { timestamps: true });

module.exports = mongoose.model('users', userSchema);
