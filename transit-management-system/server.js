require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const Vehicle = require('./models/Vehicle');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/vehicles', require('./routes/vehicles'));
// Add other routes here

// Socket.io real-time connections
io.on('connection', (socket) => {
  console.log('New client connected', socket.id);
  
  // Listen for driver location updates
  socket.on('update-location', async (data) => {
    try {
      const { vehicleId, latitude, longitude } = data;
      
      const vehicle = await Vehicle.findOne({ vehicleId });
      if (vehicle) {
        vehicle.currentLocation = {
          latitude,
          longitude,
          lastUpdated: Date.now()
        };
        
        await vehicle.save();
        
        // Broadcast to all clients
        io.emit('vehicle-location-update', {
          vehicleId: vehicle.vehicleId,
          location: vehicle.currentLocation
        });
      }
    } catch (err) {
      console.error('Socket error:', err.message);
    }
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id);
  });
});

// Serve frontend applications
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin', 'index.html'));
});

app.get('/driver', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'driver', 'index.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));