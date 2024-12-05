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
      ? 'http://localhost:5001/api/auth/login'
      : 'http://localhost:5001/api/auth/register';

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
        if (isLogin) {
          if (data.role === 'jobSeeker') {
            localStorage.setItem('token', data.token);
            alert('Login successful!');
            navigate('/dashboard');
          } else {
            alert('Unauthorized. Only job seekers can log in here.');
          }
        } else {
          alert('Registration successful! You can now log in.');
          toggleForm();
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
    <div className="vh-100">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <img
              src="./public/images/IIC Logo Transarent (Black) [PNG].png"
              alt="Logo"
              width="60"
              height="60"
              className="me-3"
            />
            <h4 className="mb-0">Internship Fair</h4>
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="/contact">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container-fluid vh-100 d-flex align-items-center">
        <div className="row w-100">
          {/* Left Side Section */}
          <div className="col-md-6 d-flex flex-column justify-content-center bg-light text-center image-container">
            <Typography variant="h4" gutterBottom>
              Find your dream job!
            </Typography>
            <Typography variant="body1" gutterBottom>
              Trusted by 69+ students
            </Typography>
            <div className="mt-4">
              <img src="./public/images/Screenshot 2024-12-03 at 10.43.23 PM.png" alt="Company Logos" className="full-image" />
            </div>
          </div>

          {/* Right Side Section */}
          <div className="col-md-6 d-flex flex-column justify-content-center">
            <Card className="p-4 shadow">
              <Typography variant="h5" className="text-center mb-3">
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
                />
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                  className="mt-3"
                >
                  {isLogin ? 'Login' : 'Sign Up'}
                </Button>
              </form>
              <div className="text-center mt-3">
                <Button color="secondary" onClick={toggleForm}>
                  {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
                </Button>
              </div>
              <div className="text-center mt-3">
                <Button variant="outlined" onClick={handleAdminLogin}>
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
          <img
            src="./public/images/IIC Logo Transarent (Black) [PNG].png"
            alt="Footer Logo"
            width="50"
            height="50"
            className="mb-3"
          />
          <p>&copy; {new Date().getFullYear()} Dream Jobs. All rights reserved.</p>
          <div>
            <a href="/terms" className="text-white me-3">
              Terms of Service
            </a>
            <a href="/privacy" className="text-white">
              Privacy Policy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginSignup;
