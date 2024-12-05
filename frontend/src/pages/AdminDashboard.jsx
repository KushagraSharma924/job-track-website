import React, { useState, useEffect } from 'react';
import axios from 'axios';
import  { jwtDecode } from 'jwt-decode'; // Corrected import
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    location: '',
    salary: '',
    jobType: 'Full-time',
    requirements: '',
    companyEmail: '',
    company: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEmployer, setIsEmployer] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token); 
        console.log('Decoded Token:', decodedToken); 
        
        const userRole = decodedToken?.role; 
        const userid = decodedToken?.id;

        // Check user role
        if (userRole === 'admin') {
          setIsAdmin(true);
        } else if (userRole === 'employer') {
          setIsEmployer(true);
        }

        // Navigate if the email matches the admin's email
        if (userid === '675061c32dca8d4790786190') {
          console.log('Navigating to /download for admin email');
          navigate('/download');
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    } else {
      console.warn('No token found in localStorage');
    }
  }, [navigate]);

  const handleJobChange = (e) => {
    setNewJob({ ...newJob, [e.target.name]: e.target.value });
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found.');

      const response = await axios.post(
        'http://localhost:5001/api/jobs',
        {
          ...newJob,
          requirements: newJob.requirements.split(',').map((req) => req.trim()),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        setSuccess('Job posted successfully!');
        setNewJob({
          title: '',
          description: '',
          location: '',
          salary: '',
          jobType: 'Full-time',
          requirements: '',
          companyEmail: '',
          company: '',
        });
        setError('');
      }
    } catch (error) {
      console.error('Error posting job:', error);
      setError('Failed to post job.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/admin?role=employer';
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand" href="/">Admin Dashboard</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <button className="btn btn-danger nav-link text-white" onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mt-5">
        <h2 className="text-center mb-4">Admin Dashboard</h2>

        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Show Job Posting Form for Admins or Employers */}
        {(isAdmin || isEmployer) && (
          <form onSubmit={handlePostJob} className="card p-4 shadow-sm mb-5">
            <h3>Post a New Job</h3>
            {/* Job Title */}
            <div className="mb-3">
              <label className="form-label">Job Title</label>
              <input
                type="text"
                className="form-control"
                name="title"
                value={newJob.title}
                onChange={handleJobChange}
                required
              />
            </div>
            {/* Description */}
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                name="description"
                value={newJob.description}
                onChange={handleJobChange}
                required
              ></textarea>
            </div>
            {/* Location */}
            <div className="mb-3">
              <label className="form-label">Location</label>
              <input
                type="text"
                className="form-control"
                name="location"
                value={newJob.location}
                onChange={handleJobChange}
                required
              />
            </div>
            {/* Salary */}
            <div className="mb-3">
              <label className="form-label">Salary</label>
              <input
                type="number"
                className="form-control"
                name="salary"
                value={newJob.salary}
                onChange={handleJobChange}
                required
              />
            </div>
            {/* Job Type */}
            <div className="mb-3">
              <label className="form-label">Job Type</label>
              <select
                className="form-select"
                name="jobType"
                value={newJob.jobType}
                onChange={handleJobChange}
                required
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            {/* Requirements */}
            <div className="mb-3">
              <label className="form-label">Requirements (comma-separated)</label>
              <input
                type="text"
                className="form-control"
                name="requirements"
                value={newJob.requirements}
                onChange={handleJobChange}
              />
            </div>
            {/* Company Email */}
            <div className="mb-3">
              <label className="form-label">Company Email</label>
              <input
                type="email"
                className="form-control"
                name="companyEmail"
                value={newJob.companyEmail}
                onChange={handleJobChange}
                required
              />
            </div>
            {/* Company Name */}
            <div className="mb-3">
              <label className="form-label">Company Name</label>
              <input
                type="text"
                className="form-control"
                name="company"
                value={newJob.company}
                onChange={handleJobChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Post Job</button>
          </form>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3 mt-5">
        <p className="mb-0">&copy; 2024 Your Company Name. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AdminDashboard;
