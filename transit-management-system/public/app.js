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
    const startAddressInput = document.getElementById('startAddress');
    const endAddressInput = document.getElementById('endAddress');
    
    // Current vehicles data
    let vehicles = [];
    let currentVehicle = null;
    let map = null;
    let markers = [];
    let directionsService = null;
    let directionsRenderer = null;
    
    // Define Calgary bounds for map restriction
    const calgarySW = { lat: 50.8, lng: -114.3 }; // Southwest corner
    const calgaryNE = { lat: 51.2, lng: -113.9 }; // Northeast corner
    const calgaryBounds = new google.maps.LatLngBounds(calgarySW, calgaryNE);
    
    // Initialize the map
    function initMap() {
      // Center on Calgary downtown
      const calgaryCenter = { lat: 51.0447, lng: -114.0719 };
      
      map = new google.maps.Map(document.getElementById('map'), {
        center: calgaryCenter,
        zoom: 12,
        restriction: {
          latLngBounds: calgaryBounds,
          strictBounds: false
        }
      });
      
      // Initialize directions service
      directionsService = new google.maps.DirectionsService();
      directionsRenderer = new google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: true // We'll create custom markers
      });
      
      // Initialize autocomplete for address fields
      const startAutocomplete = new google.maps.places.Autocomplete(startAddressInput);
      const endAutocomplete = new google.maps.places.Autocomplete(endAddressInput);
      
      // Restrict autocomplete to Calgary area
      startAutocomplete.setBounds(calgaryBounds);
      endAutocomplete.setBounds(calgaryBounds);
      startAutocomplete.setOptions({ strictBounds: true });
      endAutocomplete.setOptions({ strictBounds: true });
      
      // Load vehicles after map is initialized
      fetchVehicles();
    }
    
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
      updateMapMarkers();
    });
    
    // Fetch vehicles from API
    function fetchVehicles() {
      fetch('/api/vehicles')
        .then(response => response.json())
        .then(data => {
          vehicles = data;
          renderVehicleList();
          updateMapMarkers();
        })
        .catch(error => {
          console.error('Error fetching vehicles:', error);
        });
    }
    
    // Update map markers
    function updateMapMarkers() {
      // Clear existing markers
      markers.forEach(marker => marker.setMap(null));
      markers = [];
      
      // Add markers for each vehicle
      vehicles.forEach(vehicle => {
        if (vehicle.location) {
          const marker = new google.maps.Marker({
            position: vehicle.location,
            map: map,
            title: vehicle.vehicleId,
            icon: {
              path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
              scale: 5,
              fillColor: getVehicleColor(vehicle.type),
              fillOpacity: 1,
              strokeWeight: 1,
              rotation: 0 // Vehicle heading
            }
          });
          
          marker.addListener('click', () => showVehicleDetails(vehicle));
          markers.push(marker);
          
          // Display route if start and end locations exist
          if (vehicle.startLocation && vehicle.endLocation) {
            displayRoute(vehicle);
          }
        }
      });
    }
    
    // Return a color based on vehicle type
    function getVehicleColor(type) {
      switch(type) {
        case 'bus': return '#3a86ff';
        case 'van': return '#ff006e';
        case 'specialized': return '#ffbe0b';
        default: return '#38b000';
      }
    }
    
    // Display route for a vehicle
    function displayRoute(vehicle) {
      if (!vehicle.startLocation || !vehicle.endLocation) return;
      
      const request = {
        origin: vehicle.startLocation,
        destination: vehicle.endLocation,
        travelMode: google.maps.TravelMode.DRIVING
      };
      
      directionsService.route(request, function(result, status) {
        if (status === 'OK') {
          // Create a new renderer for each route
          const renderer = new google.maps.DirectionsRenderer({
            map: map,
            directions: result,
            suppressMarkers: true,
            polylineOptions: {
              strokeColor: getVehicleColor(vehicle.type),
              strokeWeight: 4
            }
          });
          
          // Store renderer reference to clear it later
          vehicle.directionsRenderer = renderer;
        } else {
          console.error('Directions request failed due to ' + status);
        }
      });
    }
    
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
    
    // Convert address to coordinates using Geocoding API
    function geocodeAddress(address) {
      return new Promise((resolve, reject) => {
        const geocoder = new google.maps.Geocoder();
        
        geocoder.geocode({ 
          address: address,
          bounds: calgaryBounds,
          componentRestrictions: { country: 'CA' }
        }, (results, status) => {
          if (status === 'OK') {
            resolve({
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng()
            });
          } else {
            reject(new Error('Geocoding failed due to: ' + status));
          }
        });
      });
    }
    
    // Show vehicle details in modal
    function showVehicleDetails(vehicle) {
      console.log('Showing details for vehicle:', vehicle);
      currentVehicle = vehicle;
      
      // Format display for the locations
      const startLocationText = vehicle.startAddress || 'Not specified';
      const endLocationText = vehicle.endAddress || 'Not specified';
      
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
          <div class="detail-label">Start:</div>
          <div>${startLocationText}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">End:</div>
          <div>${endLocationText}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Last Updated:</div>
          <div>${new Date(vehicle.lastUpdated).toLocaleString() || 'Unknown'}</div>
        </div>
      `;
      
      vehicleModal.style.display = 'block';
      
      // Center map on this vehicle
      if (vehicle.location && map) {
        map.setCenter(vehicle.location);
        map.setZoom(14);
      }
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
    addVehicleForm.addEventListener('submit', async function(event) {
      event.preventDefault();
      console.log('Adding new vehicle...');
      
      const vehicleId = document.getElementById('vehicleId').value;
      const type = document.getElementById('type').value;
      const capacity = parseInt(document.getElementById('capacity').value);
      const status = document.getElementById('status').value;
      const startAddress = document.getElementById('startAddress').value;
      const endAddress = document.getElementById('endAddress').value;
      
      try {
        // Process start and end addresses if provided
        let startLocation = null;
        let endLocation = null;
        
        if (startAddress) {
          startLocation = await geocodeAddress(startAddress + ', Calgary, AB, Canada');
        }
        
        if (endAddress) {
          endLocation = await geocodeAddress(endAddress + ', Calgary, AB, Canada');
        }
        
        // Use start location for vehicle's current location, or a default location
        const vehicleLocation = startLocation || {
          lat: 51.0447 + (Math.random() - 0.5) * 0.05,
          lng: -114.0719 + (Math.random() - 0.5) * 0.05
        };
        
        // Create new vehicle object
        const newVehicle = {
          vehicleId,
          type,
          capacity,
          status,
          location: vehicleLocation,
          startLocation,
          endLocation,
          startAddress,
          endAddress
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
      } catch (error) {
        console.error('Error processing addresses:', error);
        alert('Error processing addresses: ' + error.message);
      }
    });
    
    // Update vehicle location - simulates movement along the route
    updateLocationBtn.addEventListener('click', function() {
      if (!currentVehicle) return;
      
      console.log('Updating location for vehicle:', currentVehicle.id);
      
      // If the vehicle has start and end locations, move it along the route
      if (currentVehicle.startLocation && currentVehicle.endLocation) {
        // This is a simplistic approach to simulate movement along a route
        // In a real system, you'd use the actual route points
        const start = currentVehicle.startLocation;
        const end = currentVehicle.endLocation;
        
        // Calculate a point between start and end
        const progress = Math.random(); // Random value between 0 and 1 for demo
        const newLocation = {
          lat: start.lat + (end.lat - start.lat) * progress,
          lng: start.lng + (end.lng - start.lng) * progress
        };
        
        socket.emit('update-location', {
          id: currentVehicle.id,
          location: newLocation
        });
      } else {
        // If no route, just move randomly in the Calgary area
        const newLocation = {
          lat: 51.0447 + (Math.random() - 0.5) * 0.05,
          lng: -114.0719 + (Math.random() - 0.5) * 0.05
        };
        
        socket.emit('update-location', {
          id: currentVehicle.id,
          location: newLocation
        });
      }
      
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
    
    // Initialize the map when page loads
    initMap();
  });