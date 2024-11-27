import React, { useState } from 'react';
import '../styles/Auth.css';

const LoginSignupPage = () => {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <div className="container">
      <div className="card">
        <div className="tabs">
          <button
            className={activeTab === 'login' ? 'active' : ''}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button
            className={activeTab === 'signup' ? 'active' : ''}
            onClick={() => setActiveTab('signup')}
          >
            Signup
          </button>
        </div>
        {activeTab === 'login' ? (
          <form className="form">
            <h2>Welcome Back!</h2>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="Enter your email" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Enter your password" required />
            </div>
            <button type="submit" className="btn">
              Login
            </button>
          </form>
        ) : (
          <form className="form">
            <h2>Create Your Account</h2>
            <div className="form-group">
              <label>Username</label>
              <input type="text" placeholder="Enter your username" required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="Enter your email" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Create a password" required />
            </div>
            <button type="submit" className="btn">
              Signup
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginSignupPage;
