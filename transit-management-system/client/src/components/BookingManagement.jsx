// src/components/BookingManagement.jsx
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
  Badge,
  Divider,
  InputAdornment,
  CircularProgress,
  useTheme,
  Tab,
  Tabs
} from '@mui/material';
import {
  Add as AddIcon,
  DirectionsTransit as TransitIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  Check as CheckIcon,
  Cancel as CancelIcon,
  PersonPin as PersonPinIcon,
  DirectionsCar as CarIcon,
  BusAlert as BusAlertIcon,
  Schedule as ScheduleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  PriorityHigh as PriorityHighIcon,
  Pending as PendingIcon,
  GroupAdd as GroupAddIcon
} from '@mui/icons-material';
import { format, parseISO, isToday, isTomorrow, isYesterday, addDays } from 'date-fns';

// Mock data - replace with API calls to your backend
const mockBookings = [
  {
    _id: '1',
    userId: {
      _id: '101',
      name: 'John Smith',
      email: 'john.smith@example.com'
    },
    pickupLocation: {
      address: '123 Main St, New York, NY',
      latitude: 40.7128,
      longitude: -74.0060
    },
    dropoffLocation: {
      address: '456 Broadway, New York, NY',
      latitude: 40.7138,
      longitude: -74.0050
    },
    requestedTime: new Date(new Date().getTime() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    status: 'pending',
    assignedVehicle: null,
    specialRequirements: 'Wheelchair accessible',
    passengerCount: 1,
    createdAt: new Date().toISOString()
  },
  {
    _id: '2',
    userId: {
      _id: '102',
      name: 'Jane Doe',
      email: 'jane.doe@example.com'
    },
    pickupLocation: {
      address: '789 5th Ave, New York, NY',
      latitude: 40.7228,
      longitude: -73.9960
    },
    dropoffLocation: {
      address: '101 Park Ave, New York, NY',
      latitude: 40.7248,
      longitude: -73.9940
    },
    requestedTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(), // tomorrow
    status: 'confirmed',
    assignedVehicle: {
      _id: '201',
      vehicleId: 'BUS001',
      type: 'bus'
    },
    specialRequirements: '',
    passengerCount: 2,
    createdAt: new Date(new Date().getTime() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
  },
  {
    _id: '3',
    userId: {
      _id: '103',
      name: 'Robert Johnson',
      email: 'robert.johnson@example.com'
    },
    pickupLocation: {
      address: '555 Madison Ave, New York, NY',
      latitude: 40.7328,
      longitude: -73.9860
    },
    dropoffLocation: {
      address: '222 7th Ave, New York, NY',
      latitude: 40.7348,
      longitude: -73.9840
    },
    requestedTime: new Date(new Date().getTime() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    status: 'in-progress',
    assignedVehicle: {
      _id: '202',
      vehicleId: 'VAN002',
      type: 'van'
    },
    specialRequirements: 'Extra space for luggage',
    passengerCount: 3,
    createdAt: new Date(new Date().getTime() - 4 * 60 * 60 * 1000).toISOString() // 4 hours ago
  },
  {
    _id: '4',
    userId: {
      _id: '104',
      name: 'Sarah Williams',
      email: 'sarah.williams@example.com'
    },
    pickupLocation: {
      address: '333 Lexington Ave, New York, NY',
      latitude: 40.7428,
      longitude: -73.9760
    },
    dropoffLocation: {
      address: '444 3rd Ave, New York, NY',
      latitude: 40.7448,
      longitude: -73.9740
    },
    requestedTime: new Date(new Date().getTime() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    status: 'completed',
    assignedVehicle: {
      _id: '203',
      vehicleId: 'SPV003',
      type: 'specialized'
    },
    specialRequirements: '',
    passengerCount: 1,
    createdAt: new Date(new Date().getTime() - 5 * 60 * 60 * 1000).toISOString() // 5 hours ago
  },
  {
    _id: '5',
    userId: {
      _id: '105',
      name: 'Michael Brown',
      email: 'michael.brown@example.com'
    },
    pickupLocation: {
      address: '777 8th Ave, New York, NY',
      latitude: 40.7528,
      longitude: -73.9660
    },
    dropoffLocation: {
      address: '888 2nd Ave, New York, NY',
      latitude: 40.7548,
      longitude: -73.9640
    },
    requestedTime: new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString(), // yesterday
    status: 'cancelled',
    assignedVehicle: null,
    specialRequirements: 'Last minute cancellation',
    passengerCount: 2,
    createdAt: new Date(new Date().getTime() - 28 * 60 * 60 * 1000).toISOString() // 28 hours ago
  }
];

// Mock vehicles - replace with API calls
const mockVehicles = [
  { _id: '201', vehicleId: 'BUS001', type: 'bus', capacity: 40, status: 'active' },
  { _id: '202', vehicleId: 'VAN002', type: 'van', capacity: 15, status: 'active' },
  { _id: '203', vehicleId: 'SPV003', type: 'specialized', capacity: 8, status: 'active' },
  { _id: '204', vehicleId: 'BUS004', type: 'bus', capacity: 45, status: 'active' }
];

const BookingManagement = () => {
  const theme = useTheme();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [formData, setFormData] = useState({
    userId: '',
    pickupLocation: {
      address: '',
      latitude: '',
      longitude: ''
    },
    dropoffLocation: {
      address: '',
      latitude: '',
      longitude: ''
    },
    requestedTime: '',
    status: 'pending',
    assignedVehicle: '',
    specialRequirements: '',
    passengerCount: 1
  });

  // Fetch bookings on component mount
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setBookings(mockBookings);
      setLoading(false);
    }, 1000);
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (booking = null) => {
    if (booking) {
      setCurrentBooking(booking);
      setFormData({
        userId: booking.userId._id,
        pickupLocation: {
          address: booking.pickupLocation.address,
          latitude: booking.pickupLocation.latitude,
          longitude: booking.pickupLocation.longitude
        },
        dropoffLocation: {
          address: booking.dropoffLocation.address,
          latitude: booking.dropoffLocation.latitude,
          longitude: booking.dropoffLocation.longitude
        },
        requestedTime: format(new Date(booking.requestedTime), "yyyy-MM-dd'T'HH:mm"),
        status: booking.status,
        assignedVehicle: booking.assignedVehicle ? booking.assignedVehicle._id : '',
        specialRequirements: booking.specialRequirements || '',
        passengerCount: booking.passengerCount
      });
    } else {
      setCurrentBooking(null);
      setFormData({
        userId: '',
        pickupLocation: {
          address: '',
          latitude: '',
          longitude: ''
        },
        dropoffLocation: {
          address: '',
          latitude: '',
          longitude: ''
        },
        requestedTime: format(addDays(new Date(), 1), "yyyy-MM-dd'T'HH:mm"),
        status: 'pending',
        assignedVehicle: '',
        specialRequirements: '',
        passengerCount: 1
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested properties
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = () => {
    // Validate form
    if (!formData.pickupLocation.address || !formData.dropoffLocation.address || !formData.requestedTime) {
      alert('Please fill in all required fields');
      return;
    }

    // Simulate API call to create/update booking
    if (currentBooking) {
      // Update existing booking
      const updatedBookings = bookings.map(booking => 
        booking._id === currentBooking._id 
          ? { 
              ...booking, 
              pickupLocation: formData.pickupLocation,
              dropoffLocation: formData.dropoffLocation,
              requestedTime: new Date(formData.requestedTime).toISOString(),
              status: formData.status,
              assignedVehicle: formData.assignedVehicle 
                ? mockVehicles.find(v => v._id === formData.assignedVehicle) 
                : null,
              specialRequirements: formData.specialRequirements,
              passengerCount: formData.passengerCount
            } 
          : booking
      );
      setBookings(updatedBookings);
    } else {
      // Add new booking (in a real app, this would involve selecting a proper user ID)
      const newBooking = {
        _id: Date.now().toString(),
        userId: { 
          _id: '101',  // Demo user ID
          name: 'John Smith',  // Demo user name
          email: 'john.smith@example.com'  // Demo user email
        },
        pickupLocation: formData.pickupLocation,
        dropoffLocation: formData.dropoffLocation,
        requestedTime: new Date(formData.requestedTime).toISOString(),
        status: formData.status,
        assignedVehicle: formData.assignedVehicle 
          ? mockVehicles.find(v => v._id === formData.assignedVehicle) 
          : null,
        specialRequirements: formData.specialRequirements,
        passengerCount: formData.passengerCount,
        createdAt: new Date().toISOString()
      };
      setBookings([newBooking, ...bookings]);
    }

    handleCloseDialog();
  };

  const handleDeleteBooking = (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      // Simulate API call to delete booking
      setBookings(bookings.filter(booking => booking._id !== id));
    }
  };

  const handleUpdateStatus = (id, newStatus) => {
    // Simulate API call to update booking status
    const updatedBookings = bookings.map(booking => 
      booking._id === id 
        ? { ...booking, status: newStatus } 
        : booking
    );
    setBookings(updatedBookings);
  };

  // Filter bookings based on tab and search query
  const filteredBookings = bookings.filter(booking => {
    // First filter by tab (status)
    let statusMatch = true;
    if (tabValue === 1) statusMatch = booking.status === 'pending';
    else if (tabValue === 2) statusMatch = booking.status === 'confirmed';
    else if (tabValue === 3) statusMatch = booking.status === 'in-progress';
    else if (tabValue === 4) statusMatch = booking.status === 'completed';
    else if (tabValue === 5) statusMatch = booking.status === 'cancelled';
    
    // Then filter by search query
    const searchMatch = 
      booking.userId.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.pickupLocation.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.dropoffLocation.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (booking.assignedVehicle && booking.assignedVehicle.vehicleId.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return statusMatch && searchMatch;
  });

  // Format date in a human-readable way
  const formatDate = (dateString) => {
    try {
      const date = parseISO(dateString);
      
      if (isToday(date)) {
        return `Today at ${format(date, 'h:mm a')}`;
      } else if (isTomorrow(date)) {
        return `Tomorrow at ${format(date, 'h:mm a')}`;
      } else if (isYesterday(date)) {
        return `Yesterday at ${format(date, 'h:mm a')}`;
      } else {
        return format(date, 'MMM d, yyyy h:mm a');
      }
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Get status chip for bookings
  const getStatusChip = (status) => {
    switch (status) {
      case 'pending':
        return (
          <Chip 
            icon={<PendingIcon />} 
            label="Pending" 
            size="small" 
            color="warning"
            variant="filled"
          />
        );
      case 'confirmed':
        return (
          <Chip 
            icon={<CheckCircleIcon />} 
            label="Confirmed" 
            size="small" 
            color="info"
            variant="filled"
          />
        );
      case 'in-progress':
        return (
          <Chip 
            icon={<TimeIcon />} 
            label="In Progress" 
            size="small" 
            color="primary"
            variant="filled"
          />
        );
      case 'completed':
        return (
          <Chip 
            icon={<CheckIcon />} 
            label="Completed" 
            size="small" 
            color="success"
            variant="filled"
          />
        );
      case 'cancelled':
        return (
          <Chip 
            icon={<CancelIcon />} 
            label="Cancelled" 
            size="small" 
            color="error"
            variant="filled"
          />
        );
      default:
        return <Chip label={status} size="small" />;
    }
  };

  // Get vehicle icon based on type
  const getVehicleIcon = (type) => {
    switch (type) {
      case 'bus':
        return <TransitIcon />;
      case 'van':
        return <CarIcon />;
      case 'specialized':
        return <BusAlertIcon />;
      default:
        return <TransitIcon />;
    }
  };

  return (
    <Box sx={{ pb: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight="bold">
          Booking Management
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
          Add Booking
        </Button>
      </Box>

      <Card sx={{ mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ px: 2, pt: 2 }}
          >
            <Tab 
              label="All" 
              icon={<Badge badgeContent={bookings.length} color="primary"><TransitIcon /></Badge>} 
              iconPosition="start" 
            />
            <Tab 
              label="Pending" 
              icon={
                <Badge 
                  badgeContent={bookings.filter(b => b.status === 'pending').length} 
                  color="warning"
                >
                  <PendingIcon />
                </Badge>
              } 
              iconPosition="start" 
            />
            <Tab 
              label="Confirmed" 
              icon={
                <Badge 
                  badgeContent={bookings.filter(b => b.status === 'confirmed').length} 
                  color="info"
                >
                  <CheckCircleIcon />
                </Badge>
              } 
              iconPosition="start" 
            />
            <Tab 
              label="In Progress" 
              icon={
                <Badge 
                  badgeContent={bookings.filter(b => b.status === 'in-progress').length} 
                  color="primary"
                >
                  <TimeIcon />
                </Badge>
              } 
              iconPosition="start" 
            />
            <Tab 
              label="Completed" 
              icon={
                <Badge 
                  badgeContent={bookings.filter(b => b.status === 'completed').length} 
                  color="success"
                >
                  <CheckIcon />
                </Badge>
              } 
              iconPosition="start" 
            />
            <Tab 
              label="Cancelled" 
              icon={
                <Badge 
                  badgeContent={bookings.filter(b => b.status === 'cancelled').length} 
                  color="error"
                >
                  <CancelIcon />
                </Badge>
              } 
              iconPosition="start" 
            />
          </Tabs>
        </Box>

        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search bookings by passenger, location, or vehicle..."
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
                    <TableCell>Passenger</TableCell>
                    <TableCell>Pickup</TableCell>
                    <TableCell>Dropoff</TableCell>
                    <TableCell>Requested Time</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Vehicle</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
                      <TableRow key={booking._id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar 
                              sx={{ 
                                bgcolor: theme.palette.primary.main,
                                mr: 2,
                                width: 32,
                                height: 32
                              }}
                            >
                              <PersonIcon fontSize="small" />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {booking.userId.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {booking.passengerCount > 1 ? `${booking.passengerCount} passengers` : '1 passenger'}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                            <LocationIcon 
                              fontSize="small" 
                              color="error" 
                              sx={{ mt: 0.3, mr: 1, minWidth: 20 }} 
                            />
                            <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                              {booking.pickupLocation.address}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                            <LocationIcon 
                              fontSize="small" 
                              color="success" 
                              sx={{ mt: 0.3, mr: 1, minWidth: 20 }} 
                            />
                            <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                              {booking.dropoffLocation.address}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CalendarIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">
                              {formatDate(booking.requestedTime)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{getStatusChip(booking.status)}</TableCell>
                        <TableCell>
                          {booking.assignedVehicle ? (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {getVehicleIcon(booking.assignedVehicle.type)}
                              <Typography variant="body2" sx={{ ml: 1 }}>
                                {booking.assignedVehicle.vehicleId}
                              </Typography>
                            </Box>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              Not assigned
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Edit">
                            <IconButton onClick={() => handleOpenDialog(booking)} size="small">
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          
                          {booking.status === 'pending' && (
                            <Tooltip title="Confirm">
                              <IconButton 
                                onClick={() => handleUpdateStatus(booking._id, 'confirmed')}
                                size="small"
                                color="info"
                              >
                                <CheckCircleIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          
                          {booking.status === 'confirmed' && (
                            <Tooltip title="Start Trip">
                              <IconButton 
                                onClick={() => handleUpdateStatus(booking._id, 'in-progress')}
                                size="small"
                                color="primary"
                              >
                                <TimeIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          
                          {booking.status === 'in-progress' && (
                            <Tooltip title="Complete Trip">
                              <IconButton 
                                onClick={() => handleUpdateStatus(booking._id, 'completed')}
                                size="small"
                                color="success"
                              >
                                <CheckIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          
                          {(booking.status === 'pending' || booking.status === 'confirmed') && (
                            <Tooltip title="Cancel">
                              <IconButton 
                                onClick={() => handleUpdateStatus(booking._id, 'cancelled')}
                                size="small"
                                color="error"
                              >
                                <CancelIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          
                          <Tooltip title="Delete">
                            <IconButton 
                              onClick={() => handleDeleteBooking(booking._id)}
                              size="small"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                        <Typography variant="body1" color="text.secondary">
                          No bookings found
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

      {/* Add/Edit Booking Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {currentBooking ? 'Edit Booking' : 'Add New Booking'}
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                Passenger Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="userId"
                select
                label="Passenger"
                value={formData.userId}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                required
                disabled={currentBooking}
              >
                <MenuItem value="101">John Smith</MenuItem>
                <MenuItem value="102">Jane Doe</MenuItem>
                <MenuItem value="103">Robert Johnson</MenuItem>
                <MenuItem value="104">Sarah Williams</MenuItem>
                <MenuItem value="105">Michael Brown</MenuItem>
              </TextField>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="passengerCount"
                label="Number of Passengers"
                type="number"
                value={formData.passengerCount}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <GroupAddIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  inputProps: { min: 1, max: 45 }
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom sx={{ mt: 2 }}>
                Trip Details
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="pickupLocation.address"
                label="Pickup Location"
                value={formData.pickupLocation.address}
                onChange={handleInputChange}
                fullWidth
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationIcon color="error" fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="pickupLocation.latitude"
                label="Pickup Latitude"
                value={formData.pickupLocation.latitude}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                type="number"
                inputProps={{ step: 'any' }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="pickupLocation.longitude"
                label="Pickup Longitude"
                value={formData.pickupLocation.longitude}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                type="number"
                inputProps={{ step: 'any' }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="dropoffLocation.address"
                label="Dropoff Location"
                value={formData.dropoffLocation.address}
                onChange={handleInputChange}
                fullWidth
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationIcon color="success" fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="dropoffLocation.latitude"
                label="Dropoff Latitude"
                value={formData.dropoffLocation.latitude}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                type="number"
                inputProps={{ step: 'any' }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="dropoffLocation.longitude"
                label="Dropoff Longitude"
                value={formData.dropoffLocation.longitude}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                type="number"
                inputProps={{ step: 'any' }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="requestedTime"
                label="Requested Time"
                type="datetime-local"
                value={formData.requestedTime}
                onChange={handleInputChange}
                fullWidth
                required
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="specialRequirements"
                label="Special Requirements"
                value={formData.specialRequirements}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={1}
                variant="outlined"
                placeholder="e.g., wheelchair accessibility, extra space, etc."
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom sx={{ mt: 2 }}>
                Assignment Details
              </Typography>
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
                required
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </TextField>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="assignedVehicle"
                select
                label="Assigned Vehicle"
                value={formData.assignedVehicle}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                disabled={formData.status === 'cancelled'}
              >
                <MenuItem value="">None</MenuItem>
                {mockVehicles.map(vehicle => (
                  <MenuItem key={vehicle._id} value={vehicle._id}>
                    {vehicle.vehicleId} ({vehicle.type}, {vehicle.capacity} seats)
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
            {currentBooking ? 'Update Booking' : 'Create Booking'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookingManagement;