const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { auth, adminAuth, driverAuth } = require('../middleware/auth');

// @route   GET api/vehicles
// @desc    Get all vehicles
// @access  Private
router.get('/', auth, vehicleController.getAllVehicles);

// @route   POST api/vehicles
// @desc    Create a new vehicle
// @access  Admin
router.post('/', adminAuth, vehicleController.createVehicle);

// @route   PUT api/vehicles/:id/location
// @desc    Update vehicle location
// @access  Driver
router.put('/:id/location', driverAuth, vehicleController.updateVehicleLocation);

module.exports = router;