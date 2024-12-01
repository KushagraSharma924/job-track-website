import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [newJob, setNewJob] = useState({ title: '', description: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch applications when the component mounts
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('token'); // Replace with your token retrieval logic
        const response = await axios.get('http://localhost:5001/api/applications/application', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(response.data.applications);
        setError('');
      } catch (err) {
        console.error(err.response?.data || err.message);
        setError('Failed to fetch applications.');
      }
    };
  
    fetchApplications();
  }, []);
  

  const handleJobChange = (e) => {
    setNewJob({ ...newJob, [e.target.name]: e.target.value });
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    
      if (!token) {
        throw new Error('No authentication token found.');
      }
    
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      };
    
      await axios.post('http://localhost:5001/api/jobs', newJob, config); // Pass the config with the request
      setSuccess('Job posted successfully!');
      setNewJob({ title: '', description: '' });
      setError('');
    } catch (err) {
      console.error('Error posting job:', err.message);
      setError('Failed to post job.');
    }
  }    

  return (
    <div className="container mt-5">
      <h2>Admin Dashboard</h2>
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      
      {/* Job Posting Form */}
      <form onSubmit={handlePostJob}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Job Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={newJob.title}
            onChange={handleJobChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            value={newJob.description}
            onChange={handleJobChange}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Post Job</button>
      </form>

      {/* Applications List */}
      <h3 className="mt-5">Applications</h3>
      {applications.length > 0 ? (
        <ul className="list-group">
          {applications.map((app) => (
            <li className="list-group-item" key={app._id}>
              <strong>{app.name}</strong> ({app.email})
              <p><a href={`http://localhost:5001/${app.resume}`} target="_blank" rel="noopener noreferrer">Download Resume</a></p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No applications found.</p>
      )}
    </div>
  );
};

export default AdminDashboard;
