// Client-side JavaScript for Transit Management System
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing application...');
    
    // DOM Elements
    const connectionStatus = document.getElementById('connection-status');
    const vehicleList = document.getElementById('vehicle-list');
    const addVehicleForm = document.getElementById('add-vehicle-form');
    const vehicleModal = document.getElementById('vehicle-modal');
    const closeModal = document.getElementById('close-modal');
    const vehicleDetails = document.getElementById('vehicle-details');
    const updateLocationBtn = document.getElementById('update-location');
    const deleteVehicleBtn = document.getElementById('delete-vehicle');
    
    // Current vehicles data
    let vehicles = [];
    let currentVehicle = null;
  
    // Socket connection
    console.log('Attempting to connect to socket server...');
    const socket = io();
    
    // Socket event handlers
    socket.on('connect', function() {
      console.log('Socket connected successfully!');
      connectionStatus.textContent = 'Connected';
      connectionStatus.classList.add('connected');
    });
    
    socket.on('disconnect', function() {
      console.log('Socket disconnected');
      connectionStatus.textContent = 'Disconnected';
      connectionStatus.classList.remove('connected');
      connectionStatus.classList.add('disconnected');
    });
    
    socket.on('connect_error', function(error) {
      console.error('Connection error:', error);
      connectionStatus.textContent = 'Connection Error';
      connectionStatus.classList.remove('connected');
      connectionStatus.classList.add('disconnected');
    });
    
    socket.on('vehicle-update', function(data) {
      console.log('Received vehicle update:', data);
      vehicles = data;
      renderVehicleList();
    });
    
    // Render the vehicle list
    function renderVehicleList() {
      console.log('Rendering vehicle list with', vehicles.length, 'vehicles');
      
      if (vehicles.length === 0) {
        vehicleList.innerHTML = '<div class="loading">No vehicles available. Add a new vehicle to get started.</div>';
        return;
      }
      
      vehicleList.innerHTML = '';
      vehicles.forEach(vehicle => {
        const vehicleCard = document.createElement('div');
        vehicleCard.className = 'vehicle-card';
        vehicleCard.setAttribute('data-id', vehicle.id);
        
        vehicleCard.innerHTML = `
          <div class="vehicle-id">${vehicle.vehicleId || 'No ID'}</div>
          <div class="vehicle-type">${vehicle.type || 'Unknown'}</div>
          <div class="status ${vehicle.status || 'unknown'}">${vehicle.status || 'Unknown'}</div>
        `;
        
        vehicleCard.addEventListener('click', () => showVehicleDetails(vehicle));
        vehicleList.appendChild(vehicleCard);
      });
    }
    
    // Show vehicle details in modal
    function showVehicleDetails(vehicle) {
      console.log('Showing details for vehicle:', vehicle);
      currentVehicle = vehicle;
      
      vehicleDetails.innerHTML = `
        <div class="detail-row">
          <div class="detail-label">ID:</div>
          <div>${vehicle.vehicleId || 'No ID'}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Type:</div>
          <div>${vehicle.type || 'Unknown'}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Capacity:</div>
          <div>${vehicle.capacity || 'Unknown'}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Status:</div>
          <div>${vehicle.status || 'Unknown'}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Last Updated:</div>
          <div>${new Date(vehicle.lastUpdated).toLocaleString() || 'Unknown'}</div>
        </div>
      `;
      
      vehicleModal.style.display = 'block';
    }
    
    // Close modal
    closeModal.addEventListener('click', function() {
      vehicleModal.style.display = 'none';
      currentVehicle = null;
    });
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
      if (event.target == vehicleModal) {
        vehicleModal.style.display = 'none';
        currentVehicle = null;
      }
    });
    
    // Add vehicle form submission
    addVehicleForm.addEventListener('submit', function(event) {
      event.preventDefault();
      console.log('Adding new vehicle...');
      
      const vehicleId = document.getElementById('vehicleId').value;
      const type = document.getElementById('type').value;
      const capacity = parseInt(document.getElementById('capacity').value);
      const status = document.getElementById('status').value;
      
      // Create new vehicle object
      const newVehicle = {
        vehicleId,
        type,
        capacity,
        status,
        // Simulate a random location for demo purposes
        location: {
          lat: 40.7128 + (Math.random() - 0.5) * 0.1,
          lng: -74.0060 + (Math.random() - 0.5) * 0.1
        }
      };
      
      console.log('New vehicle data:', newVehicle);
      
      // Send to server via REST API
      fetch('/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newVehicle)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to add vehicle');
        }
        return response.json();
      })
      .then(data => {
        console.log('Vehicle added successfully:', data);
        addVehicleForm.reset();
      })
      .catch(error => {
        console.error('Error adding vehicle:', error);
        alert('Failed to add vehicle: ' + error.message);
      });
    });
    
    // Update vehicle location
    updateLocationBtn.addEventListener('click', function() {
      if (!currentVehicle) return;
      
      console.log('Updating location for vehicle:', currentVehicle.id);
      
      // Simulate a new random location
      const newLocation = {
        lat: 40.7128 + (Math.random() - 0.5) * 0.1,
        lng: -74.0060 + (Math.random() - 0.5) * 0.1
      };
      
      socket.emit('update-location', {
        id: currentVehicle.id,
        location: newLocation
      });
      
      vehicleModal.style.display = 'none';
    });
    
    // Delete vehicle
    deleteVehicleBtn.addEventListener('click', function() {
      if (!currentVehicle) return;
      
      if (confirm(`Are you sure you want to delete vehicle ${currentVehicle.vehicleId}?`)) {
        console.log('Deleting vehicle:', currentVehicle.id);
        
        fetch(`/api/vehicles/${currentVehicle.id}`, {
          method: 'DELETE'
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to delete vehicle');
          }
          console.log('Vehicle deleted successfully');
          vehicleModal.style.display = 'none';
        })
        .catch(error => {
          console.error('Error deleting vehicle:', error);
          alert('Failed to delete vehicle: ' + error.message);
        });
      }
    });
    
    // Initialize by rendering empty vehicle list
    renderVehicleList();
    console.log('Application initialized');
  });