import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [newJob, setNewJob] = useState({ title: '', description: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const adminId = '12345'; // Replace with actual admin ID

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/applications/${adminId}`);
        setApplications(response.data);
      } catch (err) {
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
      await axios.post('http://localhost:5001/api/jobs', newJob);
      setSuccess('Job posted successfully!');
      setNewJob({ title: '', description: '' });
    } catch (err) {
      setError('Failed to post job.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Admin Dashboard</h2>
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
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
      <h3 className="mt-5">Applications</h3>
      <ul className="list-group">
        {applications.map((app) => (
          <li className="list-group-item" key={app._id}>
            <strong>{app.name}</strong> ({app.email})
            <p>{app.resume}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
