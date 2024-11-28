import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginSignup from './pages/Auth';
import AdminLoginPage from './pages/Admin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginSignup />} />
        <Route path="/admin" element={<AdminLoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;