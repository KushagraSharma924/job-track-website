import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const ApplyPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    resume: null,  // Store the uploaded file
  });
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const jobId = queryParams.get('jobId');  // Fetch jobId from query parameter
  
  console.log('Job ID from URL:', jobId);

  const handleFileChange = (e) => {
    setFormData({ ...formData, resume: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const submissionData = new FormData();
    submissionData.append('name', formData.name);
    submissionData.append('email', formData.email);
    submissionData.append('resume', formData.resume);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You are not authorized. Please log in.');
        return;
      }
  
      const response = await axios.post(
        `http://localhost:5001/api/applications?jobId=${jobId}`,  // Pass jobId in the query string
        submissionData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`, // Use Bearer if required
          },
        }
      );
  
      if (response.status === 201) {
        setSuccess(response.data.message);
        setError(null);
      } else {
        setError(response.data.error || 'Failed to submit application.');
        setSuccess(null);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while submitting.');
      setSuccess(null);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Apply for a Job</h2>
      
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

        <button type="submit" className="btn btn-primary">Apply</button>
      </form>

      {success && <div className="alert alert-success mt-3">{success}</div>}
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
};

export default ApplyPage;
