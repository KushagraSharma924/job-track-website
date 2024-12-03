import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [applications, setApplications] = useState([]);
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

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5001/api/applications/application', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(response.data.applications);
        setError('');
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
    } catch {
      setError('Failed to post job.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Admin Dashboard</h2>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handlePostJob} className="card p-4 shadow-sm mb-5">
        <h3>Post a New Job</h3>
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

      <h3>Applications</h3>
      {applications.length > 0 ? (
        <ul className="list-group shadow-sm">
          {applications.map((app) => (
            <li key={app._id} className="list-group-item">
              <strong>{app.name}</strong> ({app.email})
              <a
                href={`http://localhost:5001/${app.resume}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-link float-end"
              >
                Download Resume
              </a>
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
