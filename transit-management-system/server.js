const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');
const cors = require('cors');

// Initialize express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Global variables
let vehicles = [];
let isSaving = false;
let saveQueue = [];

// Load initial vehicle data
const loadVehicles = async () => {
  try {
    const dataDir = path.join(__dirname, 'data');
    const filePath = path.join(dataDir, 'vehicles.json');

    // Create data directory if it doesn't exist
    if (!fsSync.existsSync(dataDir)) {
      fsSync.mkdirSync(dataDir);
    }

    // Check if file exists first
    if (fsSync.existsSync(filePath)) {
      const data = await fs.readFile(filePath, 'utf8');
      vehicles = JSON.parse(data);
      
      // Ensure all vehicles have a speed property
      vehicles = vehicles.map(vehicle => ({
        ...vehicle,
        speed: vehicle.speed || 30, // Default speed is 30 km/h
        heading: vehicle.heading || 0 // Default heading is 0 degrees (North)
      }));
      
      console.log(`Loaded ${vehicles.length} vehicles from data file`);
    } else {
      console.log('No existing vehicle data file, creating empty array');
      // Create an empty file
      await fs.writeFile(filePath, JSON.stringify([], null, 2), 'utf8');
    }
  } catch (err) {
    console.error('Error loading vehicle data:', err);
  }
};

// Save vehicle data to file with queue mechanism
const saveVehicles = async () => {
  // If already saving, queue this save operation
  if (isSaving) {
    saveQueue.push(true);
    return;
  }
  
  try {
    isSaving = true;
    const dataDir = path.join(__dirname, 'data');
    const filePath = path.join(dataDir, 'vehicles.json');
    
    // Create data directory if it doesn't exist
    if (!fsSync.existsSync(dataDir)) {
      fsSync.mkdirSync(dataDir);
    }

    // Create a temporary file first
    const tempPath = `${filePath}.tmp`;
    await fs.writeFile(tempPath, JSON.stringify(vehicles, null, 2), 'utf8');
    
    // If the original file exists, rename the temp file to replace it
    if (fsSync.existsSync(filePath)) {
      try {
        // Try to delete the original file first
        await fs.unlink(filePath);
      } catch (err) {
        console.warn('Could not delete original file:', err.message);
        // Wait a moment before trying the rename
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    // Rename the temporary file to the target file
    await fs.rename(tempPath, filePath);
    console.log('Vehicle data saved successfully');
  } catch (err) {
    console.error('Error saving vehicle data:', err);
  } finally {
    isSaving = false;
    
    // Process next save request in queue if any
    if (saveQueue.length > 0) {
      saveQueue.shift(); // Remove the first item
      setTimeout(saveVehicles, 100); // Wait a bit before the next save
    }
  }
};

// API Routes
app.get('/api/vehicles', (req, res) => {
  res.json(vehicles);
});

app.post('/api/vehicles', async (req, res) => {
  const vehicle = req.body;
  vehicle.id = Date.now().toString();
  vehicle.lastUpdated = new Date().toISOString();
  vehicle.speed = vehicle.speed || 30; // Default speed
  vehicle.heading = vehicle.heading || 0; // Default heading
  
  // Ensure we have the required fields
  vehicles.push(vehicle);
  
  // Save asynchronously
  saveVehicles().catch(err => console.error('Error saving after POST:', err));
  
  io.emit('vehicle-update', vehicles);
  res.status(201).json(vehicle);
});

app.put('/api/vehicles/:id', async (req, res) => {
  const { id } = req.params;
  const index = vehicles.findIndex(v => v.id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Vehicle not found' });
  }
  
  const updatedVehicle = {
    ...vehicles[index],
    ...req.body,
    id,
    lastUpdated: new Date().toISOString()
  };
  
  vehicles[index] = updatedVehicle;
  
  // Save asynchronously
  saveVehicles().catch(err => console.error('Error saving after PUT:', err));
  
  io.emit('vehicle-update', vehicles);
  res.json(updatedVehicle);
});

// Update just the speed of a vehicle
app.patch('/api/vehicles/:id/speed', async (req, res) => {
  const { id } = req.params;
  const { speed } = req.body;
  
  const index = vehicles.findIndex(v => v.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Vehicle not found' });
  }
  
  vehicles[index].speed = speed;
  vehicles[index].lastUpdated = new Date().toISOString();
  
  // Save asynchronously
  saveVehicles().catch(err => console.error('Error saving after speed update:', err));
  
  io.emit('vehicle-update', vehicles);
  res.json(vehicles[index]);
});

// Update just the status of a vehicle
app.patch('/api/vehicles/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const index = vehicles.findIndex(v => v.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Vehicle not found' });
  }
  
  vehicles[index].status = status;
  vehicles[index].lastUpdated = new Date().toISOString();
  
  // Save asynchronously
  saveVehicles().catch(err => console.error('Error saving after status update:', err));
  
  io.emit('vehicle-update', vehicles);
  res.json(vehicles[index]);
});

app.delete('/api/vehicles/:id', async (req, res) => {
  const { id } = req.params;
  const index = vehicles.findIndex(v => v.id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Vehicle not found' });
  }
  
  vehicles.splice(index, 1);
  
  // Save asynchronously
  saveVehicles().catch(err => console.error('Error saving after DELETE:', err));
  
  io.emit('vehicle-update', vehicles);
  res.status(204).send();
});

// Route for updating just the vehicle location (simulating movement)
app.patch('/api/vehicles/:id/location', async (req, res) => {
  const { id } = req.params;
  const { location, heading } = req.body;
  
  const vehicle = vehicles.find(v => v.id === id);
  if (!vehicle) {
    return res.status(404).json({ message: 'Vehicle not found' });
  }
  
  vehicle.location = location;
  if (heading !== undefined) {
    vehicle.heading = heading;
  }
  vehicle.lastUpdated = new Date().toISOString();
  
  // Save asynchronously - but less frequently for location updates
  // Only save every 10th update to reduce disk I/O
  if (Math.random() < 0.1) { // ~10% probability
    saveVehicles().catch(err => console.error('Error saving after location update:', err));
  }
  
  io.emit('vehicle-update', vehicles);
  res.json(vehicle);
});

// Socket.io setup
io.on('connection', (socket) => {
  console.log('New client connected');
  
  // Send current vehicles to new client
  socket.emit('vehicle-update', vehicles);
  
  // Listen for location updates
  socket.on('update-location', (data) => {
    const { id, location, heading } = data;
    const vehicle = vehicles.find(v => v.id === id);
    
    if (vehicle) {
      vehicle.location = location;
      if (heading !== undefined) {
        vehicle.heading = heading;
      }
      vehicle.lastUpdated = new Date().toISOString();
      
      // Save occasionally for socket-based updates to reduce disk I/O
      if (Math.random() < 0.1) { // ~10% probability  
        saveVehicles().catch(err => console.error('Error saving after socket update:', err));
      }
      
      io.emit('vehicle-update', vehicles);
    }
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Serve the main HTML file for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Initialize by loading vehicles
loadVehicles().then(() => {
  // Start server after data is loaded
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});