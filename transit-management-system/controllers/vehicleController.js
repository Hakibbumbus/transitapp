const Vehicle = require('../models/Vehicle');

// Get all vehicles
exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find()
      .populate('currentRoute', 'routeId name')
      .populate('currentDriver', 'name');
    res.json(vehicles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Create a new vehicle
exports.createVehicle = async (req, res) => {
  try {
    const { vehicleId, type, capacity } = req.body;
    
    // Check if vehicle already exists
    let vehicle = await Vehicle.findOne({ vehicleId });
    if (vehicle) {
      return res.status(400).json({ msg: 'Vehicle ID already exists' });
    }
    
    vehicle = new Vehicle({
      vehicleId,
      type,
      capacity
    });
    
    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update vehicle location
exports.updateVehicleLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ msg: 'Vehicle not found' });
    }
    
    vehicle.currentLocation = {
      latitude,
      longitude,
      lastUpdated: Date.now()
    };
    
    await vehicle.save();
    res.json(vehicle);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};