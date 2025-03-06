const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

// Initialize express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Load initial vehicle data
let vehicles = [];
try {
  const data = fs.readFileSync(path.join(__dirname, 'data', 'vehicles.json'), 'utf8');
  vehicles = JSON.parse(data);
} catch (err) {
  console.log('No existing vehicle data found, starting with empty array');
}

// Save vehicle data to file
const saveVehicles = () => {
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }
  fs.writeFileSync(
    path.join(dataDir, 'vehicles.json'),
    JSON.stringify(vehicles, null, 2),
    'utf8'
  );
};

// API Routes
app.get('/api/vehicles', (req, res) => {
  res.json(vehicles);
});

app.post('/api/vehicles', (req, res) => {
  const vehicle = req.body;
  vehicle.id = Date.now().toString();
  vehicle.lastUpdated = new Date().toISOString();
  
  // Ensure we have the required fields
  vehicles.push(vehicle);
  saveVehicles();
  io.emit('vehicle-update', vehicles);
  res.status(201).json(vehicle);
});

app.put('/api/vehicles/:id', (req, res) => {
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
  saveVehicles();
  io.emit('vehicle-update', vehicles);
  res.json(updatedVehicle);
});

app.delete('/api/vehicles/:id', (req, res) => {
  const { id } = req.params;
  const index = vehicles.findIndex(v => v.id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Vehicle not found' });
  }
  
  vehicles.splice(index, 1);
  saveVehicles();
  io.emit('vehicle-update', vehicles);
  res.status(204).send();
});

// Route for updating just the vehicle location (simulating movement)
app.patch('/api/vehicles/:id/location', (req, res) => {
  const { id } = req.params;
  const { location } = req.body;
  
  const vehicle = vehicles.find(v => v.id === id);
  if (!vehicle) {
    return res.status(404).json({ message: 'Vehicle not found' });
  }
  
  vehicle.location = location;
  vehicle.lastUpdated = new Date().toISOString();
  saveVehicles();
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
    const { id, location } = data;
    const vehicle = vehicles.find(v => v.id === id);
    
    if (vehicle) {
      vehicle.location = location;
      vehicle.lastUpdated = new Date().toISOString();
      saveVehicles();
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

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});