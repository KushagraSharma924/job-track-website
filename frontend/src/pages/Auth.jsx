import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, TextField, Card } from '@mui/material';
import '../styles/LoginSignup.css';

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ email: '', password: '', name: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = isLogin
      ? 'https://job-web-backend-2srf.onrender.com/api/auth/login'
      : 'https://job-web-backend-2srf.onrender.com/api/auth/register';

    const payload = isLogin
      ? { email: formData.email, password: formData.password, role: 'jobSeeker' }
      : { name: formData.name, email: formData.email, password: formData.password, role: 'jobSeeker' };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Something went wrong');
      } else {
        // Save token to localStorage
        localStorage.setItem('token', data.token);

        if (isLogin) {
          if (data.role === 'jobSeeker') {
            alert('Login successful!');
            navigate('/dashboard');
          } else {
            alert('Unauthorized. Only job seekers can log in here.');
          }
        } else {
          alert('Registration successful! Please complete your profile.');
          navigate('/details'); // Redirect to the details page for new users
        }
      }
    } catch (err) {
      alert('Network error. Please try again later.');
    }
  };

  const handleAdminLogin = () => {
    navigate('/admin?role=employer');
  };

  return (
    <div className="vh-100" style={{ backgroundColor: '#F5F5F5' }}>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-lg rounded-bottom">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <img
              src="../images/IIC Logo Transarent (Black) [PNG].png"
              alt="Logo"
              width="60"
              height="60"
              className="me-3"
            />
            <h4 className="mb-0" style={{ fontWeight: 600, color: '#333' }}>Internship Fair</h4>
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container-fluid vh-100 d-flex align-items-center">
        <div className="row w-100">
          {/* Left Side Section */}
          <div className="col-md-6 d-flex flex-column justify-content-center text-center p-5 bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-500 rounded-xl shadow-xl">
            <Typography variant="h4" gutterBottom sx={{ color: 'black', fontWeight: 'bold', fontSize: '2rem' }}>
              Find your dream job!
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ color: 'black', fontSize: '1.1rem' }}>
              Trusted by 69+ students
            </Typography>
            <div className="mt-4">
              <img
                src="../images/Screenshot 2024-12-03 at 10.43.23 PM.png"
                alt="Company Logos"
                className="full-image img-fluid"
                style={{ borderRadius: '15px', boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)' }}
              />
            </div>
          </div>

          {/* Right Side Section */}
          <div className="col-md-6 d-flex flex-column justify-content-center">
            <Card
              sx={{
                p: 4,
                borderRadius: '20px',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
                background: 'white',
                maxWidth: '450px',
                margin: 'auto',
              }}
            >
              <Typography variant="h5" className="text-center mb-3" fontWeight="bold" sx={{ fontSize: '1.5rem', color: '#333' }}>
                {isLogin ? 'Sign In' : 'Sign Up'}
              </Typography>
              <form onSubmit={handleSubmit}>
                {!isLogin && (
                  <TextField
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    required
                    sx={{
                      backgroundColor: '#f7f7f7',
                      borderRadius: '10px',
                      '& .MuiInputBase-root': {
                        borderRadius: '10px',
                      },
                    }}
                  />
                )}
                <TextField
                  label="Email Address"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  required
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
                  value={formData.password}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  required
                  sx={{
                    backgroundColor: '#f7f7f7',
                    borderRadius: '10px',
                    '& .MuiInputBase-root': {
                      borderRadius: '10px',
                    },
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                  sx={{
                    mt: 3,
                    py: 1.5,
                    borderRadius: '25px',
                    textTransform: 'none',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
                    backgroundColor: '#2d87f0',
                    '&:hover': {
                      backgroundColor: '#2c7dc0',
                    },
                  }}
                >
                  {isLogin ? 'Login' : 'Sign Up'}
                </Button>
              </form>
              <div className="text-center mt-3">
                <Button
                  onClick={toggleForm}
                  sx={{
                    textTransform: 'none',
                    backgroundColor: 'black',
                    color: 'white',
                    borderRadius: '30px',
                    px: 4,
                    py: 1.5,
                    mt: 2,
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    letterSpacing: '0.5px',
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      backgroundColor: '#4a4a4a',
                      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.5)',
                    },
                  }}
                >
                  {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
                </Button>
              </div>
              <div className="text-center mt-3">
                <Button
                  variant="outlined"
                  onClick={handleAdminLogin}
                  sx={{
                    borderColor: 'black',
                    color: 'black',
                    borderRadius: '25px',
                    px: 3,
                    py: 1,
                    mt: 1,
                    textTransform: 'none',
                    fontWeight: 'bold',
                    '&:hover': {
                      backgroundColor: 'black',
                      color: 'white',
                    },
                  }}
                >
                  Admin Login (Employer)
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-4 mt-auto">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Dream Jobs. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LoginSignup;