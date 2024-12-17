import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Card } from '@mui/material';

const Details = () => {
  const [details, setDetails] = useState({
    firstName: '',
    lastName: '',
    college: '',
    graduationYear: '',
    year: '',
    branch: '',
  });

  const [resume, setResume] = useState(null); // Separate state for file input
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!details.graduationYear || isNaN(details.graduationYear)) {
      setErrorMessage('Please enter a valid graduation year');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('firstName', details.firstName);
      formData.append('lastName', details.lastName);
      formData.append('college', details.college);
      formData.append('graduationYear', details.graduationYear);
      formData.append('year', details.year);
      formData.append('branch', details.branch);
      if (resume) formData.append('resume', resume); // Append file only if uploaded

      const response = await fetch('https://job-web-backend-2srf.onrender.com/api/user/profile', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`, // Token for authentication
        },
        body: formData, // Form data for file upload
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || 'Failed to save details');
        return;
      }

      setSuccessMessage('Details saved successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Error saving details:', err);
      setErrorMessage('Network error. Please try again.');
    }
  };

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <Card className="p-4 shadow" style={{ width: '400px' }}>
        <Typography variant="h5" className="mb-3 text-center">
          Complete Your Profile
        </Typography>
        {errorMessage && (
          <Typography variant="body2" color="error" className="mb-2 text-center">
            {errorMessage}
          </Typography>
        )}
        {successMessage && (
          <Typography variant="body2" color="primary" className="mb-2 text-center">
            {successMessage}
          </Typography>
        )}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <TextField
            label="First Name"
            name="firstName"
            value={details.firstName}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={details.lastName}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="College"
            name="college"
            value={details.college}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Graduation Year"
            name="graduationYear"
            type="number"
            value={details.graduationYear}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Year"
            name="year"
            value={details.year}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Branch"
            name="branch"
            value={details.branch}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            style={{ margin: '15px 0' }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className="mt-3"
          >
            Save & Continue
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Details;