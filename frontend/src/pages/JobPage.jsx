import React, { useEffect, useState } from 'react';
import axios from 'axios';

const JobPage = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/jobs');
        setJobs(response.data);
      } catch (err) {
        setError('Failed to fetch jobs. Please try again later.');
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="container mt-5">
      <h2>Available Jobs</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="list-group">
        {jobs.map((job) => (
          <a
            href={`/apply?jobId=${job._id}`}
            className="list-group-item list-group-item-action"
            key={job._id}
          >
            <h5>{job.title}</h5>
            <p>{job.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
};

export default JobPage;
