// src/components/VehicleManagement.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  MenuItem,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Tooltip,
  Divider,
  InputAdornment,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  DirectionsBus as BusIcon,
  AirportShuttle as VanIcon,
  Accessible as SpecializedIcon,
  CheckCircle as ActiveIcon,
  Warning as MaintenanceIcon,
  Cancel as OutOfServiceIcon,
  Person as DriverIcon,
  Route as RouteIcon,
  MyLocation as LocationIcon
} from '@mui/icons-material';

// Mock data - replace with API calls to your backend
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
    currentRoute: { _id: '101', routeId: 'R101', name: 'Downtown Express' },
    currentDriver: { _id: '201', name: 'John Doe' }
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
    currentDriver: null
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
    currentRoute: { _id: '102', routeId: 'R102', name: 'Accessible Route' },
    currentDriver: { _id: '202', name: 'Jane Smith' }
  },
  {
    _id: '4',
    vehicleId: 'BUS004',
    type: 'bus',
    capacity: 45,
    status: 'out-of-service',
    currentLocation: {
      latitude: 40.7158,
      longitude: -74.0070,
      lastUpdated: new Date().toISOString()
    },
    currentRoute: null,
    currentDriver: null
  }
];

// Mock drivers and routes - replace with API calls
const mockDrivers = [
  { _id: '201', name: 'John Doe' },
  { _id: '202', name: 'Jane Smith' },
  { _id: '203', name: 'Robert Johnson' },
  { _id: '204', name: 'Emily Davis' }
];

const mockRoutes = [
  { _id: '101', routeId: 'R101', name: 'Downtown Express' },
  { _id: '102', routeId: 'R102', name: 'Accessible Route' },
  { _id: '103', routeId: 'R103', name: 'North Campus Shuttle' },
  { _id: '104', routeId: 'R104', name: 'South Line' }
];

const VehicleManagement = () => {
  const theme = useTheme();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState(null);
  const [formData, setFormData] = useState({
    vehicleId: '',
    type: 'bus',
    capacity: '',
    status: 'active',
    currentDriver: '',
    currentRoute: ''
  });

  // Fetch vehicles on component mount
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setVehicles(mockVehicles);
      setLoading(false);
    }, 1000);
  }, []);

  const handleOpenDialog = (vehicle = null) => {
    if (vehicle) {
      setCurrentVehicle(vehicle);
      setFormData({
        vehicleId: vehicle.vehicleId,
        type: vehicle.type,
        capacity: vehicle.capacity,
        status: vehicle.status,
        currentDriver: vehicle.currentDriver ? vehicle.currentDriver._id : '',
        currentRoute: vehicle.currentRoute ? vehicle.currentRoute._id : ''
      });
    } else {
      setCurrentVehicle(null);
      setFormData({
        vehicleId: '',
        type: 'bus',
        capacity: '',
        status: 'active',
        currentDriver: '',
        currentRoute: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = () => {
    // Validate form
    if (!formData.vehicleId || !formData.capacity) {
      alert('Please fill in all required fields');
      return;
    }

    // Simulate API call to create/update vehicle
    if (currentVehicle) {
      // Update existing vehicle
      const updatedVehicles = vehicles.map(vehicle => 
        vehicle._id === currentVehicle._id 
          ? { 
              ...vehicle, 
              ...formData,
              currentDriver: formData.currentDriver 
                ? mockDrivers.find(d => d._id === formData.currentDriver) 
                : null,
              currentRoute: formData.currentRoute 
                ? mockRoutes.find(r => r._id === formData.currentRoute) 
                : null
            } 
          : vehicle
      );
      setVehicles(updatedVehicles);
    } else {
      // Add new vehicle
      const newVehicle = {
        _id: Date.now().toString(),
        ...formData,
        currentLocation: {
          latitude: 0,
          longitude: 0,
          lastUpdated: new Date().toISOString()
        },
        currentDriver: formData.currentDriver 
          ? mockDrivers.find(d => d._id === formData.currentDriver) 
          : null,
        currentRoute: formData.currentRoute 
          ? mockRoutes.find(r => r._id === formData.currentRoute) 
          : null
      };
      setVehicles([...vehicles, newVehicle]);
    }

    handleCloseDialog();
  };

  const handleDeleteVehicle = (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      // Simulate API call to delete vehicle
      setVehicles(vehicles.filter(vehicle => vehicle._id !== id));
    }
  };

  // Filter vehicles based on search query
  const filteredVehicles = vehicles.filter(vehicle => 
    vehicle.vehicleId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (vehicle.currentDriver && vehicle.currentDriver.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (vehicle.currentRoute && vehicle.currentRoute.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Helper function to get status chip color
  const getStatusChip = (status) => {
    switch (status) {
      case 'active':
        return (
          <Chip 
            icon={<ActiveIcon />} 
            label="Active" 
            color="success" 
            size="small" 
            variant="outlined"
          />
        );
      case 'maintenance':
        return (
          <Chip 
            icon={<MaintenanceIcon />} 
            label="Maintenance" 
            color="warning" 
            size="small" 
            variant="outlined"
          />
        );
      case 'out-of-service':
        return (
          <Chip 
            icon={<OutOfServiceIcon />} 
            label="Out of Service" 
            color="error" 
            size="small" 
            variant="outlined"
          />
        );
      default:
        return <Chip label={status} />;
    }
  };

  // Helper function to get vehicle type icon
  const getVehicleTypeIcon = (type) => {
    switch (type) {
      case 'bus':
        return <BusIcon sx={{ color: theme.palette.primary.main }} />;
      case 'van':
        return <VanIcon sx={{ color: theme.palette.info.main }} />;
      case 'specialized':
        return <SpecializedIcon sx={{ color: theme.palette.secondary.main }} />;
      default:
        return <BusIcon />;
    }
  };

  return (
    <Box sx={{ pb: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight="bold">
          Vehicle Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ 
            borderRadius: '8px',
            px: 3
          }}
        >
          Add Vehicle
        </Button>
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search vehicles by ID, type, driver, or route..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mr: 2 }}
            />
            <Tooltip title="Refresh">
              <IconButton onClick={() => setLoading(true)}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <TableContainer component={Paper} elevation={0}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Vehicle ID</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Capacity</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Current Driver</TableCell>
                    <TableCell>Current Route</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredVehicles.length > 0 ? (
                    filteredVehicles.map((vehicle) => (
                      <TableRow key={vehicle._id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar 
                              variant="rounded" 
                              sx={{ 
                                bgcolor: 'background.paper', 
                                mr: 2,
                                border: `1px solid ${theme.palette.divider}`
                              }}
                            >
                              {getVehicleTypeIcon(vehicle.type)}
                            </Avatar>
                            <Typography variant="body1" fontWeight="medium">
                              {vehicle.vehicleId}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ textTransform: 'capitalize' }}>{vehicle.type}</TableCell>
                        <TableCell>{vehicle.capacity}</TableCell>
                        <TableCell>{getStatusChip(vehicle.status)}</TableCell>
                        <TableCell>
                          {vehicle.currentDriver ? (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <DriverIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body2">{vehicle.currentDriver.name}</Typography>
                            </Box>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              None assigned
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          {vehicle.currentRoute ? (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <RouteIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body2">{vehicle.currentRoute.name}</Typography>
                            </Box>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              None assigned
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Edit">
                            <IconButton onClick={() => handleOpenDialog(vehicle)} size="small">
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton 
                              onClick={() => handleDeleteVehicle(vehicle._id)} 
                              size="small"
                              color="error"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="View location">
                            <IconButton size="small" color="primary">
                              <LocationIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                        <Typography variant="body1" color="text.secondary">
                          No vehicles found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add/Edit Vehicle Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="vehicleId"
                label="Vehicle ID"
                value={formData.vehicleId}
                onChange={handleInputChange}
                fullWidth
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="type"
                select
                label="Vehicle Type"
                value={formData.type}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
              >
                <MenuItem value="bus">Bus</MenuItem>
                <MenuItem value="van">Van</MenuItem>
                <MenuItem value="specialized">Specialized</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="capacity"
                label="Capacity"
                type="number"
                value={formData.capacity}
                onChange={handleInputChange}
                fullWidth
                required
                variant="outlined"
                InputProps={{
                  inputProps: { min: 1 }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="status"
                select
                label="Status"
                value={formData.status}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="maintenance">Maintenance</MenuItem>
                <MenuItem value="out-of-service">Out of Service</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="currentDriver"
                select
                label="Current Driver"
                value={formData.currentDriver}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
              >
                <MenuItem value="">None</MenuItem>
                {mockDrivers.map(driver => (
                  <MenuItem key={driver._id} value={driver._id}>
                    {driver.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="currentRoute"
                select
                label="Current Route"
                value={formData.currentRoute}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
              >
                <MenuItem value="">None</MenuItem>
                {mockRoutes.map(route => (
                  <MenuItem key={route._id} value={route._id}>
                    {route.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseDialog} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            {currentVehicle ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VehicleManagement;