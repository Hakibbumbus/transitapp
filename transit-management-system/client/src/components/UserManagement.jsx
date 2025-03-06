// src/components/UserManagement.jsx
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
  FormControlLabel,
  Switch,
  InputAdornment,
  Tabs,
  Tab,
  CircularProgress,
  Badge,
  Divider,
  useTheme
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
  DirectionsBus as DriverIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Accessible as AccessibleIcon,
  SupervisorAccount as SupervisorIcon,
  DirectionsWalk as CustomerIcon,
  Key as KeyIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';

// Mock data - replace with API calls to your backend
const mockUsers = [
  {
    _id: '1',
    name: 'Admin User',
    email: 'admin@transitapp.com',
    role: 'admin',
    specializedTransitEligible: false,
    createdAt: '2023-01-15T10:30:00.000Z',
    active: true
  },
  {
    _id: '2',
    name: 'John Driver',
    email: 'john.driver@transitapp.com',
    role: 'driver',
    specializedTransitEligible: false,
    createdAt: '2023-02-10T14:20:00.000Z',
    active: true
  },
  {
    _id: '3',
    name: 'Sarah Connor',
    email: 'sarah.connor@example.com',
    role: 'customer',
    specializedTransitEligible: true,
    createdAt: '2023-03-05T09:15:00.000Z',
    active: true
  },
  {
    _id: '4',
    name: 'Robert Smith',
    email: 'robert.smith@example.com',
    role: 'customer',
    specializedTransitEligible: false,
    createdAt: '2023-03-12T11:45:00.000Z',
    active: true
  },
  {
    _id: '5',
    name: 'Jane Driver',
    email: 'jane.driver@transitapp.com',
    role: 'driver',
    specializedTransitEligible: false,
    createdAt: '2023-04-18T16:30:00.000Z',
    active: true
  },
  {
    _id: '6',
    name: 'Emily Johnson',
    email: 'emily.johnson@example.com',
    role: 'customer',
    specializedTransitEligible: true,
    createdAt: '2023-05-22T13:10:00.000Z',
    active: false
  },
  {
    _id: '7',
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    role: 'customer',
    specializedTransitEligible: false,
    createdAt: '2023-06-14T10:05:00.000Z',
    active: true
  }
];

const UserManagement = () => {
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer',
    specializedTransitEligible: false,
    active: true
  });

  // Fetch users on component mount
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (user = null) => {
    if (user) {
      setCurrentUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: '', // Don't show password
        role: user.role,
        specializedTransitEligible: user.specializedTransitEligible,
        active: user.active !== false // Default to true if not specified
      });
    } else {
      setCurrentUser(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'customer',
        specializedTransitEligible: false,
        active: true
      });
    }
    setShowPassword(false);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = () => {
    // Validate form
    if (!formData.name || !formData.email || (!currentUser && !formData.password)) {
      alert('Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Simulate API call to create/update user
    if (currentUser) {
      // Update existing user
      const updatedUsers = users.map(user => 
        user._id === currentUser._id 
          ? { 
              ...user, 
              name: formData.name,
              email: formData.email,
              role: formData.role,
              specializedTransitEligible: formData.specializedTransitEligible,
              active: formData.active
            } 
          : user
      );
      setUsers(updatedUsers);
    } else {
      // Add new user
      const newUser = {
        _id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        role: formData.role,
        specializedTransitEligible: formData.specializedTransitEligible,
        createdAt: new Date().toISOString(),
        active: formData.active
      };
      setUsers([...users, newUser]);
    }

    handleCloseDialog();
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      // Simulate API call to delete user
      setUsers(users.filter(user => user._id !== id));
    }
  };

  const handleToggleUserStatus = (id) => {
    // Simulate API call to toggle user active status
    const updatedUsers = users.map(user => 
      user._id === id 
        ? { ...user, active: !user.active } 
        : user
    );
    setUsers(updatedUsers);
  };

  // Filter users based on tab and search query
  const filteredUsers = users.filter(user => {
    // First filter by tab (role)
    let roleMatch = true;
    if (tabValue === 1) roleMatch = user.role === 'admin';
    else if (tabValue === 2) roleMatch = user.role === 'driver';
    else if (tabValue === 3) roleMatch = user.role === 'customer';
    
    // Then filter by search query
    const searchMatch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    return roleMatch && searchMatch;
  });

  // Get role icon and color
  const getRoleInfo = (role) => {
    switch (role) {
      case 'admin':
        return { 
          icon: <AdminIcon />, 
          color: theme.palette.error.main,
          label: 'Admin'
        };
      case 'driver':
        return { 
          icon: <DriverIcon />, 
          color: theme.palette.primary.main,
          label: 'Driver'
        };
      case 'customer':
        return { 
          icon: <CustomerIcon />, 
          color: theme.palette.success.main,
          label: 'Customer'
        };
      default:
        return { 
          icon: <PersonIcon />, 
          color: theme.palette.info.main,
          label: role
        };
    }
  };

  // Format date in a human-readable way
  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <Box sx={{ pb: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight="bold">
          User Management
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
          Add User
        </Button>
      </Box>

      <Card sx={{ mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            sx={{ px: 2, pt: 2 }}
          >
            <Tab 
              label="All Users" 
              icon={<Badge badgeContent={users.length} color="primary"><PersonIcon /></Badge>} 
              iconPosition="start" 
            />
            <Tab 
              label="Admins" 
              icon={
                <Badge 
                  badgeContent={users.filter(u => u.role === 'admin').length} 
                  color="error"
                >
                  <AdminIcon />
                </Badge>
              } 
              iconPosition="start" 
            />
            <Tab 
              label="Drivers" 
              icon={
                <Badge 
                  badgeContent={users.filter(u => u.role === 'driver').length} 
                  color="primary"
                >
                  <DriverIcon />
                </Badge>
              } 
              iconPosition="start" 
            />
            <Tab 
              label="Customers" 
              icon={
                <Badge 
                  badgeContent={users.filter(u => u.role === 'customer').length} 
                  color="success"
                >
                  <CustomerIcon />
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
              placeholder="Search users by name or email..."
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
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Special Access</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => {
                      const roleInfo = getRoleInfo(user.role);
                      
                      return (
                        <TableRow key={user._id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar 
                                sx={{ 
                                  bgcolor: roleInfo.color,
                                  mr: 2
                                }}
                              >
                                {roleInfo.icon}
                              </Avatar>
                              <Typography variant="body1" fontWeight="medium">
                                {user.name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <EmailIcon 
                                fontSize="small" 
                                sx={{ mr: 1, color: theme.palette.text.secondary }} 
                              />
                              <Typography variant="body2">
                                {user.email}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              icon={roleInfo.icon} 
                              label={roleInfo.label}
                              size="small"
                              sx={{ 
                                bgcolor: alpha(roleInfo.color, 0.1),
                                color: roleInfo.color,
                                borderRadius: 1,
                                '& .MuiChip-icon': {
                                  color: roleInfo.color
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell>{formatDate(user.createdAt)}</TableCell>
                          <TableCell>
                            <Chip 
                              icon={user.active ? <CheckCircleIcon /> : <BlockIcon />}
                              label={user.active ? 'Active' : 'Inactive'}
                              size="small"
                              color={user.active ? 'success' : 'default'}
                              variant={user.active ? 'filled' : 'outlined'}
                            />
                          </TableCell>
                          <TableCell>
                            {user.specializedTransitEligible ? (
                              <Chip 
                                icon={<AccessibleIcon />}
                                label="Eligible"
                                size="small"
                                color="secondary"
                                variant="outlined"
                              />
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                None
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="Edit">
                              <IconButton onClick={() => handleOpenDialog(user)} size="small">
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={user.active ? 'Deactivate' : 'Activate'}>
                              <IconButton
                                onClick={() => handleToggleUserStatus(user._id)}
                                size="small"
                                color={user.active ? 'default' : 'success'}
                              >
                                {user.active ? (
                                  <BlockIcon fontSize="small" />
                                ) : (
                                  <CheckCircleIcon fontSize="small" />
                                )}
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton 
                                onClick={() => handleDeleteUser(user._id)} 
                                size="small"
                                color="error"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                        <Typography variant="body1" color="text.secondary">
                          No users found
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

      {/* Add/Edit User Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentUser ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            {!currentUser && (
              <Grid item xs={12}>
                <TextField
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={toggleShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            )}
            {currentUser && (
              <Grid item xs={12}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    bgcolor: alpha(theme.palette.warning.light, 0.1),
                    color: theme.palette.warning.dark,
                    p: 2,
                    borderRadius: 1
                  }}
                >
                  <KeyIcon sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    Password fields are not shown for security. To reset a password, use the password reset feature.
                  </Typography>
                </Box>
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                name="role"
                select
                label="User Role"
                value={formData.role}
                onChange={handleInputChange}
                fullWidth
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SupervisorIcon />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="driver">Driver</MenuItem>
                <MenuItem value="customer">Customer</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.active}
                    onChange={handleInputChange}
                    name="active"
                    color="success"
                  />
                }
                label="Active Account"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.specializedTransitEligible}
                    onChange={handleInputChange}
                    name="specializedTransitEligible"
                    color="secondary"
                  />
                }
                label="Eligible for Specialized Transit Services"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseDialog} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            {currentUser ? 'Update User' : 'Create User'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Add alpha utility function for the component
function alpha(color, value) {
  return color.replace(')', `, ${value})`).replace('rgb', 'rgba');
}

export default UserManagement;