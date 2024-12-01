import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginSignup from './pages/Auth';
import AdminLoginPage from './pages/Admin';
import JobPage from './pages/JobPage';
import ApplyPage from './pages/ApplyPage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginSignup />} />
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route path="/dashboard" element={<JobPage />} />
        <Route path="/apply" element={<ApplyPage />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;