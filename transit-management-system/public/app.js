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
  let markers = {};
  let routePolylines = {};
  let directionsService = null;
  let updateIntervals = {}; // Store interval IDs for each vehicle
  let vehicleColors = {}; // Store unique colors for each vehicle
  
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
    
    // Clear all update intervals on disconnect
    Object.values(updateIntervals).forEach(intervalId => clearInterval(intervalId));
    updateIntervals = {};
  });
  
  socket.on('connect_error', function(error) {
    console.error('Connection error:', error);
    connectionStatus.textContent = 'Connection Error';
    connectionStatus.classList.remove('connected');
    connectionStatus.classList.add('disconnected');
  });
  
  socket.on('vehicle-update', function(data) {
    console.log('Received vehicle update:', data);
    
    // Store the previous vehicles state to compare
    const prevVehicles = [...vehicles];
    vehicles = data;
    
    // Ensure all vehicles have a color assigned
    vehicles.forEach(vehicle => {
      if (!vehicleColors[vehicle.id]) {
        vehicleColors[vehicle.id] = generateRandomColor();
      }
    });
    
    // Update the UI
    renderVehicleList();
    
    // Only update the map if the vehicle data has changed
    if (JSON.stringify(prevVehicles) !== JSON.stringify(vehicles)) {
      updateVehiclesOnMap();
    }
  });

  // Generate a random vibrant color
  function generateRandomColor() {
    // Use HSL to ensure vibrant colors - high saturation and reasonable lightness
    const hue = Math.floor(Math.random() * 360); // 0-359 degrees on color wheel
    const saturation = 75 + Math.random() * 25; // 75-100% saturation (vibrant)
    const lightness = 45 + Math.random() * 10; // 45-55% lightness (not too dark or light)
    
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  // Fetch vehicles from API
  function fetchVehicles() {
    fetch('/api/vehicles')
      .then(response => response.json())
      .then(data => {
        vehicles = data;
        
        // Assign colors to vehicles if they don't have one
        vehicles.forEach(vehicle => {
          if (!vehicleColors[vehicle.id]) {
            vehicleColors[vehicle.id] = generateRandomColor();
          }
        });
        
        renderVehicleList();
        updateVehiclesOnMap();
      })
      .catch(error => {
        console.error('Error fetching vehicles:', error);
      });
  }
  
  // Update vehicles on map - create markers and set up routes
  function updateVehiclesOnMap() {
    // Do not clear simulation intervals to avoid interrupting ongoing movement.
    // Clear only markers and polylines.
    Object.values(markers).forEach(marker => marker.setMap(null));
    markers = {};
    
    Object.values(routePolylines).forEach(polyline => {
      if (polyline && polyline.setMap) {
        polyline.setMap(null);
      }
    });
    routePolylines = {};
    
    // Add markers and routes for each vehicle
    vehicles.forEach(vehicle => {
      if (vehicle.startLocation && vehicle.endLocation) {
        createVehicleMarker(vehicle);
        // Only set up simulation if it isn't already running and if the vehicle is active.
        if (!updateIntervals[vehicle.id] && vehicle.status === 'active' && vehicle.speed > 0) {
          calculateAndDisplayRoute(vehicle);
        }
      } else if (vehicle.location) {
        // For vehicles without routes, just create a marker at their current location.
        createSimpleMarker(vehicle);
      }
    });
  }

  
  // Create a simple marker for vehicles without routes
  function createSimpleMarker(vehicle) {
    if (vehicle.location) {
      const vehicleColor = vehicleColors[vehicle.id] || generateRandomColor();
      
      const marker = new google.maps.Marker({
        position: vehicle.location,
        map: map,
        title: vehicle.vehicleId,
        icon: {
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 5,
          fillColor: vehicleColor,
          fillOpacity: 1,
          strokeWeight: 1,
          rotation: vehicle.heading || 0
        }
      });
      
      marker.addListener('click', () => showVehicleDetails(vehicle));
      markers[vehicle.id] = marker;
    }
  }
  
  // Create a vehicle marker with proper heading
  function createVehicleMarker(vehicle) {
    if (!vehicle.location) {
      vehicle.location = vehicle.startLocation; // Use start location if no current location
    }
    
    const vehicleColor = vehicleColors[vehicle.id] || generateRandomColor();
    
    const marker = new google.maps.Marker({
      position: vehicle.location,
      map: map,
      title: vehicle.vehicleId,
      icon: {
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        scale: 5,
        fillColor: vehicleColor,
        fillOpacity: 1,
        strokeWeight: 1,
        rotation: vehicle.heading || 0 // Heading in degrees
      }
    });
    
    marker.addListener('click', () => showVehicleDetails(vehicle));
    markers[vehicle.id] = marker;
  }
  
  // Calculate and display route with waypoints that follow roads
  function calculateAndDisplayRoute(vehicle) {
    if (!vehicle.startLocation || !vehicle.endLocation) return;
    
    const request = {
      origin: vehicle.startLocation,
      destination: vehicle.endLocation,
      travelMode: google.maps.TravelMode.DRIVING
    };
    
    directionsService.route(request, function(result, status) {
      if (status === 'OK') {
        // Store the route details for movement simulation
        vehicle.routeDetails = result;
        
        // Extract path from routes
        const path = result.routes[0].overview_path;
        
        // Create a polyline for the route
        const polyline = new google.maps.Polyline({
          path: path,
          geodesic: true,
          strokeColor: vehicleColors[vehicle.id] || generateRandomColor(),
          strokeOpacity: 0.7,
          strokeWeight: 4
        });
        
        polyline.setMap(map);
        routePolylines[vehicle.id] = polyline;
        
        // Store route points to use for movement simulation
        vehicle.routePoints = path.map(point => ({
          lat: point.lat(),
          lng: point.lng()
        }));
        
        // Calculate initial heading
        if (path.length > 1) {
          vehicle.heading = calculateHeading(path[0], path[1]);
          updateMarkerHeading(vehicle.id, vehicle.heading);
        }
        
        // Set up simulation if vehicle is active
        if (vehicle.status === 'active' && vehicle.speed > 0) {
          setupMovementSimulation(vehicle);
        }
      } else {
        console.error('Directions request failed due to ' + status);
      }
    });
  }
  
  // Calculate heading between two points (in degrees)
  function calculateHeading(point1, point2) {
    return google.maps.geometry.spherical.computeHeading(
      new google.maps.LatLng(point1.lat || point1.lat(), point1.lng || point1.lng()),
      new google.maps.LatLng(point2.lat || point2.lat(), point2.lng || point2.lng())
    );
  }
  
  // Update marker heading
  function updateMarkerHeading(vehicleId, heading) {
    const marker = markers[vehicleId];
    if (marker) {
      const icon = marker.getIcon();
      icon.rotation = heading;
      marker.setIcon(icon);
    }
  }
  
  // Set up movement simulation for vehicle along its route
  function setupMovementSimulation(vehicle) {
    // Clear existing interval if any
    if (updateIntervals[vehicle.id]) {
      clearInterval(updateIntervals[vehicle.id]);
      delete updateIntervals[vehicle.id];
    }
    
    if (!vehicle.routePoints || vehicle.routePoints.length < 2) {
      console.log('Not enough route points for vehicle', vehicle.id);
      return;
    }
    
    console.log(`Setting up movement simulation for vehicle ${vehicle.id} with ${vehicle.routePoints.length} points`);
    
    // Determine vehicle's current position in the route
    let currentRouteIndex = 0;
    
    // Find closest point on route to current location
    if (vehicle.location && vehicle.routePoints.length > 0) {
      let minDistance = Number.MAX_VALUE;
      
      vehicle.routePoints.forEach((point, index) => {
        const distance = google.maps.geometry.spherical.computeDistanceBetween(
          new google.maps.LatLng(vehicle.location.lat, vehicle.location.lng),
          new google.maps.LatLng(point.lat, point.lng)
        );
        
        if (distance < minDistance) {
          minDistance = distance;
          currentRouteIndex = index;
        }
      });
    }
    
    // Make sure we're not at the end of the route
    if (currentRouteIndex >= vehicle.routePoints.length - 1) {
      currentRouteIndex = 0; // Reset to start if at the end
    }
    
    // Calculate speed in meters per second from km/h
    const speedMPS = (vehicle.speed || 30) * (1000 / 3600);
    
    console.log(`Vehicle ${vehicle.id} starting at route index ${currentRouteIndex}, speed: ${speedMPS} m/s`);
    
    // Store local copy of the route points to avoid issues with point manipulation
    const routePoints = [...vehicle.routePoints];
    
    // Update position every 2 seconds
    updateIntervals[vehicle.id] = setInterval(() => {
      if (currentRouteIndex >= routePoints.length - 1) {
        // Reached destination, stop movement
        console.log(`Vehicle ${vehicle.id} reached destination`);
        clearInterval(updateIntervals[vehicle.id]);
        delete updateIntervals[vehicle.id];
        return;
      }
      
      const currentPoint = routePoints[currentRouteIndex];
      const nextPoint = routePoints[currentRouteIndex + 1];
      
      // Calculate distance between points
      const distance = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(currentPoint.lat, currentPoint.lng),
        new google.maps.LatLng(nextPoint.lat, nextPoint.lng)
      );
      
      // Calculate how far the vehicle should move in 2 seconds
      let distanceToMove = speedMPS * 2; // Speed * time (2 seconds)
      
      // If next point is closer than the distance to move, move to next point
      if (distance <= distanceToMove) {
        // Move to next point
        vehicle.location = {
          lat: nextPoint.lat,
          lng: nextPoint.lng
        };
        
        currentRouteIndex++;
        
        // Calculate new heading if there are more points
        if (currentRouteIndex < routePoints.length - 1) {
          vehicle.heading = calculateHeading(
            routePoints[currentRouteIndex],
            routePoints[currentRouteIndex + 1]
          );
        }
      } else {
        // Interpolate position along the path
        const fraction = distanceToMove / distance;
        const newPosition = google.maps.geometry.spherical.interpolate(
          new google.maps.LatLng(currentPoint.lat, currentPoint.lng),
          new google.maps.LatLng(nextPoint.lat, nextPoint.lng),
          fraction
        );
        
        vehicle.location = {
          lat: newPosition.lat(),
          lng: newPosition.lng()
        };
        
        // Update current point for next interval but don't modify the original route
        routePoints[currentRouteIndex] = {
          lat: newPosition.lat(),
          lng: newPosition.lng()
        };
      }
      
      // Update marker position and heading
      if (markers[vehicle.id]) {
        markers[vehicle.id].setPosition(vehicle.location);
        updateMarkerHeading(vehicle.id, vehicle.heading);
      }
      
      console.log(`Vehicle ${vehicle.id} moved to`, vehicle.location);
      
      // Send update to server
      fetch(`/api/vehicles/${vehicle.id}/location`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          location: vehicle.location,
          heading: vehicle.heading
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log('Location update successful:', data);
      })
      .catch(error => {
        console.error('Error updating location:', error);
      });
      
    }, 2000); // Update every 2 seconds
  }

  // Return a color based on vehicle ID (using the assigned color)
  function getVehicleColor(vehicleId) {
    return vehicleColors[vehicleId] || generateRandomColor();
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
      
      // Use the vehicle's color for a colored indicator
      const vehicleColor = vehicleColors[vehicle.id] || generateRandomColor();
      
      vehicleCard.innerHTML = `
        <div class="vehicle-id">
          <span class="color-indicator" style="background-color: ${vehicleColor}"></span>
          ${vehicle.vehicleId || 'No ID'}
        </div>
        <div class="vehicle-type">${vehicle.type || 'Unknown'}</div>
        <div class="vehicle-speed">${vehicle.speed || 0} km/h</div>
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
    const currentSpeed = vehicle.speed || 30; // Default to 30 km/h if not set
    const activeText = vehicle.status === 'active' ? 'Set Inactive' : 'Set Active';
    const vehicleColor = vehicleColors[vehicle.id] || generateRandomColor();
    
    vehicleDetails.innerHTML = `
      <div class="detail-row">
        <div class="detail-label">ID:</div>
        <div>
          <span class="color-indicator" style="background-color: ${vehicleColor}"></span>
          ${vehicle.vehicleId || 'No ID'}
        </div>
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
        <div class="detail-label">Speed:</div>
        <div>
          <input type="range" id="speed-slider" min="5" max="100" value="${currentSpeed}" />
          <span id="speed-value">${currentSpeed}</span> km/h
        </div>
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
    
    // Update button text based on current status
    updateLocationBtn.textContent = activeText;
    
    vehicleModal.style.display = 'block';
    
    // Add event listener for speed slider
    const speedSlider = document.getElementById('speed-slider');
    const speedValueDisplay = document.getElementById('speed-value');
    
    speedSlider.addEventListener('input', function() {
      speedValueDisplay.textContent = this.value;
    });
    
    speedSlider.addEventListener('change', function() {
      // Update vehicle speed
      updateVehicleSpeed(currentVehicle.id, parseInt(this.value));
    });
    
    // Center map on this vehicle
    if (vehicle.location && map) {
      map.setCenter(vehicle.location);
      map.setZoom(14);
    }
  }
  
  // Update vehicle speed
  function updateVehicleSpeed(vehicleId, speed) {
    fetch(`/api/vehicles/${vehicleId}/speed`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ speed })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update vehicle speed');
      }
      return response.json();
    })
    .then(updatedVehicle => {
      console.log('Vehicle speed updated:', updatedVehicle);
      
      // Update local vehicle data
      const index = vehicles.findIndex(v => v.id === vehicleId);
      if (index !== -1) {
        vehicles[index] = updatedVehicle;
        
        // Restart movement simulation with new speed
        if (updatedVehicle.status === 'active' && 
            updatedVehicle.startLocation && 
            updatedVehicle.endLocation) {
          setupMovementSimulation(updatedVehicle);
        }
      }
    })
    .catch(error => {
      console.error('Error updating vehicle speed:', error);
      alert('Failed to update vehicle speed: ' + error.message);
    });
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
  
  // Handle speed slider in the form
  const speedSlider = document.getElementById('speed');
  const speedDisplay = document.getElementById('speed-display');
  
  speedSlider.addEventListener('input', function() {
    speedDisplay.textContent = this.value;
  });
  
  // Add vehicle form submission
  addVehicleForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    console.log('Adding new vehicle...');
    
    const vehicleId = document.getElementById('vehicleId').value;
    const type = document.getElementById('type').value;
    const capacity = parseInt(document.getElementById('capacity').value);
    const status = document.getElementById('status').value;
    const speed = parseInt(document.getElementById('speed').value || 30); // Default to 30 km/h
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
        speed,
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
        
        // Generate and assign a unique color for the new vehicle
        vehicleColors[data.id] = generateRandomColor();
        
        addVehicleForm.reset();
        speedDisplay.textContent = "30"; // Reset speed display to default
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
    
    // Toggle vehicle status between active and inactive
    const newStatus = currentVehicle.status === 'active' ? 'inactive' : 'active';
    
    fetch(`/api/vehicles/${currentVehicle.id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: newStatus })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update vehicle status');
      }
      return response.json();
    })
    .then(updatedVehicle => {
      console.log('Vehicle status updated:', updatedVehicle);
      
      // Update UI
      vehicleModal.style.display = 'none';
      
      // If we're activating the vehicle and it has a route, start simulation
      if (newStatus === 'active' && 
          updatedVehicle.startLocation && 
          updatedVehicle.endLocation) {
        calculateAndDisplayRoute(updatedVehicle);
      } else if (newStatus === 'inactive') {
        // Stop simulation
        if (updateIntervals[updatedVehicle.id]) {
          clearInterval(updateIntervals[updatedVehicle.id]);
          delete updateIntervals[updatedVehicle.id];
        }
      }
    })
    .catch(error => {
      console.error('Error updating vehicle status:', error);
      alert('Failed to update vehicle status: ' + error.message);
    });
  });
  
  // Delete vehicle
  deleteVehicleBtn.addEventListener('click', function() {
    if (!currentVehicle) return;
    
    if (confirm(`Are you sure you want to delete vehicle ${currentVehicle.vehicleId}?`)) {
      console.log('Deleting vehicle:', currentVehicle.id);
      
      // First, clear interval if exists
      if (updateIntervals[currentVehicle.id]) {
        clearInterval(updateIntervals[currentVehicle.id]);
        delete updateIntervals[currentVehicle.id];
      }
      
      
      fetch(`/api/vehicles/${currentVehicle.id}`, {
        method: 'DELETE'
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to delete vehicle');
        }
        console.log('Vehicle deleted successfully');
        
        // Remove color assignment
        delete vehicleColors[currentVehicle.id];
        
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