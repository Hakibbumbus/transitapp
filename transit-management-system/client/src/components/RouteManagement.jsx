// src/components/RouteManagement.jsx
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
  Switch,
  FormControl,
  InputLabel,
  Select,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  InputAdornment,
  CircularProgress,
  useTheme,
  Collapse,
  Tabs,
  Tab,
  Stack
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Map as MapIcon,
  Schedule as ScheduleIcon,
  DirectionsBus as BusIcon,
  LocationOn as LocationOnIcon,
  AddLocation as AddLocationIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Route as RouteIcon,
  AccessTime as TimeIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';

// Mock data - replace with API calls to your backend
const mockRoutes = [
  {
    _id: '101',
    routeId: 'R101',
    name: 'Downtown Express',
    description: 'Express route connecting suburban areas to downtown',
    stops: [
      {
        stopId: 'S1001',
        name: 'Central Station',
        location: { latitude: 40.7128, longitude: -74.0060 },
        arrivalTime: '08:00'
      },
      {
        stopId: 'S1002',
        name: 'City Hall',
        location: { latitude: 40.7138, longitude: -74.0050 },
        arrivalTime: '08:15'
      },
      {
        stopId: 'S1003',
        name: 'Financial District',
        location: { latitude: 40.7148, longitude: -74.0040 },
        arrivalTime: '08:30'
      },
      {
        stopId: 'S1004',
        name: 'Tech Park',
        location: { latitude: 40.7158, longitude: -74.0030 },
        arrivalTime: '08:45'
      }
    ],
    schedule: [
      { day: 'monday', startTime: '07:00', endTime: '19:00', frequency: 30 },
      { day: 'tuesday', startTime: '07:00', endTime: '19:00', frequency: 30 },
      { day: 'wednesday', startTime: '07:00', endTime: '19:00', frequency: 30 },
      { day: 'thursday', startTime: '07:00', endTime: '19:00', frequency: 30 },
      { day: 'friday', startTime: '07:00', endTime: '19:00', frequency: 30 }
    ],
    type: 'fixed'
  },
  {
    _id: '102',
    routeId: 'R102',
    name: 'Accessible Route',
    description: 'Wheelchair accessible route serving hospital and community centers',
    stops: [
      {
        stopId: 'S2001',
        name: 'Memorial Hospital',
        location: { latitude: 40.7228, longitude: -74.0160 },
        arrivalTime: '09:00'
      },
      {
        stopId: 'S2002',
        name: 'Community Center',
        location: { latitude: 40.7238, longitude: -74.0150 },
        arrivalTime: '09:20'
      },
      {
        stopId: 'S2003',
        name: 'Senior Living Facility',
        location: { latitude: 40.7248, longitude: -74.0140 },
        arrivalTime: '09:40'
      }
    ],
    schedule: [
      { day: 'monday', startTime: '09:00', endTime: '17:00', frequency: 60 },
      { day: 'wednesday', startTime: '09:00', endTime: '17:00', frequency: 60 },
      { day: 'friday', startTime: '09:00', endTime: '17:00', frequency: 60 }
    ],
    type: 'on-demand'
  },
  {
    _id: '103',
    routeId: 'R103',
    name: 'North Campus Shuttle',
    description: 'University shuttle connecting campus buildings and housing',
    stops: [
      {
        stopId: 'S3001',
        name: 'Student Center',
        location: { latitude: 40.7328, longitude: -74.0260 },
        arrivalTime: '07:30'
      },
      {
        stopId: 'S3002',
        name: 'Science Building',
        location: { latitude: 40.7338, longitude: -74.0250 },
        arrivalTime: '07:35'
      },
      {
        stopId: 'S3003',
        name: 'Library',
        location: { latitude: 40.7348, longitude: -74.0240 },
        arrivalTime: '07:40'
      },
      {
        stopId: 'S3004',
        name: 'Student Housing',
        location: { latitude: 40.7358, longitude: -74.0230 },
        arrivalTime: '07:45'
      }
    ],
    schedule: [
      { day: 'monday', startTime: '07:30', endTime: '22:00', frequency: 15 },
      { day: 'tuesday', startTime: '07:30', endTime: '22:00', frequency: 15 },
      { day: 'wednesday', startTime: '07:30', endTime: '22:00', frequency: 15 },
      { day: 'thursday', startTime: '07:30', endTime: '22:00', frequency: 15 },
      { day: 'friday', startTime: '07:30', endTime: '22:00', frequency: 15 }
    ],
    type: 'fixed'
  }
];

const RouteManagement = () => {
  const theme = useTheme();
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentRoute, setCurrentRoute] = useState(null);
  const [expandedRoute, setExpandedRoute] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    routeId: '',
    name: '',
    description: '',
    type: 'fixed',
    stops: [],
    schedule: []
  });
  const [newStop, setNewStop] = useState({
    stopId: '',
    name: '',
    location: { latitude: '', longitude: '' },
    arrivalTime: ''
  });
  const [newSchedule, setNewSchedule] = useState({
    day: 'monday',
    startTime: '',
    endTime: '',
    frequency: 30
  });

  // Fetch routes on component mount
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRoutes(mockRoutes);
      setLoading(false);
    }, 1000);
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (route = null) => {
    if (route) {
      setCurrentRoute(route);
      setFormData({
        routeId: route.routeId,
        name: route.name,
        description: route.description || '',
        type: route.type,
        stops: [...route.stops],
        schedule: [...route.schedule]
      });
    } else {
      setCurrentRoute(null);
      setFormData({
        routeId: '',
        name: '',
        description: '',
        type: 'fixed',
        stops: [],
        schedule: []
      });
    }
    setTabValue(0);
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

  const handleStopInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('location.')) {
      const locationField = name.split('.')[1];
      setNewStop({
        ...newStop,
        location: {
          ...newStop.location,
          [locationField]: value
        }
      });
    } else {
      setNewStop({
        ...newStop,
        [name]: value
      });
    }
  };

  const handleScheduleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSchedule({
      ...newSchedule,
      [name]: value
    });
  };

  const handleAddStop = () => {
    // Validate stop
    if (!newStop.stopId || !newStop.name || !newStop.location.latitude || !newStop.location.longitude) {
      alert('Please fill all stop fields');
      return;
    }

    setFormData({
      ...formData,
      stops: [...formData.stops, newStop]
    });

    // Reset new stop form
    setNewStop({
      stopId: '',
      name: '',
      location: { latitude: '', longitude: '' },
      arrivalTime: ''
    });
  };

  const handleRemoveStop = (stopId) => {
    setFormData({
      ...formData,
      stops: formData.stops.filter(stop => stop.stopId !== stopId)
    });
  };

  const handleAddSchedule = () => {
    // Validate schedule
    if (!newSchedule.startTime || !newSchedule.endTime || !newSchedule.frequency) {
      alert('Please fill all schedule fields');
      return;
    }

    setFormData({
      ...formData,
      schedule: [...formData.schedule, newSchedule]
    });

    // Reset new schedule form
    setNewSchedule({
      day: 'monday',
      startTime: '',
      endTime: '',
      frequency: 30
    });
  };

  const handleRemoveSchedule = (index) => {
    const newSchedule = [...formData.schedule];
    newSchedule.splice(index, 1);
    setFormData({
      ...formData,
      schedule: newSchedule
    });
  };

  const handleSubmit = () => {
    // Validate form
    if (!formData.routeId || !formData.name) {
      alert('Please fill in required fields');
      return;
    }

    // Validate that there's at least one stop
    if (formData.stops.length === 0) {
      alert('Please add at least one stop');
      return;
    }

    // Simulate API call to create/update route
    if (currentRoute) {
      // Update existing route
      const updatedRoutes = routes.map(route => 
        route._id === currentRoute._id ? { ...route, ...formData } : route
      );
      setRoutes(updatedRoutes);
    } else {
      // Add new route
      const newRoute = {
        _id: Date.now().toString(),
        ...formData
      };
      setRoutes([...routes, newRoute]);
    }

    handleCloseDialog();
  };

  const handleDeleteRoute = (id) => {
    if (window.confirm('Are you sure you want to delete this route?')) {
      // Simulate API call to delete route
      setRoutes(routes.filter(route => route._id !== id));
    }
  };

  const handleExpandRoute = (id) => {
    setExpandedRoute(expandedRoute === id ? null : id);
  };

  // Filter routes based on search query
  const filteredRoutes = routes.filter(route => 
    route.routeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format time in 12-hour format
  const formatTime = (time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Get color for route type
  const getRouteTypeColor = (type) => {
    switch (type) {
      case 'fixed':
        return theme.palette.primary.main;
      case 'on-demand':
        return theme.palette.secondary.main;
      case 'specialized':
        return theme.palette.warning.main;
      default:
        return theme.palette.info.main;
    }
  };

  // Get chip for route type
  const getRouteTypeChip = (type) => {
    return (
      <Chip 
        label={type} 
        size="small" 
        sx={{ 
          bgcolor: alpha(getRouteTypeColor(type), 0.1),
          color: getRouteTypeColor(type),
          border: `1px solid ${alpha(getRouteTypeColor(type), 0.3)}`,
          textTransform: 'capitalize'
        }}
      />
    );
  };

  return (
    <Box sx={{ pb: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight="bold">
          Route Management
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
          Add Route
        </Button>
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search routes by ID, name, or description..."
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

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Route ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Stops</TableCell>
                    <TableCell>Service Days</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRoutes.length > 0 ? (
                    filteredRoutes.map((route) => (
                      <React.Fragment key={route._id}>
                        <TableRow hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <IconButton 
                                size="small" 
                                onClick={() => handleExpandRoute(route._id)}
                                sx={{ mr: 1 }}
                              >
                                {expandedRoute === route._id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                              </IconButton>
                              <Typography variant="body1" fontWeight="medium">
                                {route.routeId}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>{route.name}</TableCell>
                          <TableCell>{getRouteTypeChip(route.type)}</TableCell>
                          <TableCell>{route.stops.length} stops</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
                                const hasDay = route.schedule.some(s => s.day === day);
                                return (
                                  <Chip 
                                    key={day} 
                                    label={day.charAt(0).toUpperCase()} 
                                    size="small"
                                    variant={hasDay ? "filled" : "outlined"}
                                    sx={{ 
                                      height: 24, 
                                      minWidth: 24, 
                                      fontSize: '0.7rem',
                                      bgcolor: hasDay ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                                      color: hasDay ? theme.palette.primary.main : theme.palette.text.disabled,
                                      border: hasDay ? `1px solid ${alpha(theme.palette.primary.main, 0.3)}` : `1px solid ${theme.palette.divider}`
                                    }}
                                  />
                                );
                              })}
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="Edit">
                              <IconButton onClick={() => handleOpenDialog(route)} size="small">
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton 
                                onClick={() => handleDeleteRoute(route._id)} 
                                size="small"
                                color="error"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="View on map">
                              <IconButton size="small" color="primary">
                                <MapIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                        
                        {/* Expanded row for route details */}
                        <TableRow>
                          <TableCell 
                            colSpan={6} 
                            sx={{ 
                              py: 0,
                              bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.02)'
                            }}
                          >
                            <Collapse in={expandedRoute === route._id} timeout="auto" unmountOnExit>
                              <Box sx={{ p: 3 }}>
                                <Grid container spacing={4}>
                                  {/* Route description */}
                                  <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                      DESCRIPTION
                                    </Typography>
                                    <Typography variant="body1">
                                      {route.description || 'No description provided'}
                                    </Typography>
                                  </Grid>
                                  
                                  {/* Stops list */}
                                  <Grid item xs={12} md={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                      <LocationOnIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                                      <Typography variant="subtitle2" color="text.secondary">
                                        STOPS
                                      </Typography>
                                    </Box>
                                    <List dense>
                                      {route.stops.map((stop, index) => (
                                        <React.Fragment key={stop.stopId}>
                                          <ListItem sx={{ py: 1 }}>
                                            <ListItemIcon sx={{ minWidth: 32 }}>
                                              <Typography 
                                                variant="body2" 
                                                sx={{ 
                                                  minWidth: 24, 
                                                  height: 24, 
                                                  borderRadius: '50%', 
                                                  bgcolor: theme.palette.primary.main,
                                                  color: '#fff',
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  justifyContent: 'center'
                                                }}
                                              >
                                                {index + 1}
                                              </Typography>
                                            </ListItemIcon>
                                            <ListItemText 
                                              primary={stop.name} 
                                              secondary={`ID: ${stop.stopId} | Arrival: ${formatTime(stop.arrivalTime) || 'N/A'}`} 
                                            />
                                          </ListItem>
                                          {index < route.stops.length - 1 && (
                                            <Box 
                                              sx={{ 
                                                height: 20, 
                                                width: 1, 
                                                bgcolor: theme.palette.primary.main,
                                                ml: 4
                                              }} 
                                            />
                                          )}
                                        </React.Fragment>
                                      ))}
                                    </List>
                                  </Grid>
                                  
                                  {/* Schedule */}
                                  <Grid item xs={12} md={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                      <ScheduleIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                                      <Typography variant="subtitle2" color="text.secondary">
                                        SCHEDULE
                                      </Typography>
                                    </Box>
                                    <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 240 }}>
                                      <Table size="small">
                                        <TableHead>
                                          <TableRow>
                                            <TableCell>Day</TableCell>
                                            <TableCell>Start Time</TableCell>
                                            <TableCell>End Time</TableCell>
                                            <TableCell>Frequency</TableCell>
                                          </TableRow>
                                        </TableHead>
                                        <TableBody>
                                          {route.schedule.map((schedule, index) => (
                                            <TableRow key={index}>
                                              <TableCell sx={{ textTransform: 'capitalize' }}>
                                                {schedule.day}
                                              </TableCell>
                                              <TableCell>{formatTime(schedule.startTime)}</TableCell>
                                              <TableCell>{formatTime(schedule.endTime)}</TableCell>
                                              <TableCell>{schedule.frequency} mins</TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                    </TableContainer>
                                  </Grid>
                                </Grid>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                        <Typography variant="body1" color="text.secondary">
                          No routes found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Route Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {currentRoute ? 'Edit Route' : 'Add New Route'}
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab label="Basic Info" icon={<RouteIcon />} iconPosition="start" />
            <Tab label="Stops" icon={<LocationOnIcon />} iconPosition="start" />
            <Tab label="Schedule" icon={<TimeIcon />} iconPosition="start" />
          </Tabs>
          
          {/* Basic Info Tab */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="routeId"
                  label="Route ID"
                  value={formData.routeId}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="name"
                  label="Route Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  fullWidth
                  multiline
                  rows={3}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="type"
                  select
                  label="Route Type"
                  value={formData.type}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                >
                  <MenuItem value="fixed">Fixed</MenuItem>
                  <MenuItem value="on-demand">On-Demand</MenuItem>
                  <MenuItem value="specialized">Specialized</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </TabPanel>
          
          {/* Stops Tab */}
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Current Stops
                </Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Stop ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Latitude</TableCell>
                        <TableCell>Longitude</TableCell>
                        <TableCell>Arrival Time</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formData.stops.length > 0 ? (
                        formData.stops.map((stop, index) => (
                          <TableRow key={stop.stopId}>
                            <TableCell>{stop.stopId}</TableCell>
                            <TableCell>{stop.name}</TableCell>
                            <TableCell>{stop.location.latitude}</TableCell>
                            <TableCell>{stop.location.longitude}</TableCell>
                            <TableCell>{stop.arrivalTime || 'N/A'}</TableCell>
                            <TableCell align="right">
                              <IconButton 
                                size="small" 
                                color="error" 
                                onClick={() => handleRemoveStop(stop.stopId)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} align="center">
                            No stops added yet
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Add New Stop
                </Typography>
                <Paper variant="outlined" sx={{ p: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="stopId"
                        label="Stop ID"
                        value={newStop.stopId}
                        onChange={handleStopInputChange}
                        fullWidth
                        required
                        variant="outlined"
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="name"
                        label="Stop Name"
                        value={newStop.name}
                        onChange={handleStopInputChange}
                        fullWidth
                        required
                        variant="outlined"
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        name="location.latitude"
                        label="Latitude"
                        value={newStop.location.latitude}
                        onChange={handleStopInputChange}
                        fullWidth
                        required
                        variant="outlined"
                        size="small"
                        type="number"
                        inputProps={{ step: 'any' }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        name="location.longitude"
                        label="Longitude"
                        value={newStop.location.longitude}
                        onChange={handleStopInputChange}
                        fullWidth
                        required
                        variant="outlined"
                        size="small"
                        type="number"
                        inputProps={{ step: 'any' }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        name="arrivalTime"
                        label="Arrival Time (HH:MM)"
                        value={newStop.arrivalTime}
                        onChange={handleStopInputChange}
                        fullWidth
                        variant="outlined"
                        size="small"
                        placeholder="e.g. 08:30"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddLocationIcon />}
                        onClick={handleAddStop}
                        sx={{ mt: 1 }}
                      >
                        Add Stop
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>
          
          {/* Schedule Tab */}
          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Current Schedule
                </Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Day</TableCell>
                        <TableCell>Start Time</TableCell>
                        <TableCell>End Time</TableCell>
                        <TableCell>Frequency (mins)</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formData.schedule.length > 0 ? (
                        formData.schedule.map((schedule, index) => (
                          <TableRow key={index}>
                            <TableCell sx={{ textTransform: 'capitalize' }}>{schedule.day}</TableCell>
                            <TableCell>{schedule.startTime}</TableCell>
                            <TableCell>{schedule.endTime}</TableCell>
                            <TableCell>{schedule.frequency}</TableCell>
                            <TableCell align="right">
                              <IconButton 
                                size="small" 
                                color="error" 
                                onClick={() => handleRemoveSchedule(index)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            No schedule added yet
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Add Schedule
                </Typography>
                <Paper variant="outlined" sx={{ p: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="day"
                        select
                        label="Day"
                        value={newSchedule.day}
                        onChange={handleScheduleInputChange}
                        fullWidth
                        required
                        variant="outlined"
                        size="small"
                      >
                        <MenuItem value="monday">Monday</MenuItem>
                        <MenuItem value="tuesday">Tuesday</MenuItem>
                        <MenuItem value="wednesday">Wednesday</MenuItem>
                        <MenuItem value="thursday">Thursday</MenuItem>
                        <MenuItem value="friday">Friday</MenuItem>
                        <MenuItem value="saturday">Saturday</MenuItem>
                        <MenuItem value="sunday">Sunday</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="frequency"
                        label="Frequency (minutes)"
                        value={newSchedule.frequency}
                        onChange={handleScheduleInputChange}
                        fullWidth
                        required
                        variant="outlined"
                        size="small"
                        type="number"
                        inputProps={{ min: 1 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="startTime"
                        label="Start Time (HH:MM)"
                        value={newSchedule.startTime}
                        onChange={handleScheduleInputChange}
                        fullWidth
                        required
                        variant="outlined"
                        size="small"
                        placeholder="e.g. 07:00"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="endTime"
                        label="End Time (HH:MM)"
                        value={newSchedule.endTime}
                        onChange={handleScheduleInputChange}
                        fullWidth
                        required
                        variant="outlined"
                        size="small"
                        placeholder="e.g. 19:00"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<ScheduleIcon />}
                        onClick={handleAddSchedule}
                        sx={{ mt: 1 }}
                      >
                        Add Schedule
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseDialog} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            {currentRoute ? 'Update Route' : 'Create Route'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// TabPanel component for the dialog tabs
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`route-tabpanel-${index}`}
      aria-labelledby={`route-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Add alpha utility function for the component
function alpha(color, value) {
  return color.replace(')', `, ${value})`).replace('rgb', 'rgba');
}

export default RouteManagement;