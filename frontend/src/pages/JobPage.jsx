import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AppBar, Toolbar, Button, Typography, Container, Grid, Box, Slider, FormControlLabel, Checkbox, Drawer, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const JobPage = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [error, setError] = useState('');
  const [stipendRange, setStipendRange] = useState([0, 15000]);
  const [filters, setFilters] = useState({ remote: false, hybrid: false });
  const [openSidebar, setOpenSidebar] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/jobs');
        setJobs(response.data);
        setFilteredJobs(response.data); // Initially, display all jobs
      } catch (err) {
        setError('Failed to fetch jobs. Please try again later.');
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    // Filter jobs based on selected filters
    const applyFilters = () => {
      let filtered = jobs.filter(job => {
        // Filter by stipend range
        const isStipendInRange = job.salary >= stipendRange[0] && job.salary <= stipendRange[1];
        // Filter by work mode (remote, hybrid)
        const isRemote = filters.remote ? job.mode === 'remote' : true;
        const isHybrid = filters.hybrid ? job.mode === 'hybrid' : true;

        return isStipendInRange && isRemote && isHybrid;
      });

      setFilteredJobs(filtered);
    };

    applyFilters();
  }, [filters, stipendRange, jobs]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleStipendChange = (event, newValue) => {
    setStipendRange(newValue);
  };

  const handleFilterChange = (event) => {
    setFilters({ ...filters, [event.target.name]: event.target.checked });
  };

  const toggleSidebar = () => {
    setOpenSidebar(!openSidebar);
  };

  return (
    <>
      {/* Navbar */}
      <AppBar position="sticky">
  <Toolbar>
    <img 
      src="/images/IIC Logo Transarent (Black) [PNG].png" 
      alt="Job Portal Logo" 
      style={{
        height: '100%', 
        maxHeight: '56px', // Ensures it fits the AppBar height
        marginRight: '16px',
        objectFit: 'contain'
      }} 
    />
    <Typography variant="h6" sx={{ flexGrow: 1 }}>
      {/* Optional additional text or empty for just the image */}
    </Typography>
    <Button color="inherit" onClick={handleLogout}>Logout</Button>
  </Toolbar>
</AppBar>



      <Container sx={{ marginTop: 4 }}>
        <Grid container spacing={4}>
          {/* Sidebar */}
          <Grid item xs={12} md={3}>
            <Drawer
              anchor="left"
              open={openSidebar}
              onClose={toggleSidebar}
              sx={{
                width: 240,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                  width: 240,
                  boxSizing: 'border-box',
                },
              }}
            >
              <Box sx={{ padding: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Filters
                </Typography>

                {/* Stipend Range Slider */}
                <Typography gutterBottom>Stipend Range</Typography>
                <Slider
                  value={stipendRange}
                  onChange={handleStipendChange}
                  valueLabelDisplay="auto"
                  valueLabelFormatter={(value) => `${value}`}
                  min={0}
                  max={15000}
                />
                <Typography variant="body2">
                  ₹{stipendRange[0]} - ₹{stipendRange[1]}
                </Typography>

                {/* Work Mode Filters */}
                <FormControlLabel
                  control={<Checkbox checked={filters.remote} onChange={handleFilterChange} name="remote" />}
                  label="Remote"
                />
                <FormControlLabel
                  control={<Checkbox checked={filters.hybrid} onChange={handleFilterChange} name="hybrid" />}
                  label="Hybrid"
                />
              </Box>
            </Drawer>
            <Button variant="contained" onClick={toggleSidebar}>Toggle Filters</Button>
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
              Available Job Listings
            </Typography>

            {/* Job Listings (Horizontal List) */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {filteredJobs.map((job) => (
                <Box
                  key={job._id}
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    border: '1px solid #ddd',
                    padding: 2,
                    borderRadius: 2,
                    width: '100%',
                    boxShadow: 2,
                  }}
                >
                  {/* Job Title */}
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h5" gutterBottom>
                      {job.title}
                    </Typography>

                    {/* Location and Salary */}
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Chip label={`Location: ${job.location}`} color="primary" size="small" />
                      <Chip label={`Salary: ₹${job.salary}`} color="secondary" size="small" />
                    </Box>
                  </Box>

                  {/* Apply Button */}
                  <Button
                    size="small"
                    color="primary"
                    href={`/apply?jobId=${job._id}`}
                  >
                    Apply Now
                  </Button>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default JobPage;
