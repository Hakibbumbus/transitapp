// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createAppTheme } from './theme';

// Components
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import VehicleManagement from './components/VehicleManagement';
import RouteManagement from './components/RouteManagement';
import BookingManagement from './components/BookingManagement';
import UserManagement from './components/UserManagement';
import Analytics from './components/Analytics';
import MapView from './components/MapView';
import NotFound from './components/NotFound';

function App() {
  // Use localStorage to persist theme preference
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode !== null ? JSON.parse(savedMode) : true; // Default to dark mode
  });

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const theme = createAppTheme(darkMode ? 'dark' : 'light');

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Simple auth check (this should be replaced with actual auth logic)
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes within Dashboard layout */}
          <Route 
            path="/" 
            element={
              isAuthenticated() ? (
                <Dashboard toggleTheme={toggleTheme} darkMode={darkMode} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          >
            <Route index element={<MapView />} />
            <Route path="vehicles" element={<VehicleManagement />} />
            <Route path="routes" element={<RouteManagement />} />
            <Route path="bookings" element={<BookingManagement />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;