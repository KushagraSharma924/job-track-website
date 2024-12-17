import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Box,
  Grid,
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';

const AdminLoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e, type) => {
    const { name, value } = e.target;
    if (type === 'login') {
      setFormData({ ...formData, [name]: value });
    } else {
      setSignupData({ ...signupData, [name]: value });
    }
  };

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    const payload = {
      email: formData.email,
      password: formData.password,
      role: 'employer',
    };

    try {
      const response = await fetch('https://job-web-backend-2srf.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Something went wrong');
      } else {
        if (data.role === 'employer') {
          localStorage.setItem('token', data.token);
          alert('Login successful!');
          navigate('/admin-dashboard');
        } else {
          setError('Unauthorized access. Only employers can log in here.');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please try again later.');
    }
  };

  const handleSubmitSignup = async (e) => {
    e.preventDefault();
    const payload = {
      email: signupData.email,
      password: signupData.password,
      role: 'employer',
    };

    try {
      const response = await fetch('https://job-web-backend-2srf.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Something went wrong');
      } else {
        alert('Signup successful! You can now log in.');
        setIsSignup(false);
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Network error. Please try again later.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'row',
        bgcolor: '#f4f6f8',
      }}
    >
      {/* Left Section */}
      <Box
        sx={{
          flex: 1,
          backgroundColor: '#1a237e',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          px: 4,
        }}
      >
        <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
          Welcome Back!
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, maxWidth: 400, textAlign: 'center' }}>
          Manage job postings, hire talented candidates, and grow your team with ease.
        </Typography>
        <Box
          component="img"
          src="/images/Screenshot 2024-12-03 at 10.43.23 PM.png"
          alt="Admin Portal"
          sx={{ width: '80%', maxWidth: 400 }}
        />
      </Box>

      {/* Right Section */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          px: 4,
        }}
      >
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={8} md={6}>
            <Card
              sx={{
                borderRadius: '15px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                bgcolor: 'white',
              }}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  color="primary"
                  align="center"
                  sx={{ mb: 2, fontWeight: 'bold' }}
                >
                  {isSignup ? 'Sign Up as Employer' : 'Login to Admin Portal'}
                </Typography>
                <form onSubmit={isSignup ? handleSubmitSignup : handleSubmitLogin}>
                  <TextField
                    label="Email Address"
                    name="email"
                    value={isSignup ? signupData.email : formData.email}
                    onChange={(e) => handleInputChange(e, isSignup ? 'signup' : 'login')}
                    fullWidth
                    margin="normal"
                    required
                    variant="outlined"
                    sx={{
                      backgroundColor: '#f7f7f7',
                      borderRadius: '10px',
                      '& .MuiInputBase-root': {
                        borderRadius: '10px',
                      },
                    }}
                  />
                  <TextField
                    label="Password"
                    type="password"
                    name="password"
                    value={isSignup ? signupData.password : formData.password}
                    onChange={(e) => handleInputChange(e, isSignup ? 'signup' : 'login')}
                    fullWidth
                    margin="normal"
                    required
                    variant="outlined"
                    sx={{
                      backgroundColor: '#f7f7f7',
                      borderRadius: '10px',
                      '& .MuiInputBase-root': {
                        borderRadius: '10px',
                      },
                    }}
                  />
                  {error && (
                    <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                      {error}
                    </Typography>
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    fullWidth
                    startIcon={isSignup ? <PersonAddAltIcon /> : <LoginIcon />}
                    sx={{
                      mt: 3,
                      py: 1.5,
                      textTransform: 'none',
                      fontWeight: 'bold',
                      borderRadius: '25px',
                      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
                      backgroundColor: '#2d87f0',
                      '&:hover': {
                        backgroundColor: '#2c7dc0',
                      },
                    }}
                  >
                    {isSignup ? 'Sign Up' : 'Login'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AdminLoginPage;