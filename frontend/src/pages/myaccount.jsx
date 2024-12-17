import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Box, Container, Card, CardContent, CircularProgress, Button } from '@mui/material';

const MyDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://job-web-backend-2srf.onrender.com/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch profile. Please try again later.');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Dashboard
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ marginBottom: 2 }}>
          {error}
        </Typography>
      ) : profile ? (
        <Card sx={{ boxShadow: 2, padding: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Welcome, {profile.firstName} {profile.lastName}
            </Typography>
            <Typography variant="body1">
              <strong>Email:</strong> {profile.email}
            </Typography>
            <Typography variant="body1">
              <strong>College:</strong> {profile.college}
            </Typography>
            <Typography variant="body1">
              <strong>Graduation Year:</strong> {profile.graduationYear}
            </Typography>
            <Typography variant="body1">
              <strong>Year:</strong> {profile.year}
            </Typography>
            <Typography variant="body1">
              <strong>Branch:</strong> {profile.branch}
            </Typography>
            {profile.resume && (
              <Box sx={{ marginTop: 2 }}>
                <Typography variant="body1">
                  <strong>Resume:</strong>
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  href={`https://job-web-backend-2srf.onrender.com/${profile.resume}`}
                  target="_blank"
                >
                  Download Resume
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      ) : (
        <Typography variant="body1" color="textSecondary">
          No profile found. Please complete your profile setup.
        </Typography>
      )}
    </Container>
  );
};

export default MyDashboard;