import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '', 
  });

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ email: '', password: '', name: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = isLogin
      ? 'http://localhost:5001/api/auth/login'
      : 'http://localhost:5001/api/auth/register';

    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : { name: formData.name, email: formData.email, password: formData.password, role: 'jobSeeker' };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error('Error:', data.error || 'Something went wrong');
        alert(data.error || 'Something went wrong');
      } else {
        if (isLogin) {
          localStorage.setItem('token', data.token);
          alert('Login successful!');
          //navigate("")
        } else {
          alert('Registration successful! You can now log in.');
          toggleForm();
        }
      }
    } catch (err) {
      console.error('Fetch error:', err);
      alert('Network error. Please try again later.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title text-center">{isLogin ? 'Login' : 'Sign Up'}</h3>
              <form onSubmit={handleSubmit}>
                {!isLogin && (
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                )}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    {isLogin ? 'Login' : 'Sign Up'}
                  </button>
                </div>
              </form>
              <div className="text-center mt-3">
                <button
                  className="btn btn-link"
                  onClick={toggleForm}
                  style={{ textDecoration: 'none' }}
                >
                  {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;