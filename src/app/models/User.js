const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  subscriptionStatus: { 
    type: String, 
    enum: ['active', 'inactive', 'trial'], 
    default: 'trial' 
  },
  subscriptionType: {
    type: String,
    enum: ['free', 'premium', 'enterprise'],
    default: 'free'
  },
  devices: { type: Number, default: 1 },
  sleepSessions: { type: Number, default: 0 },
  lastLogin: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);