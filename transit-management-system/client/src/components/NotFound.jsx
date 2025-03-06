// src/components/NotFound.jsx
import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper,
  useTheme
} from '@mui/material';
import { 
  SentimentDissatisfied as SadIcon,
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        padding: 3,
        background: theme.palette.background.default,
        backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }}
    >
      <Paper
        elevation={3}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: 450,
          width: '100%',
          p: 4,
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <SadIcon 
          sx={{ 
            fontSize: 80, 
            color: theme.palette.primary.main,
            mb: 2
          }} 
        />
        
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 'bold',
            textAlign: 'center' 
          }}
        >
          404
        </Typography>
        
        <Typography 
          variant="h5" 
          gutterBottom
          sx={{ 
            fontWeight: 'medium',
            textAlign: 'center',
            mb: 1
          }}
        >
          Page Not Found
        </Typography>
        
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ 
            textAlign: 'center',
            mb: 4
          }}
        >
          The page you are looking for doesn't exist or has been moved.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
          
          <Button
            variant="contained"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
          >
            Go Home
          </Button>
        </Box>
      </Paper>
      
      {/* Decorative elements */}
      <Box 
        sx={{ 
          position: 'fixed',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'linear-gradient(45deg, #3a86ff 30%, #21CBF3 90%)',
          filter: 'blur(100px)',
          opacity: '0.4',
          top: '-100px',
          left: '-100px',
          zIndex: 0
        }} 
      />
      <Box 
        sx={{ 
          position: 'fixed',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'linear-gradient(45deg, #ff006e 30%, #ffbe0b 90%)',
          filter: 'blur(120px)',
          opacity: '0.3',
          bottom: '-150px',
          right: '-150px',
          zIndex: 0
        }} 
      />
    </Box>
  );
};

export default NotFound;