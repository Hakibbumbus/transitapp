// src/components/Analytics.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  MenuItem,
  TextField,
  Button,
  CircularProgress,
  Paper,
  Divider,
  Tab,
  Tabs,
  IconButton,
  useTheme
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Person as PersonIcon,
  DirectionsBus as BusIcon,
  Route as RouteIcon,
  CalendarToday as CalendarIcon,
  DateRange as DateRangeIcon,
  Refresh as RefreshIcon,
  FileDownload as DownloadIcon,
  Map as MapIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar
} from 'recharts';

// Mock data - replace with API calls
const dailyRidershipData = [
  { date: 'Mon', count: 1200 },
  { date: 'Tue', count: 1400 },
  { date: 'Wed', count: 1500 },
  { date: 'Thu', count: 1300 },
  { date: 'Fri', count: 1800 },
  { date: 'Sat', count: 900 },
  { date: 'Sun', count: 600 }
];

const monthlyRidershipData = [
  { month: 'Jan', count: 28000 },
  { month: 'Feb', count: 25600 },
  { month: 'Mar', count: 30200 },
  { month: 'Apr', count: 28700 },
  { month: 'May', count: 32500 },
  { month: 'Jun', count: 36800 },
  { month: 'Jul', count: 35400 },
  { month: 'Aug', count: 34200 },
  { month: 'Sep', count: 31900 },
  { month: 'Oct', count: 33500 },
  { month: 'Nov', count: 29700 },
  { month: 'Dec', count: 27800 }
];

const routePopularityData = [
  { name: 'Downtown Express', passengers: 18600, color: '#3a86ff' },
  { name: 'North Campus Shuttle', passengers: 14200, color: '#ff006e' },
  { name: 'South Line', passengers: 12400, color: '#ffbe0b' },
  { name: 'Accessible Route', passengers: 6800, color: '#8338ec' },
  { name: 'Weekend Express', passengers: 5200, color: '#fb5607' }
];

const riderDemographicsData = [
  { name: 'Regular Commuters', value: 65, color: '#3a86ff' },
  { name: 'Students', value: 20, color: '#ff006e' },
  { name: 'Seniors', value: 10, color: '#ffbe0b' },
  { name: 'Specialized Services', value: 5, color: '#8338ec' }
];

const hourlyRidershipData = [
  { time: '6am', count: 350 },
  { time: '7am', count: 750 },
  { time: '8am', count: 1200 },
  { time: '9am', count: 800 },
  { time: '10am', count: 450 },
  { time: '11am', count: 400 },
  { time: '12pm', count: 550 },
  { time: '1pm', count: 600 },
  { time: '2pm', count: 450 },
  { time: '3pm', count: 550 },
  { time: '4pm', count: 950 },
  { time: '5pm', count: 1100 },
  { time: '6pm', count: 800 },
  { time: '7pm', count: 550 },
  { time: '8pm', count: 400 },
  { time: '9pm', count: 300 },
  { time: '10pm', count: 200 },
  { time: '11pm', count: 100 }
];

const vehicleUtilizationData = [
  { name: 'Bus 001', utilization: 85 },
  { name: 'Bus 002', utilization: 72 },
  { name: 'Bus 003', utilization: 90 },
  { name: 'Van 001', utilization: 65 },
  { name: 'Van 002', utilization: 78 },
  { name: 'Specialized 001', utilization: 45 }
];

const summary = {
  totalPassengers: 347800,
  avgDailyRides: 1242,
  activeVehicles: 32,
  popularRoutes: 5,
  totalBookings: 8642,
  completedBookings: 8125,
  pendingBookings: 256,
  cancelledBookings: 261
};

const Analytics = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [dateRange, setDateRange] = useState('week');
  
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleDateRangeChange = (event) => {
    setDateRange(event.target.value);
    setLoading(true);
    
    // Simulate data reloading on date range change
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  
  const handleRefresh = () => {
    setLoading(true);
    
    // Simulate data refresh
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const getChartColors = () => {
    return {
      primary: theme.palette.primary.main,
      secondary: theme.palette.secondary.main,
      info: theme.palette.info.main,
      success: theme.palette.success.main,
      warning: theme.palette.warning.main,
      error: theme.palette.error.main,
      text: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      areaColor: alpha(theme.palette.primary.main, 0.2)
    };
  };
  
  const colors = getChartColors();

  // Custom tooltip for the charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper
          elevation={3}
          sx={{
            p: 2,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Box key={`item-${index}`} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  backgroundColor: entry.color,
                  mr: 1,
                  borderRadius: '50%',
                }}
              />
              <Typography variant="body2" color="text.secondary">
                {entry.name}: {entry.value}
              </Typography>
            </Box>
          ))}
        </Paper>
      );
    }
    return null;
  };

  const renderUsageTab = () => (
    <Box>
      <Grid container spacing={3}>
        {/* Summary stats row */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PersonIcon color="primary" sx={{ mr: 1.5 }} />
                <Typography variant="h6" color="text.secondary">
                  Total Passengers
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">
                {summary.totalPassengers.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Year to date
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon color="info" sx={{ mr: 1.5 }} />
                <Typography variant="h6" color="text.secondary">
                  Daily Average
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">
                {summary.avgDailyRides.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Rides per day
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BusIcon color="success" sx={{ mr: 1.5 }} />
                <Typography variant="h6" color="text.secondary">
                  Active Vehicles
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">
                {summary.activeVehicles}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                In service today
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <RouteIcon color="secondary" sx={{ mr: 1.5 }} />
                <Typography variant="h6" color="text.secondary">
                  Popular Routes
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">
                {summary.popularRoutes}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                High-traffic routes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Ridership over time chart */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="medium">
                  Ridership Trends
                </Typography>
                <TextField
                  select
                  value={dateRange}
                  onChange={handleDateRangeChange}
                  variant="outlined"
                  size="small"
                  sx={{ minWidth: 150 }}
                >
                  <MenuItem value="week">This Week</MenuItem>
                  <MenuItem value="month">This Month</MenuItem>
                  <MenuItem value="quarter">Last Quarter</MenuItem>
                  <MenuItem value="year">This Year</MenuItem>
                </TextField>
              </Box>
              
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box sx={{ height: 350 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={dateRange === 'week' ? dailyRidershipData : monthlyRidershipData}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 20,
                        bottom: 30,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={colors.borderColor} />
                      <XAxis 
                        dataKey={dateRange === 'week' ? 'date' : 'month'} 
                        stroke={colors.text}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        stroke={colors.text}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="count" 
                        name="Passengers" 
                        stroke={colors.primary}
                        fill={colors.areaColor}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Route popularity and demographics */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="medium" gutterBottom>
                Route Popularity
              </Typography>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box sx={{ height: 350 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={routePopularityData}
                      layout="vertical"
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={colors.borderColor} />
                      <XAxis 
                        type="number" 
                        stroke={colors.text}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        stroke={colors.text}
                        tick={{ fontSize: 12 }}
                        width={120}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar 
                        dataKey="passengers" 
                        name="Passengers" 
                        radius={[0, 4, 4, 0]}
                      >
                        {routePopularityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="medium" gutterBottom>
                Rider Demographics
              </Typography>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box sx={{ height: 350 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riderDemographicsData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {riderDemographicsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Hourly distribution */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="medium" gutterBottom>
                Hourly Ridership Distribution
              </Typography>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={hourlyRidershipData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 30,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={colors.borderColor} />
                      <XAxis 
                        dataKey="time" 
                        stroke={colors.text}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        stroke={colors.text}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="count" 
                        name="Passengers" 
                        stroke={colors.info}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderPerformanceTab = () => (
    <Box>
      <Grid container spacing={3}>
        {/* Summary stats row */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <RouteIcon color="primary" sx={{ mr: 1.5 }} />
                <Typography variant="h6" color="text.secondary">
                  Total Bookings
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">
                {summary.totalBookings.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Year to date
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon color="success" sx={{ mr: 1.5 }} />
                <Typography variant="h6" color="text.secondary">
                  Completed
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">
                {summary.completedBookings.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {(summary.completedBookings / summary.totalBookings * 100).toFixed(1)}% completion rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PendingIcon color="warning" sx={{ mr: 1.5 }} />
                <Typography variant="h6" color="text.secondary">
                  Pending
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">
                {summary.pendingBookings}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Awaiting service
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CancelIcon color="error" sx={{ mr: 1.5 }} />
                <Typography variant="h6" color="text.secondary">
                  Cancelled
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">
                {summary.cancelledBookings}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {(summary.cancelledBookings / summary.totalBookings * 100).toFixed(1)}% cancellation rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Vehicle utilization chart */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="medium" gutterBottom>
                Vehicle Utilization
              </Typography>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box sx={{ height: 350 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart 
                      cx="50%" 
                      cy="50%" 
                      innerRadius="20%" 
                      outerRadius="80%" 
                      barSize={15} 
                      data={vehicleUtilizationData}
                    >
                      <RadialBar
                        minAngle={15}
                        label={{ position: 'insideStart', fill: theme.palette.mode === 'dark' ? '#fff' : '#000' }}
                        background
                        clockWise
                        dataKey="utilization"
                        name="Utilization (%)"
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend 
                        iconSize={10} 
                        layout="vertical" 
                        verticalAlign="middle" 
                        wrapperStyle={{ lineHeight: '24px' }} 
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Additional charts could be added here for the Performance tab */}
      </Grid>
    </Box>
  );

  return (
    <Box sx={{ pb: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight="bold">
          Analytics Dashboard
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            sx={{ mr: 2 }}
          >
            Export Report
          </Button>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
          >
            Refresh Data
          </Button>
        </Box>
      </Box>
      
      <Card sx={{ mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            sx={{ px: 2, pt: 2 }}
          >
            <Tab icon={<TimelineIcon />} label="Usage Analytics" iconPosition="start" />
            <Tab icon={<TrendingUpIcon />} label="Performance Metrics" iconPosition="start" />
          </Tabs>
        </Box>
        
        <CardContent>
          <Box sx={{ py: 1 }}>
            {tabValue === 0 && renderUsageTab()}
            {tabValue === 1 && renderPerformanceTab()}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

// Add missing imports and alpha utility function
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon
} from '@mui/icons-material';

// Utility function to create transparent colors
function alpha(color, value) {
  return color.replace(')', `, ${value})`).replace('rgb', 'rgba');
}

export default Analytics;