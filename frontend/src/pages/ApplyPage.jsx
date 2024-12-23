import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';

const ApplyPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    resume: null,
    year: '',
    branch: '',
  });
  const [jobDetails, setJobDetails] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false); 

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const jobId = queryParams.get('jobId');

  // Fetching job details
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`https://job-web-backend-2srf.onrender.com/api/jobs/${jobId}`);
        setJobDetails(response.data);
      } catch (err) {
        console.error('Error fetching job details:', err);
        setError('Error fetching job details');
      }
    };

    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

  const handleFileChange = (e) => {
    setFormData({ ...formData, resume: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submissionData = new FormData();
    submissionData.append('name', formData.name);
    submissionData.append('email', formData.email);
    submissionData.append('resume', formData.resume);
    submissionData.append('year', formData.year);
    submissionData.append('branch', formData.branch);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authorization token is missing. Please log in.');
        return;
      }

      setIsSubmitted(true);
      const response = await axios.post(
        `https://job-web-backend-2srf.onrender.com/api/applications?jobId=${jobId}`,
        submissionData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setSuccessMessage('Application submitted successfully!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } else {
        setError(response.data.error || 'Failed to submit application.');
      }
    } catch (err) {
      console.error('Error during submission:', err);
      setError(err.response?.data?.error || 'An unexpected error occurred.');
    } finally {
      setIsSubmitted(false);
    }
  };

  return (
    <div>
      {/* Navbar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Job Portal
          </Typography>
          <Button color="inherit" onClick={() => navigate('/')}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container className="mt-5">
        <h2>Apply for a Job</h2>
        {jobDetails ? (
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h4>{jobDetails.title}</h4>
            </div>
            <div className="card-body">
              <p><strong>Company:</strong> {jobDetails.company}</p>
              <p><strong>Location:</strong> {jobDetails.location}</p>
              <p><strong>Description:</strong> {jobDetails.description}</p>
              <p><strong>Job Requirements:</strong></p>
              <ul>
                {jobDetails.requirements?.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p>Loading job details...</p>
        )}

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="resume" className="form-label">Resume</label>
            <input
              type="file"
              className="form-control"
              id="resume"
              onChange={handleFileChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="year" className="form-label">Year</label>
            <input
              type="text"
              className="form-control"
              id="year"
              placeholder="Enter your year of study"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="branch" className="form-label">Branch</label>
            <input
              type="text"
              className="form-control"
              id="branch"
              placeholder="Enter your branch"
              value={formData.branch}
              onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={isSubmitted}>
            {isSubmitted ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>

        {error && <Alert severity="error" className="mt-4">{error}</Alert>}
        {successMessage && <Alert severity="success" className="mt-4">{successMessage}</Alert>}
      </Container>
    </div>
  );
};

export default ApplyPage;