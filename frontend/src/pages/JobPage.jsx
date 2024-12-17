import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AppBar, Toolbar, Button, Typography, Container, Grid, Box, TextField, Slider, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const JobPage = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [error, setError] = useState('');
  const [stipendRange, setStipendRange] = useState([0, 15000]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('https://job-web-backend-2srf.onrender.com/api/jobs');
        setJobs(response.data);
        setFilteredJobs(response.data);
      } catch (err) {
        setError('Failed to fetch jobs. Please try again later.');
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      const filtered = jobs.filter((job) => {
        const stipendMatch = job.salary >= stipendRange[0] && job.salary <= stipendRange[1];

        const requirements = Array.isArray(job.requirements)
          ? job.requirements.join(', ')
          : job.requirements || '';

        const keyword = searchKeyword.toLowerCase();
        const keywordMatch =
          searchKeyword === '' ||
          job.title.toLowerCase().includes(keyword) ||
          job.company.toLowerCase().includes(keyword) ||
          job.description.toLowerCase().includes(keyword) ||
          requirements.toLowerCase().includes(keyword);

        return stipendMatch && keywordMatch;
      });

      setFilteredJobs(filtered);
    };

    applyFilters();
  }, [stipendRange, searchKeyword, jobs]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <>
      {/* Navbar */}
      <AppBar position="sticky">
        <Toolbar>
          <img
            src="../images/IIC Logo Transarent (Black) [PNG].png"
            alt="Job Portal Logo"
            style={{
              height: '100%',
              maxHeight: '56px',
              marginRight: '16px',
              objectFit: 'contain',
            }}
          />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            InternShip Fair
          </Typography>
          <Button color="inherit" onClick={() => navigate('/mydashboard')}>
            My Dashboard
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ marginTop: 4 }}>
        <Grid container spacing={4}>
          {/* Sidebar for Filters */}
          <Grid item xs={12} md={3}>
            <Box
              sx={{
                padding: 2,
                border: '1px solid #ddd',
                borderRadius: 2,
                boxShadow: 1,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Filters
              </Typography>

              {/* Search Field */}
              <TextField
                label="Search Keywords"
                variant="outlined"
                fullWidth
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                sx={{ marginBottom: 3 }}
              />

              {/* Stipend Range Slider */}
              <Typography gutterBottom>Stipend Range (₹)</Typography>
              <Slider
                value={stipendRange}
                onChange={(e, newValue) => setStipendRange(newValue)}
                valueLabelDisplay="auto"
                min={0}
                max={20000}
                sx={{ marginBottom: 2 }}
              />
              <Typography variant="body2">
                Range: ₹{stipendRange[0]} - ₹{stipendRange[1]}
              </Typography>
            </Box>
          </Grid>

          {/* Job Listings */}
          <Grid item xs={12} md={9}>
            {/* Error Alert */}
            {error && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                {error}
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
              </div>
            )}

            <Typography variant="h4" component="h2" gutterBottom align="center">
              Internships
            </Typography>

            {/* Job Cards */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <Box
                    key={job._id}
                    sx={{
                      border: '1px solid #ddd',
                      padding: 2,
                      borderRadius: 2,
                      boxShadow: 2,
                    }}
                  >
                    {/* Job Title and Company */}
                    <Typography variant="h6" component="h5" gutterBottom>
                      {job.title}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      Company: {job.company}
                    </Typography>

                    {/* Location and Salary */}
                    <Box sx={{ display: 'flex', gap: 2, marginTop: 1 }}>
                      <Chip label={`Location: ${job.location}`} color="primary" size="small" />
                      <Chip label={`Salary: ₹${job.salary}`} color="secondary" size="small" />
                    </Box>

                    {/* Requirements */}
                    <Typography variant="body2" sx={{ marginTop: 1 }}>
                      Requirements: {job.requirements.join(', ')}
                    </Typography>

                    {/* Apply Button */}
                    <Button
                      size="small"
                      color="primary"
                      href={`/apply?jobId=${job._id}`}
                      sx={{ marginTop: 2 }}
                    >
                      Apply Now
                    </Button>
                  </Box>
                ))
              ) : (
                <Typography variant="body1" align="center">
                  No jobs posted till now
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default JobPage;