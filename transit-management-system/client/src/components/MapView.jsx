// src/components/MapView.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  TextField,
  MenuItem,
  Button,
  IconButton,
  Badge,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  DirectionsBus as BusIcon,
  AirportShuttle as VanIcon,
  Accessible as SpecializedIcon,
  MyLocation as LocationIcon,
  Route as RouteIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Person as DriverIcon,
  InfoOutlined as InfoIcon,
  Speed as SpeedIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';

// Placeholder for Google Maps component
// In a real implementation, you would use a library like @react-google-maps/api
const GoogleMapPlaceholder = ({ vehicles, selectedVehicle, onSelectVehicle }) => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        bgcolor: theme.palette.mode === 'dark' ? '#242f3e' : '#e5e3df',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        borderRadius: 2,
        overflow: 'hidden'
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.5 50H65.5V60H54.5V50ZM47 38.5H37V28.5H47V38.5ZM47 60.5H37V70.5H47V60.5ZM76.5 47V37H86.5V47H76.5ZM76.5 73V83H86.5V73H76.5ZM37 51.5H47V41.5H37V51.5ZM83 51.5V41.5H73V51.5H83ZM83 51.5V61.5H73V51.5H83ZM46.5 51.5H56.5V61.5H46.5V51.5ZM46.5 74.5H56.5V64.5H46.5V74.5ZM56 84.5H66V94.5H56V84.5Z' fill='%23${theme.palette.mode === 'dark' ? '3a3a3a' : 'cccccc'}' fill-opacity='0.2' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          filter: 'brightness(1.1)',
        }}
      />
      <Typography variant="h6" color="text.secondary" sx={{ zIndex: 1 }}>
        Google Maps would load here with the proper API key integration
      </Typography>
      
      {/* Fake vehicle markers */}
      {vehicles.map(vehicle => (
        <Box
          key={vehicle._id}
          sx={{
            position: 'absolute',
            top: `${Math.random() * 70 + 15}%`,
            left: `${Math.random() * 70 + 15}%`,
            zIndex: 2,
            transform: 'translate(-50%, -50%)',
            cursor: 'pointer',
            opacity: selectedVehicle?._id === vehicle._id ? 1 : 0.6,
            transition: 'all 0.3s ease'
          }}
          onClick={() => onSelectVehicle(vehicle)}
        >
          <Paper
            elevation={selectedVehicle?._id === vehicle._id ? 4 : 1}
            sx={{
              p: 0.5,
              px: 1,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              backgroundColor: selectedVehicle?._id === vehicle._id 
                ? theme.palette.primary.main 
                : theme.palette.background.paper,
              border: `2px solid ${selectedVehicle?._id === vehicle._id 
                ? theme.palette.primary.main 
                : theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[300]}`
            }}
          >
            {vehicle.type === 'bus' && <BusIcon sx={{ 
              fontSize: 20, 
              color: selectedVehicle?._id === vehicle._id ? 'white' : theme.palette.primary.main 
            }} />}
            {vehicle.type === 'van' && <VanIcon sx={{ 
              fontSize: 20, 
              color: selectedVehicle?._id === vehicle._id ? 'white' : theme.palette.info.main 
            }} />}
            {vehicle.type === 'specialized' && <SpecializedIcon sx={{ 
              fontSize: 20, 
              color: selectedVehicle?._id === vehicle._id ? 'white' : theme.palette.secondary.main
            }} />}
            <Typography 
              variant="caption" 
              sx={{ 
                fontWeight: 'bold',
                color: selectedVehicle?._id === vehicle._id ? 'white' : 'text.primary'
              }}
            >
              {vehicle.vehicleId}
            </Typography>
          </Paper>
        </Box>
      ))}
    </Box>
  );
};

// Mock data - replace with API calls
const mockVehicles = [
  {
    _id: '1',
    vehicleId: 'BUS001',
    type: 'bus',
    capacity: 40,
    status: 'active',
    currentLocation: {
      latitude: 40.7128,
      longitude: -74.0060,
      lastUpdated: new Date().toISOString()
    },
    currentRoute: { _id: '101', routeId: 'R101', name: 'Downtown Express', type: 'fixed' },
    currentDriver: { _id: '201', name: 'John Doe' },
    speed: 25,
    nextStop: 'Times Square',
    estimatedArrival: '3 min',
    passengerCount: 22
  },
  {
    _id: '2',
    vehicleId: 'VAN002',
    type: 'van',
    capacity: 15,
    status: 'maintenance',
    currentLocation: {
      latitude: 40.7138,
      longitude: -74.0065,
      lastUpdated: new Date().toISOString()
    },
    currentRoute: null,
    currentDriver: null,
    speed: 0,
    nextStop: null,
    estimatedArrival: null,
    passengerCount: 0
  },
  {
    _id: '3',
    vehicleId: 'SPV003',
    type: 'specialized',
    capacity: 8,
    status: 'active',
    currentLocation: {
      latitude: 40.7118,
      longitude: -74.0050,
      lastUpdated: new Date().toISOString()
    },
    currentRoute: { _id: '102', routeId: 'R102', name: 'Accessible Route', type: 'on-demand' },
    currentDriver: { _id: '202', name: 'Jane Smith' },
    speed: 18,
    nextStop: 'Central Park',
    estimatedArrival: '5 min',
    passengerCount: 4
  },
  {
    _id: '4',
    vehicleId: 'BUS004',
    type: 'bus',
    capacity: 45,
    status: 'active',
    currentLocation: {
      latitude: 40.7158,
      longitude: -74.0070,
      lastUpdated: new Date().toISOString()
    },
    currentRoute: { _id: '103', routeId: 'R103', name: 'North Campus Shuttle', type: 'fixed' },
    currentDriver: { _id: '203', name: 'Robert Johnson' },
    speed: 32,
    nextStop: 'Union Square',
    estimatedArrival: '1 min',
    passengerCount: 32
  },
  {
    _id: '5',
    vehicleId: 'BUS005',
    type: 'bus',
    capacity: 40,
    status: 'active',
    currentLocation: {
      latitude: 40.7148,
      longitude: -74.0040,
      lastUpdated: new Date().toISOString()
    },
    currentRoute: { _id: '104', routeId: 'R104', name: 'South Line', type: 'fixed' },
    currentDriver: { _id: '204', name: 'Emily Davis' },
    speed: 15,
    nextStop: 'Grand Central',
    estimatedArrival: '8 min',
    passengerCount: 28
  }
];

const mockRoutes = [
  { _id: '101', routeId: 'R101', name: 'Downtown Express', type: 'fixed' },
  { _id: '102', routeId: 'R102', name: 'Accessible Route', type: 'on-demand' },
  { _id: '103', routeId: 'R103', name: 'North Campus Shuttle', type: 'fixed' },
  { _id: '104', routeId: 'R104', name: 'South Line', type: 'fixed' },
  { _id: '105', routeId: 'R105', name: 'Weekend Express', type: 'specialized' }
];

const MapView = () => {
  const theme = useTheme();
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    route: 'all'
  });

  // Fetch vehicles on component mount
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setVehicles(mockVehicles);
      setFilteredVehicles(mockVehicles);
      setLoading(false);
    }, 1500);
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...vehicles];
    
    if (filters.type !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.type === filters.type);
    }
    
    if (filters.status !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.status === filters.status);
    }
    
    if (filters.route !== 'all') {
      filtered = filtered.filter(vehicle => 
        vehicle.currentRoute && vehicle.currentRoute._id === filters.route
      );
    }
    
    setFilteredVehicles(filtered);
    
    // If currently selected vehicle is filtered out, deselect it
    if (selectedVehicle && !filtered.find(v => v._id === selectedVehicle._id)) {
      setSelectedVehicle(null);
    }
  }, [filters, vehicles, selectedVehicle]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleResetFilters = () => {
    setFilters({
      type: 'all',
      status: 'all',
      route: 'all'
    });
  };

  const handleSelectVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const refreshData = useCallback(() => {
    setLoading(true);
    // Simulate API refresh
    setTimeout(() => {
      // Add some random movement to the vehicles
      const updatedVehicles = mockVehicles.map(vehicle => ({
        ...vehicle,
        currentLocation: {
          latitude: vehicle.currentLocation.latitude + (Math.random() - 0.5) * 0.005,
          longitude: vehicle.currentLocation.longitude + (Math.random() - 0.5) * 0.005,
          lastUpdated: new Date().toISOString()
        },
        speed: vehicle.status === 'active' ? Math.floor(Math.random() * 35) + 10 : 0,
        estimatedArrival: vehicle.status === 'active' ? `${Math.floor(Math.random() * 10) + 1} min` : null,
        passengerCount: vehicle.status === 'active' ? 
          Math.min(vehicle.capacity, Math.floor(Math.random() * vehicle.capacity)) : 0
      }));
      
      setVehicles(updatedVehicles);
      setLoading(false);
    }, 1000);
  }, []);

  // Get icon based on vehicle type
  const getVehicleTypeIcon = (type) => {
    switch (type) {
      case 'bus':
        return <BusIcon />;
      case 'van':
        return <VanIcon />;
      case 'specialized':
        return <SpecializedIcon />;
      default:
        return <BusIcon />;
    }
  };

  // Format date to readable string
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(date);
  };

  return (
    <Box sx={{ pb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          Live Transit Map
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Monitor and track all vehicles in real-time
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Left sidebar with filters */}
        <Grid item xs={12} md={3}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="medium">
                  Filters
                </Typography>
                <IconButton onClick={refreshData} disabled={loading}>
                  {loading ? <CircularProgress size={20} /> : <RefreshIcon />}
                </IconButton>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <TextField
                  select
                  name="type"
                  label="Vehicle Type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="bus">Bus</MenuItem>
                  <MenuItem value="van">Van</MenuItem>
                  <MenuItem value="specialized">Specialized</MenuItem>
                </TextField>
                
                <TextField
                  select
                  name="status"
                  label="Status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="maintenance">Maintenance</MenuItem>
                  <MenuItem value="out-of-service">Out of Service</MenuItem>
                </TextField>
                
                <TextField
                  select
                  name="route"
                  label="Route"
                  value={filters.route}
                  onChange={handleFilterChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                >
                  <MenuItem value="all">All Routes</MenuItem>
                  {mockRoutes.map(route => (
                    <MenuItem key={route._id} value={route._id}>
                      {route.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              
              <Button 
                variant="outlined" 
                size="small" 
                fullWidth 
                onClick={handleResetFilters}
                startIcon={<FilterIcon />}
              >
                Reset Filters
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="medium" gutterBottom>
                Vehicles
              </Typography>
              <List sx={{ '& .MuiListItem-root': { px: 1 } }}>
                {filteredVehicles.length > 0 ? (
                  filteredVehicles.map(vehicle => (
                    <React.Fragment key={vehicle._id}>
                      <ListItem 
                        button 
                        selected={selectedVehicle?._id === vehicle._id}
                        onClick={() => handleSelectVehicle(vehicle)}
                        sx={{ 
                          borderRadius: 2,
                          mb: 0.5,
                          bgcolor: selectedVehicle?._id === vehicle._id ? 
                            alpha(theme.palette.primary.main, 0.1) : 'transparent',
                          '&.Mui-selected': {
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            '&:hover': {
                              bgcolor: alpha(theme.palette.primary.main, 0.2)
                            }
                          }
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <Badge
                            color={vehicle.status === 'active' ? 'success' : 
                                  vehicle.status === 'maintenance' ? 'warning' : 'error'}
                            variant="dot"
                            anchorOrigin={{
                              vertical: 'bottom',
                              horizontal: 'right',
                            }}
                          >
                            {getVehicleTypeIcon(vehicle.type)}
                          </Badge>
                        </ListItemIcon>
                        <ListItemText 
                          primary={vehicle.vehicleId} 
                          secondary={vehicle.currentRoute?.name || 'No route assigned'} 
                          primaryTypographyProps={{ fontWeight: 'medium' }}
                        />
                      </ListItem>
                      <Divider component="li" variant="middle" />
                    </React.Fragment>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText 
                      primary="No vehicles found" 
                      secondary="Try changing the filters"
                      primaryTypographyProps={{ color: 'text.secondary' }}
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Main map area */}
        <Grid item xs={12} md={9}>
          <Card sx={{ height: 500 }}>
            <CardContent sx={{ height: '100%', position: 'relative' }}>
              {loading ? (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  height: '100%' 
                }}>
                  <CircularProgress />
                </Box>
              ) : (
                <GoogleMapPlaceholder 
                  vehicles={filteredVehicles}
                  selectedVehicle={selectedVehicle}
                  onSelectVehicle={handleSelectVehicle}
                />
              )}
            </CardContent>
          </Card>
          
          {/* Vehicle details section */}
          {selectedVehicle && (
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box 
                        sx={{ 
                          mr: 2,
                          bgcolor: 'background.paper',
                          p: 1,
                          borderRadius: '50%',
                          border: `1px solid ${theme.palette.divider}`
                        }}
                      >
                        {getVehicleTypeIcon(selectedVehicle.type)}
                      </Box>
                      <Box>
                        <Typography variant="h5" fontWeight="bold">
                          {selectedVehicle.vehicleId}
                        </Typography>
                        <Chip 
                          size="small" 
                          label={selectedVehicle.status} 
                          color={
                            selectedVehicle.status === 'active' ? 'success' :
                            selectedVehicle.status === 'maintenance' ? 'warning' : 'error'
                          }
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </Box>
                    </Box>
                    
                    <Divider sx={{ mb: 2 }} />
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Driver
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {selectedVehicle.currentDriver?.name || 'None assigned'}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Capacity
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {selectedVehicle.passengerCount} / {selectedVehicle.capacity} passengers
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Route
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {selectedVehicle.currentRoute?.name || 'None assigned'}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Route Type
                        </Typography>
                        <Typography variant="body1" fontWeight="medium" sx={{ textTransform: 'capitalize' }}>
                          {selectedVehicle.currentRoute?.type || 'N/A'}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Last Updated
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {formatDate(selectedVehicle.currentLocation.lastUpdated)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Paper 
                      variant="outlined" 
                      sx={{ 
                        p: 2, 
                        borderRadius: 2,
                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.02)',
                        mb: 2
                      }}
                    >
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        REAL-TIME INFO
                      </Typography>
                      
                      <List disablePadding>
                        <ListItem 
                          disablePadding 
                          sx={{ py: 0.5 }}
                        >
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <SpeedIcon fontSize="small" color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Current Speed" 
                            secondary={`${selectedVehicle.speed} mph`}
                            primaryTypographyProps={{ variant: 'body2' }}
                            secondaryTypographyProps={{ 
                              variant: 'body1', 
                              fontWeight: 'medium',
                              color: 'text.primary' 
                            }}
                          />
                        </ListItem>
                        
                        <ListItem 
                          disablePadding 
                          sx={{ py: 0.5 }}
                        >
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <LocationIcon fontSize="small" color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Next Stop" 
                            secondary={selectedVehicle.nextStop || 'N/A'}
                            primaryTypographyProps={{ variant: 'body2' }}
                            secondaryTypographyProps={{ 
                              variant: 'body1', 
                              fontWeight: 'medium',
                              color: 'text.primary' 
                            }}
                          />
                        </ListItem>
                        
                        <ListItem 
                          disablePadding 
                          sx={{ py: 0.5 }}
                        >
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <TimeIcon fontSize="small" color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Estimated Arrival" 
                            secondary={selectedVehicle.estimatedArrival || 'N/A'}
                            primaryTypographyProps={{ variant: 'body2' }}
                            secondaryTypographyProps={{ 
                              variant: 'body1', 
                              fontWeight: 'medium',
                              color: 'text.primary' 
                            }}
                          />
                        </ListItem>
                      </List>
                    </Paper>
                    
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button 
                        variant="outlined" 
                        fullWidth 
                        startIcon={<InfoIcon />}
                      >
                        Vehicle Details
                      </Button>
                      <Button 
                        variant="contained" 
                        fullWidth 
                        startIcon={<RouteIcon />}
                      >
                        View Route
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

// Add alpha utility function for the component
function alpha(color, value) {
  return color.replace(')', `, ${value})`).replace('rgb', 'rgba');
}

export default MapView;