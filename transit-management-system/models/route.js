const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  routeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  stops: [{
    stopId: { type: String, required: true },
    name: { type: String, required: true },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    },
    arrivalTime: { type: String } // Format: HH:MM (24-hour)
  }],
  schedule: [{
    day: { type: String, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
    startTime: { type: String }, // Format: HH:MM (24-hour)
    endTime: { type: String }, // Format: HH:MM (24-hour)
    frequency: { type: Number } // in minutes
  }],
  type: { type: String, enum: ['fixed', 'on-demand', 'specialized'], default: 'fixed' }
});

module.exports = mongoose.model('Route', routeSchema);