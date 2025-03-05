const mongoose = require('mongoose');

const ridershipRecordSchema = new mongoose.Schema({
  routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route' },
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
  stopId: { type: String },
  timestamp: { type: Date, default: Date.now },
  boardingCount: { type: Number, default: 0 },
  alightingCount: { type: Number, default: 0 }
});

module.exports = mongoose.model('RidershipRecord', ridershipRecordSchema);