const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  vehicleId: { type: String, required: true, unique: true },
  type: { type: String, enum: ['bus', 'van', 'specialized'], default: 'bus' },
  capacity: { type: Number, required: true },
  status: { type: String, enum: ['active', 'maintenance', 'out-of-service'], default: 'active' },
  currentLocation: {
    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
  },
  currentRoute: { type: mongoose.Schema.Types.ObjectId, ref: 'Route' },
  currentDriver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);